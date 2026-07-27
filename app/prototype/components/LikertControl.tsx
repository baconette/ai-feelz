'use client'

import { LIKERT_EMOJIS, LIKERT_LABELS, type LikertValue } from '@/lib/prototype/types'

const VALUES: LikertValue[] = [1, 2, 3, 4, 5]

export function LikertControl({
  value,
  onChange,
}: {
  value: LikertValue | null
  onChange: (value: LikertValue) => void
}) {
  return (
    <div className="grid grid-cols-5 gap-2">
      {VALUES.map((v) => (
        <button
          key={v}
          type="button"
          onClick={() => onChange(v)}
          className={`flex flex-col items-center justify-center gap-1 rounded-base border-2 border-border px-1 py-2 text-center text-[11px] font-base leading-tight transition-all sm:text-xs ${
            value === v
              ? 'bg-main text-main-foreground shadow-shadow'
              : 'bg-secondary-background text-foreground shadow-shadow hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none'
          }`}
        >
          <span className="text-xl">{LIKERT_EMOJIS[v]}</span>
          <span>{LIKERT_LABELS[v]}</span>
        </button>
      ))}
    </div>
  )
}
