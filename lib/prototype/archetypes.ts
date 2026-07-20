import type { NotionDomain, NotionUseCase } from '@/lib/notion/client'
import type { RatingsMap } from './types'

export interface DomainScore {
  domainId: string
  domainName: string
  average: number
  count: number
}

export type Direction = 'warm' | 'cool'

export interface ArchetypeResult {
  headline: string
  summary: string
  /** Which branch of the model produced this result — useful for tests/simulation. */
  kind: 'domain' | 'evenKeel' | 'blankSlate'
  standoutDomainName?: string
  direction?: Direction
  levelBadge: string
  polarizationBadge: 'Steady' | 'Polarized'
  overallAverage: number
  ratingCount: number
  domainScores: DomainScore[]
}

/**
 * A domain needs at least this many ratings before it counts toward the archetype
 * or appears in the domain breakdown — otherwise a single noisy rating (the common
 * case, since a 7-card bundle rarely touches the same domain twice) would stand in
 * for a whole domain. This is a count, not a scale value, so it isn't affected by
 * the 4→5-point migration — but is worth re-tuning anyway now that domain averages
 * feed a deviation calculation, which amplifies low-n noise more than plain
 * averaging did. See docs/sprint-archetype-logic.md.
 */
export const MIN_RATINGS_PER_DOMAIN = 2

/**
 * Minimum |deviation| (a confident domain's average vs. the visitor's own overall
 * average) required to treat that domain as a real standout rather than sampling
 * noise. Placeholder pending the synthetic-data simulation described in
 * docs/sprint-archetype-logic.md — not yet validated against real or simulated
 * distributions.
 */
export const MIN_STANDOUT_DEVIATION = 0.3

/**
 * 5-point level badge, bucketing the visitor's own overall average. Boundaries are
 * a first pass (even split across the 1–5 range) pending real-data validation.
 */
const LEVELS: { max: number; label: string }[] = [
  { max: 1.8, label: 'Sus' },
  { max: 2.6, label: 'Cautious' },
  { max: 3.4, label: 'Neutral' },
  { max: 4.2, label: 'Curious' },
  { max: Infinity, label: 'Bet' },
]

function pickLevel(average: number): string {
  return (LEVELS.find((level) => average <= level.max) ?? LEVELS[LEVELS.length - 1]).label
}

/**
 * Polarization badge: runs on raw individual ratings, not the equal-domain-weighted
 * average, since domain-averaging can hide real bimodality (e.g. a domain with one
 * Never and one Always nets to a domain average that erases the extremes). Poles
 * redefined as 1 and 5 for the 5-point scale; the count/share/shape-check constants
 * carry over unchanged from the 4-point proposal as placeholders — not yet
 * re-validated. See docs/sprint-archetype-logic.md.
 */
const POLE_LOW = 1
const POLE_HIGH = 5
const MIN_POLE_COUNT = 2
const MIN_POLE_SHARE = 0.15
const MIN_RATINGS_FOR_SHAPE_CHECK = 7

function pickPolarization(ratings: RatingsMap): 'Steady' | 'Polarized' {
  const values = Object.values(ratings).map((rating) => rating.value)
  const total = values.length
  if (total < MIN_RATINGS_FOR_SHAPE_CHECK) return 'Steady'

  const lowCount = values.filter((value) => value === POLE_LOW).length
  const highCount = values.filter((value) => value === POLE_HIGH).length

  const isPolarized =
    lowCount >= MIN_POLE_COUNT &&
    lowCount / total >= MIN_POLE_SHARE &&
    highCount >= MIN_POLE_COUNT &&
    highCount / total >= MIN_POLE_SHARE

  return isPolarized ? 'Polarized' : 'Steady'
}

interface ArchetypeCopy {
  headline: string
  summary: string
}

interface DomainArchetype {
  warm: ArchetypeCopy
  cool: ArchetypeCopy
}

/**
 * 20 domain archetypes (10 domains × warm/cool), keyed by domain name as returned
 * from Notion. Two fully distinct names per domain rather than one name with
 * branching copy — a deliberate reversal from the first draft, see
 * docs/sprint-archetype-logic.md.
 */
export const DOMAIN_ARCHETYPES: Record<string, DomainArchetype> = {
  Healthcare: {
    warm: {
      headline: 'The Trusting Patient',
      summary:
        "When it comes to your health, you're the first to hand AI the chart — this is where your trust runs deepest.",
    },
    cool: {
      headline: 'The Second Opinion',
      summary:
        "Your body is where you draw the clearest line — you want a human take before AI gets a say.",
    },
  },
  Finances: {
    warm: {
      headline: 'The Open Ledger',
      summary:
        "Money is where you're most willing to let AI take the wheel — numbers don't lie, and apparently neither does the algorithm.",
    },
    cool: {
      headline: 'The Penny Pincher',
      summary: "Your money is the one thing you're keeping firmly in human hands — no algorithm gets near the account.",
    },
  },
  'Home & Personal Life': {
    warm: {
      headline: 'The Open Door',
      summary:
        "Home is where you've let AI in the most — from your calendar to your relationships, it's practically part of the household.",
    },
    cool: {
      headline: 'The Private Room',
      summary: "Home is sacred ground — this is the one room AI hasn't been invited into.",
    },
  },
  'Leisure & Hospitality': {
    warm: {
      headline: 'The Concierge',
      summary: "Vacation planning and downtime are where you hand it over gladly — let the algorithm book the trip.",
    },
    cool: {
      headline: 'The Do-Not-Disturb',
      summary: "Your downtime is yours — this is the one place you don't want AI's fingerprints.",
    },
  },
  Robotics: {
    warm: {
      headline: 'The Machine Whisperer',
      summary: "Robots and automation are where you're most at ease — bring on the machines.",
    },
    cool: {
      headline: 'The Uncanny Valley',
      summary:
        "Physical automation is where your comfort runs out fastest — a screen is one thing, a machine in the room is another.",
    },
  },
  Productivity: {
    warm: {
      headline: 'The Inbox Zero',
      summary:
        "Getting things done is where you're most eager to offload to AI — anything that saves you time earns your trust fast.",
    },
    cool: {
      headline: 'The Slow Burn',
      summary: "How you spend your time is oddly the one thing you don't want managed for you — some things are worth doing slow.",
    },
  },
  Mobility: {
    warm: {
      headline: 'The Cruise Control',
      summary:
        "Getting from A to B is where you're most comfortable letting AI take over — hands off the wheel, literally.",
    },
    cool: {
      headline: 'The Backseat Driver',
      summary: "Getting around is the one place you still want a human hand on the wheel.",
    },
  },
  Education: {
    warm: {
      headline: 'The Extra Credit',
      summary:
        "Learning and skill-building are where you're most willing to let AI teach — you'll take the help wherever it gets you further.",
    },
    cool: {
      headline: 'The Hall Monitor',
      summary: "Learning is the one place you don't want a shortcut — this still feels like something you should do yourself.",
    },
  },
  'Legal & Public Services': {
    warm: {
      headline: 'The Open Case',
      summary:
        "Paperwork, benefits, and bureaucracy are where you're most relieved to have AI step in — no one enjoys reading fine print.",
    },
    cool: {
      headline: 'The Fine Print',
      summary: "Rules, rights, and paperwork are the one place you don't trust a shortcut — too much on the line to hand it over.",
    },
  },
  'Media & Culture': {
    warm: {
      headline: 'The Remix',
      summary: "Art, writing, and culture are where you're most open to AI — you care more about the result than who (or what) made it.",
    },
    cool: {
      headline: 'The Art Defender',
      summary: "Creativity is the one place you want to stay entirely human-made — this is where AI hasn't earned a seat.",
    },
  },
}

export const EVEN_KEEL: ArchetypeCopy = {
  headline: 'The Even Keel',
  summary:
    "You're remarkably consistent — whatever your take on AI, it holds steady across everything you've rated so far, no domain pulling ahead of the rest.",
}

export const BLANK_SLATE: ArchetypeCopy = {
  headline: 'The Blank Slate',
  summary:
    "You haven't rated enough across different domains yet for a clear lean to show — keep going and we'll find where you stand out.",
}

export function computeArchetype(
  ratings: RatingsMap,
  useCases: NotionUseCase[],
  domains: NotionDomain[]
): ArchetypeResult {
  const domainNameById = new Map(domains.map((d) => [d.notionId, d.name]))
  const byDomain = new Map<string, { sum: number; count: number }>()
  let rawSum = 0
  let ratingCount = 0

  for (const useCase of useCases) {
    const rating = ratings[useCase.notionId]
    if (!rating) continue

    rawSum += rating.value
    ratingCount += 1

    const domainKey = useCase.domainId ?? 'unknown'
    const entry = byDomain.get(domainKey) ?? { sum: 0, count: 0 }
    entry.sum += rating.value
    entry.count += 1
    byDomain.set(domainKey, entry)
  }

  const domainScores: DomainScore[] = Array.from(byDomain.entries())
    .filter(([, { count }]) => count >= MIN_RATINGS_PER_DOMAIN)
    .map(([domainId, { sum: domainSum, count: domainCount }]) => ({
      domainId,
      domainName: domainNameById.get(domainId) ?? 'Other',
      average: domainSum / domainCount,
      count: domainCount,
    }))
    .sort((a, b) => b.average - a.average)

  // Equal-domain-weight: average the domain averages, not the raw ratings, so a
  // domain the random bundle happened to serve more often doesn't dominate the
  // score. Falls back to the raw per-rating average when no domain has reached
  // the confidence threshold yet. See docs/sprint-archetype-logic.md.
  const overallAverage =
    domainScores.length > 0
      ? domainScores.reduce((sum, d) => sum + d.average, 0) / domainScores.length
      : ratingCount > 0
        ? rawSum / ratingCount
        : 0

  const levelBadge = pickLevel(overallAverage)
  const polarizationBadge = pickPolarization(ratings)

  const base = { levelBadge, polarizationBadge, overallAverage, ratingCount, domainScores }

  // Fewer than 2 confident domains: deviation is undefined or trivially 0 by
  // construction (a single domain's average *is* the overall average under
  // equal-domain-weighting) — a coverage gap, not a real personality signal.
  if (domainScores.length < 2) {
    return { ...base, kind: 'blankSlate', headline: BLANK_SLATE.headline, summary: BLANK_SLATE.summary }
  }

  const deviations = domainScores.map((domain) => ({
    domain,
    deviation: domain.average - overallAverage,
  }))

  const maxAbsDeviation = Math.max(...deviations.map((d) => Math.abs(d.deviation)))

  // Enough confident domains, but none diverges meaningfully from the visitor's
  // own baseline — a real, distinct profile, not a data gap.
  if (maxAbsDeviation < MIN_STANDOUT_DEVIATION) {
    return { ...base, kind: 'evenKeel', headline: EVEN_KEEL.headline, summary: EVEN_KEEL.summary }
  }

  // Standout = largest |deviation|; ties broken by higher rating count — more
  // data behind the signal wins.
  const standout = deviations.reduce((best, current) => {
    const bestAbs = Math.abs(best.deviation)
    const currentAbs = Math.abs(current.deviation)
    if (currentAbs > bestAbs) return current
    if (currentAbs === bestAbs && current.domain.count > best.domain.count) return current
    return best
  })

  const direction: Direction = standout.deviation > 0 ? 'warm' : 'cool'
  const archetype = DOMAIN_ARCHETYPES[standout.domain.domainName]?.[direction] ?? EVEN_KEEL

  return {
    ...base,
    kind: 'domain',
    standoutDomainName: standout.domain.domainName,
    direction,
    headline: archetype.headline,
    summary: archetype.summary,
  }
}
