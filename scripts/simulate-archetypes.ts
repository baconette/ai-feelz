/**
 * Synthetic-data harness for tuning the domain-affinity archetype model
 * (docs/sprint-archetype-logic.md). Two jobs:
 *
 *   1. Named test cases — sparse/dense/polarized/consistent/flat/blank-slate/
 *      tie-break — run through the real `computeArchetype` and printed, so a
 *      human can eyeball whether the result is sensible.
 *   2. A noise-floor simulation for MIN_STANDOUT_DEVIATION and
 *      MIN_RATINGS_PER_DOMAIN — many synthetic visitors with NO real domain
 *      preference (ratings drawn around one personal baseline, domains are
 *      interchangeable) are run through the model, and we look at how large
 *      `maxAbsDeviation` gets by chance alone. Any real threshold needs to sit
 *      above that noise floor, or "no preference" visitors will spuriously get
 *      a domain archetype instead of The Even Keel.
 *
 * Run with: npx tsx scripts/simulate-archetypes.ts
 */

import {
  computeArchetype,
  DOMAIN_ARCHETYPES,
  MIN_RATINGS_PER_DOMAIN,
  MIN_STANDOUT_DEVIATION,
} from '../lib/prototype/archetypes'
import type { LikertValue, RatingsMap } from '../lib/prototype/types'
import type { NotionDomain, NotionUseCase } from '../lib/notion/client'

// ---------------------------------------------------------------------------
// Fixtures: 10 domains matching DOMAIN_ARCHETYPES keys, with a deep enough
// pool of use cases per domain to rate as many synthetic use cases as needed.
// ---------------------------------------------------------------------------

const DOMAIN_NAMES = Object.keys(DOMAIN_ARCHETYPES)
const USE_CASES_PER_DOMAIN = 20

const domains: NotionDomain[] = DOMAIN_NAMES.map((name) => ({
  notionId: name,
  name,
  description: '',
  imageUrl: null,
}))

const useCases: NotionUseCase[] = DOMAIN_NAMES.flatMap((domainId) =>
  Array.from({ length: USE_CASES_PER_DOMAIN }, (_, i) => ({
    notionId: `${domainId}::${i}`,
    domainId,
    subdomain: 'synthetic',
    useCase: `synthetic use case ${i}`,
    alias: '',
    description: '',
    order: i,
    status: 'active',
    published: true,
  }))
)

/** Build a RatingsMap from `{ domainName: LikertValue[] }`, in use-case order. */
function buildRatings(profile: Partial<Record<string, LikertValue[]>>): RatingsMap {
  const ratings: RatingsMap = {}
  for (const [domainId, values] of Object.entries(profile)) {
    values?.forEach((value, i) => {
      ratings[`${domainId}::${i}`] = { value }
    })
  }
  return ratings
}

function run(label: string, profile: Partial<Record<string, LikertValue[]>>) {
  const result = computeArchetype(buildRatings(profile), useCases, domains)
  console.log(
    `${label.padEnd(28)} kind=${result.kind.padEnd(10)} headline="${result.headline}"` +
      ` overall=${result.overallAverage.toFixed(2)} level=${result.levelBadge}` +
      ` polarization=${result.polarizationBadge}` +
      (result.kind === 'domain' ? ` standout=${result.standoutDomainName} (${result.direction})` : '')
  )
}

// ---------------------------------------------------------------------------
// 1. Named test cases
// ---------------------------------------------------------------------------

console.log('--- Named test cases ---\n')

run('Blank Slate (n=1 domain)', {
  Healthcare: [4, 5, 4],
  Finances: [3], // below MIN_RATINGS_PER_DOMAIN, excluded — only Healthcare is confident
})

run('Worked example (doc)', {
  Healthcare: [4, 5, 4],
  Mobility: [2, 1],
  Finances: [3], // excluded
  Education: [3, 4, 3, 3],
})

run('Even Keel (flat, dense)', {
  Healthcare: [3, 3, 4],
  Finances: [3, 3],
  Education: [3, 3, 2, 3],
  'Media & Culture': [3, 4],
})

run('Sparse (one bundle, 7 ratings)', {
  Healthcare: [4, 3],
  Mobility: [2],
  Education: [5],
  Robotics: [1],
  Productivity: [3],
  Finances: [4],
})

run('Dense (multiple bundles)', {
  Healthcare: [5, 5, 4, 5, 4],
  Finances: [2, 3, 2, 2],
  'Home & Personal Life': [4, 3, 4],
  'Leisure & Hospitality': [5, 4, 5],
  Robotics: [3, 2, 3],
  Productivity: [4, 4, 3],
  Mobility: [2, 2, 1],
  Education: [3, 4, 3],
  'Legal & Public Services': [2, 3, 2],
  'Media & Culture': [4, 4, 5],
})

run('Polarized (Never/Always split)', {
  Healthcare: [1, 1, 5, 5, 1, 1, 5],
  Finances: [3, 3],
})

run('Consistent (all mid, low variance)', {
  Healthcare: [3, 3],
  Finances: [3, 3],
  Education: [3, 3],
})

run('Tie-break (equal |deviation|, unequal n)', {
  // overall = (4.5 + 1.5 + 3) / 3 = 3.0; Healthcare +1.5 (n=2), Mobility -1.5 (n=3)
  Healthcare: [4, 5],
  Mobility: [2, 1, 1],
  Education: [3, 3],
})

// ---------------------------------------------------------------------------
// 2. Noise-floor simulation for MIN_STANDOUT_DEVIATION / MIN_RATINGS_PER_DOMAIN
// ---------------------------------------------------------------------------

function gaussian(sigma: number): number {
  // Box-Muller transform.
  const u1 = Math.random() || 1e-9
  const u2 = Math.random()
  return sigma * Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2)
}

function clampLikert(x: number): LikertValue {
  return Math.min(5, Math.max(1, Math.round(x))) as LikertValue
}

/**
 * A "no true domain preference" visitor: one personal baseline `mu`, and every
 * individual rating in every domain is `mu` plus noise — domains are
 * interchangeable, so any deviation that shows up is pure sampling noise.
 * Noise sigma is an assumption (0.8 on the 1-5 scale), not derived from data.
 */
function simulateNullVisitor(domainCount: number, ratingsPerDomain: number, sigma: number) {
  const mu = 1 + Math.random() * 4 // uniform personal baseline in [1, 5]
  const domainAverages: number[] = []

  for (let d = 0; d < domainCount; d++) {
    let sum = 0
    for (let r = 0; r < ratingsPerDomain; r++) {
      sum += clampLikert(mu + gaussian(sigma))
    }
    domainAverages.push(sum / ratingsPerDomain)
  }

  const overall = domainAverages.reduce((a, b) => a + b, 0) / domainAverages.length
  const maxAbsDeviation = Math.max(...domainAverages.map((avg) => Math.abs(avg - overall)))
  return maxAbsDeviation
}

function percentile(sorted: number[], p: number): number {
  const idx = Math.floor((p / 100) * (sorted.length - 1))
  return sorted[idx]
}

console.log('\n--- Noise floor: maxAbsDeviation for a visitor with NO real domain preference ---')
console.log('(assumption: per-rating noise sigma = 0.8 on the 1-5 scale; personal baseline mu ~ U(1,5))\n')

const TRIALS = 5000
const SIGMA = 0.8
const domainCounts = [2, 3, 5, 10]
const ratingsPerDomainOptions = [MIN_RATINGS_PER_DOMAIN, 3, 4]

console.log(
  'domains'.padEnd(8) +
    'n/domain'.padEnd(10) +
    'p50'.padEnd(8) +
    'p75'.padEnd(8) +
    'p90'.padEnd(8) +
    'p95'.padEnd(8) +
    `falsePos@${MIN_STANDOUT_DEVIATION}`
)

for (const domainCount of domainCounts) {
  for (const ratingsPerDomain of ratingsPerDomainOptions) {
    const samples: number[] = []
    for (let t = 0; t < TRIALS; t++) {
      samples.push(simulateNullVisitor(domainCount, ratingsPerDomain, SIGMA))
    }
    samples.sort((a, b) => a - b)
    const falsePositiveRate =
      samples.filter((s) => s >= MIN_STANDOUT_DEVIATION).length / samples.length

    console.log(
      String(domainCount).padEnd(8) +
        String(ratingsPerDomain).padEnd(10) +
        percentile(samples, 50).toFixed(2).padEnd(8) +
        percentile(samples, 75).toFixed(2).padEnd(8) +
        percentile(samples, 90).toFixed(2).padEnd(8) +
        percentile(samples, 95).toFixed(2).padEnd(8) +
        `${(falsePositiveRate * 100).toFixed(1)}%`
    )
  }
}

console.log(
  `\n"falsePos@${MIN_STANDOUT_DEVIATION}" = share of no-preference visitors who would still get a\n` +
    'domain archetype instead of The Even Keel, at the current MIN_STANDOUT_DEVIATION.\n' +
    'Read across a row (n/domain=2 vs 3 vs 4) to see how much raising MIN_RATINGS_PER_DOMAIN\n' +
    'would reduce false standouts versus just raising MIN_STANDOUT_DEVIATION.'
)
