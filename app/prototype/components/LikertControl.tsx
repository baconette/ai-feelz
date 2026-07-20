'use client'

import { LIKERT_LABELS, type LikertValue } from '@/lib/prototype/types'

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
      <div className="mb-2 text-sm font-base text-foreground">
        How often would you want AI doing this?
      </div>
      <div className="grid grid-cols-5 gap-1 sm:gap-2">
        {VALUES.map((v) => (
          <button
            key={v}
            type="button"
            onClick={() => onChange(v)}
            className={`rounded-base border-2 border-border px-1 py-3 text-[11px] font-base transition-all sm:px-2 sm:text-sm ${
              value === v
                ? 'bg-main text-main-foreground shadow-shadow'
                : 'bg-secondary-background text-foreground shadow-shadow hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none'
            }`}
          >
            {LIKERT_LABELS[v]}
          </button>
        ))}
      </div>
    </div>
  )
}
