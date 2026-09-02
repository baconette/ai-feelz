import { describe, expect, it } from 'vitest'
import {
  computeArchetype,
  deriveStandoutArchetype,
  getStandoutThreshold,
  MIN_RATINGS_PER_DOMAIN,
  DOMAIN_ARCHETYPES,
  EVEN_KEEL,
  BLANK_SLATE,
  type DomainScore,
} from './archetypes'
import type { NotionDomain, NotionUseCase } from '@/lib/notion/client'
import type { LikertValue, RatingsMap } from './types'

function domainScore(domainName: string, average: number, count: number): DomainScore {
  return { domainId: domainName, domainName, average, count }
}

describe('getStandoutThreshold', () => {
  it('clamps below the indexed range to the count-2 threshold', () => {
    expect(getStandoutThreshold(0)).toBe(getStandoutThreshold(2))
    expect(getStandoutThreshold(1)).toBe(getStandoutThreshold(2))
  })

  it('clamps above the indexed range to the count-10 threshold', () => {
    expect(getStandoutThreshold(11)).toBe(getStandoutThreshold(10))
    expect(getStandoutThreshold(100)).toBe(getStandoutThreshold(10))
  })

  it('returns the exact indexed value at 2 and 10', () => {
    expect(getStandoutThreshold(2)).toBe(0.6)
    expect(getStandoutThreshold(10)).toBe(1.29)
  })
})

describe('deriveStandoutArchetype', () => {
  it('returns Blank Slate for fewer than 2 confident domains', () => {
    expect(deriveStandoutArchetype([]).kind).toBe('blankSlate')
    expect(deriveStandoutArchetype([domainScore('Healthcare', 3, 5)]).kind).toBe('blankSlate')
    expect(deriveStandoutArchetype([domainScore('Healthcare', 3, 5)]).headline).toBe(
      BLANK_SLATE.headline
    )
  })

  it('returns Even Keel when max deviation is below the threshold for 2 domains', () => {
    // avg = (3 + 3.5) / 2 = 3.25; deviations = -0.25, +0.25 — well under 0.6
    const result = deriveStandoutArchetype([
      domainScore('Healthcare', 3, 3),
      domainScore('Finances', 3.5, 3),
    ])
    expect(result.kind).toBe('evenKeel')
    expect(result.headline).toBe(EVEN_KEEL.headline)
  })

  it('returns a domain archetype when max deviation is at/above the threshold for 2 domains', () => {
    // avg = (2 + 3.3) / 2 = 2.65; deviations = -0.65, +0.65 — above the 0.6 threshold.
    // With exactly 2 domains the deviations are always equal in magnitude, so the
    // tie-break (higher rating count) is what actually picks the standout here.
    const result = deriveStandoutArchetype([
      domainScore('Healthcare', 2, 3),
      domainScore('Finances', 3.3, 5),
    ])
    expect(result.kind).toBe('domain')
    expect(result.standoutDomainName).toBe('Finances')
    expect(result.direction).toBe('warm')
    expect(result.headline).toBe(DOMAIN_ARCHETYPES.Finances.warm.headline)
  })

  it('breaks ties between equal |deviation| by higher rating count', () => {
    // avg = (1 + 3 + 2) / 3 = 2; deviations: Healthcare -1, Finances +1, Mobility 0
    const result = deriveStandoutArchetype([
      domainScore('Healthcare', 1, 4),
      domainScore('Finances', 3, 9),
      domainScore('Mobility', 2, 3),
    ])
    expect(result.standoutDomainName).toBe('Finances')
    expect(result.direction).toBe('warm')
  })

  it('picks the cool archetype when deviation is negative', () => {
    const result = deriveStandoutArchetype([
      domainScore('Robotics', 1, 5),
      domainScore('Education', 4, 5),
    ])
    expect(result.direction).toBe('cool')
    expect(result.standoutDomainName).toBe('Robotics')
    expect(result.headline).toBe(DOMAIN_ARCHETYPES.Robotics.cool.headline)
  })

  it('falls back to Even Keel copy if the standout domain has no entry in DOMAIN_ARCHETYPES', () => {
    const result = deriveStandoutArchetype([
      domainScore('Unknown Domain', 1, 3),
      domainScore('Finances', 4, 3),
    ])
    expect(result.kind).toBe('domain')
    expect(result.standoutDomainName).toBe('Unknown Domain')
    expect(result.headline).toBe(EVEN_KEEL.headline)
  })

  it('reproduces the worked example from docs/archetype-logic.md', () => {
    // Healthcare [4,4,3] avg 3.67, Mobility [2,1] avg 1.5, Education [3,4,3,3] avg 3.25
    // baseline = (3.67 + 1.5 + 3.25) / 3 = 2.81 -> standout = Mobility, cool
    const result = deriveStandoutArchetype([
      domainScore('Healthcare', (4 + 4 + 3) / 3, 3),
      domainScore('Mobility', (2 + 1) / 2, 2),
      domainScore('Education', (3 + 4 + 3 + 3) / 4, 4),
    ])
    expect(result.kind).toBe('domain')
    expect(result.standoutDomainName).toBe('Mobility')
    expect(result.direction).toBe('cool')
    expect(result.headline).toBe('The Backseat Driver')
  })
})

// --- computeArchetype fixtures -------------------------------------------

const DOMAIN_NAMES = ['Healthcare', 'Finances', 'Mobility', 'Education']

const domains: NotionDomain[] = DOMAIN_NAMES.map((name) => ({
  notionId: name,
  name,
  description: '',
  imageUrl: null,
}))

function makeUseCases(perDomain: number): NotionUseCase[] {
  return DOMAIN_NAMES.flatMap((domainId) =>
    Array.from({ length: perDomain }, (_, i) => ({
      notionId: `${domainId}::${i}`,
      domainId,
      subdomain: 'test',
      useCase: `${domainId} use case ${i}`,
      alias: '',
      description: '',
      order: i,
      status: 'active',
      published: true,
    }))
  )
}

function ratingsFor(values: Partial<Record<string, LikertValue[]>>): RatingsMap {
  const ratings: RatingsMap = {}
  for (const [domainId, vals] of Object.entries(values)) {
    vals?.forEach((value, i) => {
      ratings[`${domainId}::${i}`] = { value }
    })
  }
  return ratings
}

describe('computeArchetype', () => {
  const useCases = makeUseCases(10)

  it('excludes domains below MIN_RATINGS_PER_DOMAIN entirely, not just down-weights them', () => {
    expect(MIN_RATINGS_PER_DOMAIN).toBe(2)
    const ratings = ratingsFor({ Healthcare: [4], Finances: [2, 2], Mobility: [3, 3] })
    const result = computeArchetype(ratings, useCases, domains)
    const domainNames = result.domainScores.map((d) => d.domainName)
    expect(domainNames).not.toContain('Healthcare')
    expect(domainNames).toEqual(expect.arrayContaining(['Finances', 'Mobility']))
  })

  it('equal-domain-weights the overall average regardless of rating count per domain', () => {
    // Finances rated 5x at 4, Mobility rated 2x at 2 -> equal-weighted avg = (4+2)/2 = 3,
    // NOT the raw per-rating average (4*5 + 2*2)/7 = 3.43
    const ratings = ratingsFor({
      Finances: [4, 4, 4, 4, 4],
      Mobility: [2, 2],
    })
    const result = computeArchetype(ratings, useCases, domains)
    expect(result.overallAverage).toBeCloseTo(3, 5)
  })

  it('falls back to the raw per-rating average when no domain has reached confidence', () => {
    const ratings = ratingsFor({ Healthcare: [4], Finances: [2] })
    const result = computeArchetype(ratings, useCases, domains)
    expect(result.domainScores).toHaveLength(0)
    expect(result.overallAverage).toBeCloseTo(3, 5) // (4 + 2) / 2
    expect(result.ratingCount).toBe(2)
  })

  it('returns overallAverage 0 and does not throw with zero ratings', () => {
    const result = computeArchetype({}, useCases, domains)
    expect(result.overallAverage).toBe(0)
    expect(result.ratingCount).toBe(0)
    expect(result.kind).toBe('blankSlate')
  })

  it('falls back to "Other" for a rating whose use case has no domainId', () => {
    const orphanUseCase: NotionUseCase = {
      notionId: 'orphan::0',
      domainId: null,
      subdomain: 'test',
      useCase: 'orphan use case',
      alias: '',
      description: '',
      order: 0,
      status: 'active',
      published: true,
    }
    const ratings: RatingsMap = {
      'orphan::0': { value: 3 },
      'orphan::1': { value: 4 },
    }
    const result = computeArchetype(
      ratings,
      [orphanUseCase, { ...orphanUseCase, notionId: 'orphan::1' }],
      domains
    )
    expect(result.domainScores).toHaveLength(1)
    expect(result.domainScores[0].domainName).toBe('Other')
  })
})
