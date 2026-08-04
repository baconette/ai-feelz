export function DomainAverageSlider({ average, max = 5 }: { average: number; max?: number }) {
  const percent = Math.min(100, Math.max(0, (average / max) * 100))

  return (
    <div className="relative h-[3px] w-full rounded-base bg-muted-foreground">
      <div
        className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 text-lg leading-none"
        style={{ left: `${percent}%` }}
        aria-hidden
      >
        😃
      </div>
    </div>
  )
}
