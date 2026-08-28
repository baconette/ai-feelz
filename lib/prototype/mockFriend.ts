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

// Robotics is set well above the rest so it clears the 10-domain standout
// threshold (see STANDOUT_THRESHOLD_BY_DOMAIN_COUNT in archetypes.ts) and
// resolves to The Machine Whisperer — every other domain stays close enough
// to the mean that none of them competes as an alternate standout.
const MOCK_FRIEND_DOMAIN_AVERAGES: Record<string, number> = {
  Healthcare: 2.3,
  Finances: 2.6,
  'Home & Personal Life': 2.5,
  'Leisure & Hospitality': 2.8,
  Robotics: 4.0,
  Productivity: 2.4,
  Mobility: 2.2,
  Education: 2.7,
  'Legal & Public Services': 2.1,
  'Media & Culture': 2.5,
}

const DEFAULT_MOCK_FRIEND_AVERAGE = 2.6

export function mockFriendForDomain(domainName: string): number {
  return MOCK_FRIEND_DOMAIN_AVERAGES[domainName] ?? DEFAULT_MOCK_FRIEND_AVERAGE
}

export const MOCK_FRIEND_OVERALL_AVERAGE = 2.61

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
