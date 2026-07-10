/**
 * Seeded fake "everyone else" dataset for the prototype's aggregate comparison view.
 * Not real data — there aren't 10+ real respondents yet. Replace with a real
 * aggregate query once ratings actually persist somewhere.
 */

export const MOCK_RESPONDENT_COUNT = 128
export const MOCK_RESPONSE_THRESHOLD = 10

const MOCK_DOMAIN_AVERAGES: Record<string, number> = {
  Healthcare: 2.3,
  Finances: 2.1,
  'Home & Personal Life': 2.8,
  'Leisure & Hospitality': 3.1,
  Robotics: 2.4,
  Productivity: 3.3,
  Mobility: 2.6,
  Education: 2.7,
  'Legal & Public Services': 2.2,
  'Media & Culture': 2.5,
}

const DEFAULT_MOCK_AVERAGE = 2.6

export function mockAggregateForDomain(domainName: string): number {
  return MOCK_DOMAIN_AVERAGES[domainName] ?? DEFAULT_MOCK_AVERAGE
}

export const MOCK_OVERALL_AVERAGE = 2.55
