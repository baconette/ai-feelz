/**
 * Synthetic-data harness for tuning the domain-affinity archetype model
 * (docs/archetype-logic.md). Two jobs:
 *
 *   1. Named test cases — sparse/dense/polarized/consistent/flat/blank-slate/
 *      tie-break — run through the real `computeArchetype` and printed, so a
 *      human can eyeball whether the result is sensible.
 *   2. A noise-floor simulation that produced (and now verifies)
 *      STANDOUT_THRESHOLD_BY_DOMAIN_COUNT and the MIN_RATINGS_PER_DOMAIN=2
 *      decision in lib/prototype/archetypes.ts — many synthetic visitors with
 *      NO real domain preference (ratings drawn around one personal baseline,
 *      domains are interchangeable) are run through the model, and we look at
 *      how large `maxAbsDeviation` gets by chance alone, and what share of
 *      them would still clear the real per-domain-count threshold (i.e. get a
 *      spurious domain archetype instead of The Even Keel).
 *
 * Run with: npx tsx scripts/simulate-archetypes.ts
 */

import {
  computeArchetype,
  DOMAIN_ARCHETYPES,
  MIN_RATINGS_PER_DOMAIN,
  getStandoutThreshold,
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
      ` overall=${result.overallAverage.toFixed(2)}` +
      (result.kind === 'domain' ? ` standout=${result.standoutDomainName} (${result.direction})` : '')
  )
}

// ---------------------------------------------------------------------------
// 1. Named test cases
// ---------------------------------------------------------------------------

console.log('--- Named test cases ---\n')

run('Blank Slate (n=1 domain)', {
  Healthcare: [4, 4, 3],
  Finances: [3], // below MIN_RATINGS_PER_DOMAIN, excluded — only Healthcare is confident
})

run('Worked example (doc)', {
  Healthcare: [4, 4, 3],
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
  Education: [4],
  Robotics: [1],
  Productivity: [3],
  Finances: [4],
})

run('Dense (multiple bundles)', {
  Healthcare: [4, 4, 3, 4, 4],
  Finances: [2, 3, 2, 2],
  'Home & Personal Life': [4, 3, 4],
  'Leisure & Hospitality': [4, 3, 4],
  Robotics: [3, 2, 3],
  Productivity: [4, 4, 3],
  Mobility: [2, 2, 1],
  Education: [3, 4, 3],
  'Legal & Public Services': [2, 3, 2],
  'Media & Culture': [4, 4, 3],
})

run('Polarized (Never/Always split)', {
  Healthcare: [1, 1, 4, 4, 1, 1, 4],
  Finances: [3, 3],
})

run('Consistent (all mid, low variance)', {
  Healthcare: [3, 3],
  Finances: [3, 3],
  Education: [3, 3],
})

run('Tie-break (equal |deviation|, unequal n)', {
  // overall = (4 + 1 + 2.5) / 3 = 2.5; Healthcare +1.5 (n=2), Mobility -1.5 (n=3)
  Healthcare: [4, 4],
  Mobility: [1, 1, 1],
  Education: [2, 3],
})

// ---------------------------------------------------------------------------
// 2. Noise-floor simulation verifying STANDOUT_THRESHOLD_BY_DOMAIN_COUNT /
//    MIN_RATINGS_PER_DOMAIN
// ---------------------------------------------------------------------------

function gaussian(sigma: number): number {
  // Box-Muller transform.
  const u1 = Math.random() || 1e-9
  const u2 = Math.random()
  return sigma * Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2)
}

function clampLikert(x: number): LikertValue {
  return Math.min(4, Math.max(1, Math.round(x))) as LikertValue
}

/**
 * A "no true domain preference" visitor: one personal baseline `mu`, and every
 * individual rating in every domain is `mu` plus noise — domains are
 * interchangeable, so any deviation that shows up is pure sampling noise.
 * Noise sigma is an assumption (0.8 on the 1-4 scale), not derived from data.
 */
function simulateNullVisitor(domainCount: number, ratingsPerDomain: number, sigma: number) {
  const mu = 1 + Math.random() * 3 // uniform personal baseline in [1, 4]
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
console.log('(assumption: per-rating noise sigma = 0.8 on the 1-4 scale; personal baseline mu ~ U(1,4))\n')

const TRIALS = 50000
const SIGMA = 0.8
const domainCounts = [2, 3, 4, 5, 6, 7, 8, 9, 10]
const ratingsPerDomainOptions = [MIN_RATINGS_PER_DOMAIN, 3, 4]

console.log(
  'domains'.padEnd(8) +
    'n/domain'.padEnd(10) +
    'p50'.padEnd(8) +
    'p75'.padEnd(8) +
    'p90'.padEnd(8) +
    'p95'.padEnd(8) +
    'threshold'.padEnd(11) +
    'falsePos'
)

for (const domainCount of domainCounts) {
  const threshold = getStandoutThreshold(domainCount)
  for (const ratingsPerDomain of ratingsPerDomainOptions) {
    const samples: number[] = []
    for (let t = 0; t < TRIALS; t++) {
      samples.push(simulateNullVisitor(domainCount, ratingsPerDomain, SIGMA))
    }
    samples.sort((a, b) => a - b)
    const falsePositiveRate = samples.filter((s) => s >= threshold).length / samples.length

    console.log(
      String(domainCount).padEnd(8) +
        String(ratingsPerDomain).padEnd(10) +
        percentile(samples, 50).toFixed(2).padEnd(8) +
        percentile(samples, 75).toFixed(2).padEnd(8) +
        percentile(samples, 90).toFixed(2).padEnd(8) +
        percentile(samples, 95).toFixed(2).padEnd(8) +
        threshold.toFixed(2).padEnd(11) +
        `${(falsePositiveRate * 100).toFixed(1)}%`
    )
  }
}

console.log(
  '\n"falsePos" = share of no-preference visitors who would still get a domain archetype\n' +
    'instead of The Even Keel, at the real per-domain-count threshold (STANDOUT_THRESHOLD_\n' +
    'BY_DOMAIN_COUNT). The n/domain=2 rows (our real MIN_RATINGS_PER_DOMAIN) should land near\n' +
    'the ~10% target; n/domain=3/4 rows show raising it would barely help further, since\n' +
    'domain count — not ratings-per-domain — drives the noise floor.'
)
