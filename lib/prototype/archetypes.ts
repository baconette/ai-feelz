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

export function computeArchetype(
  ratings: RatingsMap,
  useCases: NotionUseCase[],
  domains: NotionDomain[]
): ArchetypeResult {
  const domainNameById = new Map(domains.map((d) => [d.notionId, d.name]))
  const byDomain = new Map<string, { sum: number; count: number }>()
  let sum = 0
  let count = 0

  for (const useCase of useCases) {
    const rating = ratings[useCase.notionId]
    if (!rating) continue

    sum += rating.value
    count += 1

    const domainKey = useCase.domainId ?? 'unknown'
    const entry = byDomain.get(domainKey) ?? { sum: 0, count: 0 }
    entry.sum += rating.value
    entry.count += 1
    byDomain.set(domainKey, entry)
  }

  const overallAverage = count > 0 ? sum / count : 0
  const tier = pickTier(overallAverage)

  const domainScores: DomainScore[] = Array.from(byDomain.entries())
    .map(([domainId, { sum: domainSum, count: domainCount }]) => ({
      domainId,
      domainName: domainNameById.get(domainId) ?? 'Other',
      average: domainSum / domainCount,
      count: domainCount,
    }))
    .sort((a, b) => b.average - a.average)

  return {
    headline: tier.headline,
    summary: tier.summary,
    overallAverage,
    ratingCount: count,
    domainScores,
  }
}
