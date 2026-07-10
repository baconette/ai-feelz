/** 1 = Never, 2 = Rarely, 3 = Often, 4 = All the time. "Never" is the negative pole. */
export type LikertValue = 1 | 2 | 3 | 4

export const LIKERT_LABELS: Record<LikertValue, string> = {
  1: 'Never',
  2: 'Rarely',
  3: 'Often',
  4: 'Always',
}

export const NEGATIVE_POLE: LikertValue = 1

export interface Rating {
  value: LikertValue
  why?: string
}

export type RatingsMap = Record<string, Rating>
