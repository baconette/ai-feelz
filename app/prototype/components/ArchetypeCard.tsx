import { cn } from '@/lib/utils'
import { ARCHETYPE_ICONS } from '@/lib/prototype/archetypes'
import {
  DOMAIN_COLORS,
  DEFAULT_DOMAIN_BADGE_CLASSES,
  DEFAULT_DOMAIN_TEXT_CLASSES,
} from '@/lib/prototype/domain-colors'

export function ArchetypeCard({
  headline,
  summary,
  domainName,
  label,
  layout = 'stacked',
  className,
}: {
  headline: string
  summary?: string
  domainName?: string
  label?: string
  /** 'stacked' centers everything in a column (for side-by-side comparison).
   *  'horizontal' fills its container with the avatar on the left and left-aligned text on the right. */
  layout?: 'stacked' | 'horizontal'
  className?: string
}) {
  const badgeClasses = domainName ? DOMAIN_COLORS[domainName]?.badge : undefined
  const colorClasses =
    badgeClasses ?? `${DEFAULT_DOMAIN_BADGE_CLASSES} ${DEFAULT_DOMAIN_TEXT_CLASSES}`.trim()
  const icon = ARCHETYPE_ICONS[headline] ?? '❔'

  const avatar = (
    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-white text-[2rem] sm:h-[5.5rem] sm:w-[5.5rem] sm:text-[3rem]">
      <span aria-hidden>{icon}</span>
    </div>
  )

  if (layout === 'horizontal') {
    return (
      <div
        className={cn(
          'flex w-full items-center gap-2 rounded-base border-2 border-border p-3 text-left shadow-shadow sm:gap-4 sm:p-5',
          colorClasses,
          className
        )}
      >
        {avatar}
        <div className="flex min-w-0 flex-col gap-1">
          {label && <span className="text-xs font-base uppercase tracking-wide opacity-70">{label}</span>}
          <p className="font-heading text-base sm:text-lg">{headline}</p>
          {summary && <p className="text-xs font-base opacity-80">{summary}</p>}
        </div>
      </div>
    )
  }

  return (
    <div
      className={cn(
        'flex min-w-0 flex-col items-center gap-2 rounded-base border-2 border-border p-3 text-center shadow-shadow sm:p-5',
        colorClasses,
        className
      )}
    >
      {label && <span className="text-xs font-base uppercase tracking-wide opacity-70">{label}</span>}
      {avatar}
      <p className="font-heading text-base sm:text-lg">{headline}</p>
      {summary && <p className="text-xs font-base opacity-80">{summary}</p>}
    </div>
  )
}
