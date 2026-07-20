/**
 * Seeded fake "everyone else" dataset for the prototype's aggregate comparison view.
 * Not real data — there aren't 25+ real respondents yet. Replace with a real
 * aggregate query once ratings actually persist somewhere.
 */

export const MOCK_RESPONDENT_COUNT = 128
export const MOCK_RESPONSE_THRESHOLD = 25

// Rescaled from the original 1–4 mock values to 1–5 (see the Likert scale
// migration in docs/sprint-archetype-logic.md), preserving relative position.
const MOCK_DOMAIN_AVERAGES: Record<string, number> = {
  Healthcare: 2.7,
  Finances: 2.5,
  'Home & Personal Life': 3.4,
  'Leisure & Hospitality': 3.8,
  Robotics: 2.9,
  Productivity: 4.1,
  Mobility: 3.1,
  Education: 3.3,
  'Legal & Public Services': 2.6,
  'Media & Culture': 3.0,
}

const DEFAULT_MOCK_AVERAGE = 3.1

export function mockAggregateForDomain(domainName: string): number {
  return MOCK_DOMAIN_AVERAGES[domainName] ?? DEFAULT_MOCK_AVERAGE
}

export const MOCK_OVERALL_AVERAGE = 3.07
