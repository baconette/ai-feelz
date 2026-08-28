'use client'

import { useLayoutEffect, useRef, useState } from 'react'
import { Slider } from '@/components/ui/slider'
import { LIKERT_LABELS, type LikertValue } from '@/lib/prototype/types'

const VALUES: LikertValue[] = [1, 2, 3, 4]
const MIN: LikertValue = 1
const MAX: LikertValue = 4

// SSR renders once on the server, where layout effects are a no-op; fall back
// to a regular effect there to avoid React's "useLayoutEffect does nothing on
// the server" warning.
const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : () => {}

export function LikertSlider({
  value,
  onChange,
  className = '',
}: {
  value: LikertValue
  onChange: (value: LikertValue) => void
  className?: string
}) {
  const sliderWrapRef = useRef<HTMLDivElement>(null)
  const ticksRowRef = useRef<HTMLDivElement>(null)
  const [tickLefts, setTickLefts] = useState<number[] | null>(null)
  const [trackTickLefts, setTrackTickLefts] = useState<number[] | null>(null)

  useIsomorphicLayoutEffect(() => {
    const wrap = sliderWrapRef.current
    const row = ticksRowRef.current
    if (!wrap || !row) return

    let frame: number

    function measure() {
      // Defer to the next frame: a resize can trigger this observer before
      // Radix has finished repositioning the thumb for the new width, so
      // reading rects synchronously here can catch a stale thumb position.
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const track = wrap!.querySelector('[data-slot="slider-track"]')
        const thumb = wrap!.querySelector('[role="slider"]')
        if (!track || !thumb) return

        const trackRect = track.getBoundingClientRect()
        const thumbRect = thumb.getBoundingClientRect()
        const rowRect = row!.getBoundingClientRect()
        const wrapRect = wrap!.getBoundingClientRect()

        // Radix insets the thumb from the track's edges so it never overflows
        // (by how much depends on its own internal layout, not something we
        // control), so derive that inset from the thumb's actual current
        // position rather than assuming a fixed value:
        //   thumbCenter = trackLeft + inset + frac * (trackWidth - 2 * inset)
        const frac = (value - MIN) / (MAX - MIN)
        const thumbCenter = thumbRect.left + thumbRect.width / 2
        const inset =
          frac === 0.5
            ? thumbRect.width / 2
            : (thumbCenter - trackRect.left - frac * trackRect.width) / (1 - 2 * frac)

        const centers = VALUES.map((v) => {
          const f = (v - MIN) / (MAX - MIN)
          return trackRect.left + inset + f * (trackRect.width - 2 * inset)
        })

        setTickLefts(centers.map((centerX) => centerX - rowRect.left))
        setTrackTickLefts(centers.map((centerX) => centerX - wrapRect.left))
      })
    }

    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(wrap)
    window.addEventListener('resize', measure)
    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [value])

  return (
    <div className={`flex flex-col items-center gap-4 ${className}`}>
      <div className="mb-6 flex w-full items-center justify-between">
        <span className="text-4xl" aria-hidden>
          🧠
        </span>
        <span className="text-4xl" aria-hidden>
          🤖
        </span>
      </div>

      <div ref={sliderWrapRef} className="relative w-full">
        <Slider
          aria-label="Rating"
          value={[value]}
          onValueChange={([next]) => onChange(next as LikertValue)}
          min={MIN}
          max={MAX}
          step={1}
          className="w-full px-2"
          trackClassName="data-[orientation=horizontal]:h-[3px] bg-muted-foreground"
          rangeClassName="hidden"
          thumbClassName="relative z-10 h-8 w-8 bg-transparent text-2xl"
          thumbContent={<span aria-hidden>😃</span>}
        />
        {trackTickLefts &&
          VALUES.map((v, i) => (
            <span
              key={v}
              aria-hidden
              className="absolute top-1/2 z-0 h-3 w-px -translate-x-1/2 -translate-y-1/2 cursor-pointer bg-muted-foreground"
              style={{ left: `${trackTickLefts[i]}px` }}
            />
          ))}
      </div>

      <div ref={ticksRowRef} className="relative h-6 w-full text-base font-base text-muted-foreground">
        {VALUES.map((v, i) => (
          <button
            key={v}
            type="button"
            onClick={() => onChange(v)}
            className={`absolute top-0 -translate-x-1/2 cursor-pointer whitespace-nowrap bg-transparent p-0 ${
              v === value ? 'font-bold text-foreground' : ''
            }`}
            style={tickLefts ? { left: `${tickLefts[i]}px` } : { visibility: 'hidden' }}
          >
            {LIKERT_LABELS[v]}
          </button>
        ))}
      </div>
    </div>
  )
}
