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
