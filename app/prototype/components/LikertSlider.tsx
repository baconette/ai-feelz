'use client'

import { Slider } from '@/components/ui/slider'
import { LIKERT_EMOJIS, LIKERT_LABELS, type LikertValue } from '@/lib/prototype/types'

const VALUES: LikertValue[] = [1, 2, 3, 4]
const MIN: LikertValue = 1
const MAX: LikertValue = 4

export function LikertSlider({
  value,
  onChange,
  className = '',
}: {
  value: LikertValue
  onChange: (value: LikertValue) => void
  className?: string
}) {
  return (
    <div className={`flex flex-col items-center gap-4 ${className}`}>
      <div className="flex flex-col items-center gap-1">
        <span className="text-4xl" aria-hidden>
          {LIKERT_EMOJIS[value]}
        </span>
        <span className="font-heading text-foreground">{LIKERT_LABELS[value]}</span>
      </div>

      <Slider
        aria-label="Rating"
        value={[value]}
        onValueChange={([next]) => onChange(next as LikertValue)}
        min={MIN}
        max={MAX}
        step={1}
        className="w-full px-2"
        trackClassName="h-3 border-2 border-border"
        thumbClassName="h-8 w-8 border-2 border-border bg-main shadow-shadow text-xl"
        thumbContent={<span aria-hidden>😃</span>}
      />

      <div className="flex w-full justify-between px-2 text-[11px] font-base text-muted-foreground">
        {VALUES.map((v) => (
          <span key={v}>{LIKERT_LABELS[v]}</span>
        ))}
      </div>
    </div>
  )
}
