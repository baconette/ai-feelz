/**
 * Categorical color mapping, one hue per domain, used anywhere a domain needs to be
 * visually distinguished (landing marquee, use-case card badges). Values reference the
 * color/chart ramp tokens defined in globals.css.
 */
export const DOMAIN_COLORS: Record<string, { marquee: string; badge: string }> = {
  Healthcare: {
    marquee: 'text-[color:var(--color-chart-red-600)] decoration-[color:var(--color-chart-red-600)]',
    badge: 'bg-[color:var(--color-chart-red-100)] text-[color:var(--color-chart-red-700)]',
  },
  Productivity: {
    marquee: 'text-[color:var(--color-chart-orange-600)] decoration-[color:var(--color-chart-orange-600)]',
    badge: 'bg-[color:var(--color-chart-orange-100)] text-[color:var(--color-chart-orange-700)]',
  },
  Mobility: {
    marquee: 'text-[color:var(--color-chart-amber-600)] decoration-[color:var(--color-chart-amber-600)]',
    badge: 'bg-[color:var(--color-chart-amber-100)] text-[color:var(--color-chart-amber-700)]',
  },
  Robotics: {
    marquee: 'text-[color:var(--color-chart-lime-600)] decoration-[color:var(--color-chart-lime-600)]',
    badge: 'bg-[color:var(--color-chart-lime-100)] text-[color:var(--color-chart-lime-700)]',
  },
  Finances: {
    marquee: 'text-[color:var(--color-chart-emerald-600)] decoration-[color:var(--color-chart-emerald-600)]',
    badge: 'bg-[color:var(--color-chart-emerald-100)] text-[color:var(--color-chart-emerald-700)]',
  },
  Education: {
    marquee: 'text-[color:var(--color-chart-cyan-600)] decoration-[color:var(--color-chart-cyan-600)]',
    badge: 'bg-[color:var(--color-chart-cyan-100)] text-[color:var(--color-chart-cyan-700)]',
  },
  'Legal & Public Services': {
    marquee: 'text-[color:var(--color-chart-blue-600)] decoration-[color:var(--color-chart-blue-600)]',
    badge: 'bg-[color:var(--color-chart-blue-100)] text-[color:var(--color-chart-blue-700)]',
  },
  'Home & Personal Life': {
    marquee: 'text-[color:var(--color-chart-violet-600)] decoration-[color:var(--color-chart-violet-600)]',
    badge: 'bg-[color:var(--color-chart-violet-100)] text-[color:var(--color-chart-violet-700)]',
  },
  'Leisure & Hospitality': {
    marquee: 'text-[color:var(--color-chart-magenta-600)] decoration-[color:var(--color-chart-magenta-600)]',
    badge: 'bg-[color:var(--color-chart-magenta-100)] text-[color:var(--color-chart-magenta-700)]',
  },
  'Media & Culture': {
    marquee: 'text-[color:var(--color-chart-pink-600)] decoration-[color:var(--color-chart-pink-600)]',
    badge: 'bg-[color:var(--color-chart-pink-100)] text-[color:var(--color-chart-pink-700)]',
  },
}

export const DEFAULT_DOMAIN_MARQUEE_CLASSES = 'text-foreground decoration-foreground'
export const DEFAULT_DOMAIN_BADGE_CLASSES = ''
