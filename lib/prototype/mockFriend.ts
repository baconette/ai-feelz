import {
  MIN_RATINGS_PER_DOMAIN,
  deriveStandoutArchetype,
  type DomainScore,
  type StandoutArchetype,
} from './archetypes'

/**
 * Seeded fake "friend" dataset for the prototype's friend-comparison tab.
 * Any permalink code is accepted here — there's no real backend behind this yet.
 * Replace with a real lookup once shared results actually persist somewhere.
 */

// Rescaled from the original 1–4 mock values to 1–5 (see the Likert scale
// migration in docs/sprint-archetype-logic.md), preserving relative position.
const MOCK_FRIEND_DOMAIN_AVERAGES: Record<string, number> = {
  Healthcare: 4.2,
  Finances: 2.3,
  'Home & Personal Life': 4.5,
  'Leisure & Hospitality': 4.7,
  Robotics: 3.5,
  Productivity: 4.3,
  Mobility: 2.6,
  Education: 3.7,
  'Legal & Public Services': 2.1,
  'Media & Culture': 4.1,
}

const DEFAULT_MOCK_FRIEND_AVERAGE = 3.5

export function mockFriendForDomain(domainName: string): number {
  return MOCK_FRIEND_DOMAIN_AVERAGES[domainName] ?? DEFAULT_MOCK_FRIEND_AVERAGE
}

export const MOCK_FRIEND_OVERALL_AVERAGE = 3.8

/**
 * Derives the mock friend's own archetype from their domain averages, using the
 * same standout-selection rules as a real visitor's result (see
 * lib/prototype/archetypes.ts) so the two stay consistent.
 */
export function mockFriendArchetype(): StandoutArchetype {
  const domainScores: DomainScore[] = Object.entries(MOCK_FRIEND_DOMAIN_AVERAGES).map(
    ([domainName, average]) => ({
      domainId: domainName,
      domainName,
      average,
      count: MIN_RATINGS_PER_DOMAIN,
    })
  )
  return deriveStandoutArchetype(domainScores)
}
