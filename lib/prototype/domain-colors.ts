/**
 * Categorical color mapping, one hue per domain, used anywhere a domain needs to be
 * visually distinguished (landing marquee, use-case card badges, use-case sentence
 * underline). Values reference the color/chart ramp tokens defined in globals.css.
 */
export const DOMAIN_COLORS: Record<
  string,
  { marqueeUnderline: string; badge: string; sentenceUnderline: string }
> = {
  Healthcare: {
    marqueeUnderline: 'decoration-[color:var(--color-chart-red-500)]',
    badge: 'bg-[color:var(--color-chart-red-200)] text-[color:var(--color-chart-red-700)]',
    sentenceUnderline: 'decoration-[color:var(--color-chart-red-200)]',
  },
  Productivity: {
    marqueeUnderline: 'decoration-[color:var(--color-chart-orange-500)]',
    badge: 'bg-[color:var(--color-chart-orange-200)] text-[color:var(--color-chart-orange-700)]',
    sentenceUnderline: 'decoration-[color:var(--color-chart-orange-200)]',
  },
  Mobility: {
    marqueeUnderline: 'decoration-[color:var(--color-chart-amber-500)]',
    badge: 'bg-[color:var(--color-chart-amber-200)] text-[color:var(--color-chart-amber-700)]',
    sentenceUnderline: 'decoration-[color:var(--color-chart-amber-200)]',
  },
  Robotics: {
    marqueeUnderline: 'decoration-[color:var(--color-chart-lime-500)]',
    badge: 'bg-[color:var(--color-chart-lime-200)] text-[color:var(--color-chart-lime-700)]',
    sentenceUnderline: 'decoration-[color:var(--color-chart-lime-200)]',
  },
  Finances: {
    marqueeUnderline: 'decoration-[color:var(--color-chart-emerald-500)]',
    badge: 'bg-[color:var(--color-chart-emerald-200)] text-[color:var(--color-chart-emerald-700)]',
    sentenceUnderline: 'decoration-[color:var(--color-chart-emerald-200)]',
  },
  Education: {
    marqueeUnderline: 'decoration-[color:var(--color-chart-cyan-500)]',
    badge: 'bg-[color:var(--color-chart-cyan-200)] text-[color:var(--color-chart-cyan-700)]',
    sentenceUnderline: 'decoration-[color:var(--color-chart-cyan-200)]',
  },
  'Legal & Public Services': {
    marqueeUnderline: 'decoration-[color:var(--color-chart-blue-500)]',
    badge: 'bg-[color:var(--color-chart-blue-200)] text-[color:var(--color-chart-blue-700)]',
    sentenceUnderline: 'decoration-[color:var(--color-chart-blue-200)]',
  },
  'Home & Personal Life': {
    marqueeUnderline: 'decoration-[color:var(--color-chart-violet-500)]',
    badge: 'bg-[color:var(--color-chart-violet-200)] text-[color:var(--color-chart-violet-700)]',
    sentenceUnderline: 'decoration-[color:var(--color-chart-violet-200)]',
  },
  'Leisure & Hospitality': {
    marqueeUnderline: 'decoration-[color:var(--color-chart-magenta-500)]',
    badge: 'bg-[color:var(--color-chart-magenta-200)] text-[color:var(--color-chart-magenta-700)]',
    sentenceUnderline: 'decoration-[color:var(--color-chart-magenta-200)]',
  },
  'Media & Culture': {
    marqueeUnderline: 'decoration-[color:var(--color-chart-pink-500)]',
    badge: 'bg-[color:var(--color-chart-pink-200)] text-[color:var(--color-chart-pink-700)]',
    sentenceUnderline: 'decoration-[color:var(--color-chart-pink-200)]',
  },
}

export const DEFAULT_DOMAIN_MARQUEE_CLASSES = 'decoration-foreground'
export const DEFAULT_DOMAIN_BADGE_CLASSES = ''
export const DEFAULT_DOMAIN_SENTENCE_UNDERLINE_CLASSES = 'decoration-foreground'
