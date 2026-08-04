function Thumb({
  value,
  max,
  emoji,
  sizeClass,
  whiteBackground,
}: {
  value: number
  max: number
  emoji: string
  sizeClass: string
  whiteBackground?: boolean
}) {
  const percent = Math.min(100, Math.max(0, (value / max) * 100))
  return (
    <div
      className={`absolute top-1/2 -translate-x-1/2 -translate-y-1/2 leading-none ${sizeClass} ${
        whiteBackground ? 'rounded-full bg-white' : ''
      }`}
      style={{ left: `${percent}%` }}
      aria-hidden
    >
      {emoji}
    </div>
  )
}

export function DomainAverageSlider({
  average,
  friendAverage,
  othersAverage,
  max = 5,
}: {
  average: number
  friendAverage?: number
  othersAverage?: number
  max?: number
}) {
  return (
    <div className="relative h-[3px] w-full rounded-base bg-muted-foreground">
      {othersAverage !== undefined && (
        <Thumb value={othersAverage} max={max} emoji="🫥" sizeClass="text-[1.75rem]" whiteBackground />
      )}
      {friendAverage !== undefined && (
        <Thumb value={friendAverage} max={max} emoji="✌️" sizeClass="text-[1.75rem]" />
      )}
      <Thumb value={average} max={max} emoji="😃" sizeClass="text-[1.25rem]" />
    </div>
  )
}
