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
    <div className="flex h-[5.5rem] w-[5.5rem] shrink-0 items-center justify-center rounded-full bg-white text-[3rem]">
      <span aria-hidden>{icon}</span>
    </div>
  )

  if (layout === 'horizontal') {
    return (
      <div
        className={cn(
          'flex w-full items-center gap-4 rounded-base border-2 border-border p-5 text-left shadow-shadow',
          colorClasses,
          className
        )}
      >
        {avatar}
        <div className="flex flex-col gap-1">
          {label && <span className="text-xs font-base uppercase tracking-wide opacity-70">{label}</span>}
          <p className="font-heading text-lg">{headline}</p>
          {summary && <p className="text-xs font-base opacity-80">{summary}</p>}
        </div>
      </div>
    )
  }

  return (
    <div
      className={cn(
        'flex flex-col items-center gap-2 rounded-base border-2 border-border p-5 text-center shadow-shadow',
        colorClasses,
        className
      )}
    >
      {label && <span className="text-xs font-base uppercase tracking-wide opacity-70">{label}</span>}
      {avatar}
      <p className="font-heading text-lg">{headline}</p>
      {summary && <p className="text-xs font-base opacity-80">{summary}</p>}
    </div>
  )
}
