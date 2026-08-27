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

// Rescaled from the 1–5 mock values back down to 1–4 (see the Likert scale
// migration in docs/archetype-logic.md), preserving relative position.
const MOCK_FRIEND_DOMAIN_AVERAGES: Record<string, number> = {
  Healthcare: 3.4,
  Finances: 2.0,
  'Home & Personal Life': 3.6,
  'Leisure & Hospitality': 3.8,
  Robotics: 2.9,
  Productivity: 3.5,
  Mobility: 2.2,
  Education: 3.0,
  'Legal & Public Services': 1.8,
  'Media & Culture': 3.3,
}

const DEFAULT_MOCK_FRIEND_AVERAGE = 2.9

export function mockFriendForDomain(domainName: string): number {
  return MOCK_FRIEND_DOMAIN_AVERAGES[domainName] ?? DEFAULT_MOCK_FRIEND_AVERAGE
}

export const MOCK_FRIEND_OVERALL_AVERAGE = 3.1

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
