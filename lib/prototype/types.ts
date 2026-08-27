/** 1 = Never, 2 = Some, 3 = Most, 4 = Always. "Never" is the negative pole, "Always" the positive pole. */
export type LikertValue = 1 | 2 | 3 | 4

export const LIKERT_LABELS: Record<LikertValue, string> = {
  1: 'Never',
  2: 'Some',
  3: 'Most',
  4: 'Always',
}

export const LIKERT_EMOJIS: Record<LikertValue, string> = {
  1: '🧠',
  2: '🤳',
  3: '🦾',
  4: '🤖',
}

export const NEGATIVE_POLE: LikertValue = 1
export const POSITIVE_POLE: LikertValue = 4

export interface Rating {
  value: LikertValue
  why?: string
}

export type RatingsMap = Record<string, Rating>
