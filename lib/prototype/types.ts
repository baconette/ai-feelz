/** 1 = Never, 2 = Some, 3 = Neutral, 4 = Most, 5 = Always. "Never" is the negative pole, "Always" the positive pole. */
export type LikertValue = 1 | 2 | 3 | 4 | 5

export const LIKERT_LABELS: Record<LikertValue, string> = {
  1: 'Never',
  2: 'Sometimes',
  3: 'Neutral',
  4: 'Most times',
  5: 'Always',
}

export const LIKERT_EMOJIS: Record<LikertValue, string> = {
  1: '🧠',
  2: '🤳',
  3: '😶',
  4: '🦾',
  5: '🤖',
}

export const NEGATIVE_POLE: LikertValue = 1
export const POSITIVE_POLE: LikertValue = 5

export interface Rating {
  value: LikertValue
  why?: string
}

export type RatingsMap = Record<string, Rating>
