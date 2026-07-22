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
    <div>
      <div className="flex flex-col gap-2">
        {VALUES.map((v) => (
          <button
            key={v}
            type="button"
            onClick={() => onChange(v)}
            className={`flex items-center justify-center gap-2 rounded-base border-2 border-border px-4 py-3 text-sm font-base transition-all ${
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
    </div>
  )
}
