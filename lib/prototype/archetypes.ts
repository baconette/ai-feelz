import type { NotionDomain, NotionUseCase } from '@/lib/notion/client'
import type { RatingsMap } from './types'

export interface DomainScore {
  domainId: string
  domainName: string
  average: number
  count: number
}

export interface ArchetypeResult {
  headline: string
  summary: string
  overallAverage: number
  ratingCount: number
  domainScores: DomainScore[]
}

const TIERS: { max: number; headline: string; summary: string }[] = [
  {
    max: 1.75,
    headline: 'The Skeptical Observer',
    summary: "You'd rather a human handled most of this — AI hasn't earned much trust from you yet.",
  },
  {
    max: 2.5,
    headline: 'The Cautious Pragmatist',
    summary: "You're open to AI here and there, but you want a good reason before you hand something over.",
  },
  {
    max: 3.25,
    headline: 'The Curious Adopter',
    summary: 'You generally welcome AI into your life — you just judge it case by case.',
  },
  {
    max: Infinity,
    headline: 'The Enthusiastic Early Adopter',
    summary: "You're eager to let AI take the wheel across most of what you rated.",
  },
]

function pickTier(average: number) {
  return TIERS.find((tier) => average <= tier.max) ?? TIERS[TIERS.length - 1]
}

/**
 * A domain needs at least this many ratings before it counts toward the archetype
 * or appears in the domain breakdown — otherwise a single noisy rating (the common
 * case, since a 7-card bundle rarely touches the same domain twice) would stand in
 * for a whole domain. Decided in the archetype-logic design sprint, see
 * docs/sprint-archetype-logic.md.
 */
export const MIN_RATINGS_PER_DOMAIN = 2

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
  // the confidence threshold yet, since the archetype is always shown at full
  // confidence regardless of sample size (also a design-sprint decision).
  const overallAverage =
    domainScores.length > 0
      ? domainScores.reduce((sum, d) => sum + d.average, 0) / domainScores.length
      : ratingCount > 0
        ? rawSum / ratingCount
        : 0

  const tier = pickTier(overallAverage)

  return {
    headline: tier.headline,
    summary: tier.summary,
    overallAverage,
    ratingCount,
    domainScores,
  }
}
