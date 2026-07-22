'use client'

import { useEffect, useRef, useState } from 'react'
import type { NotionUseCase } from '@/lib/notion/client'
import type { LikertValue, Rating } from '@/lib/prototype/types'
import { LikertControl } from './LikertControl'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const AUTO_ADVANCE_DELAY = 500

export function UseCaseCard({
  useCase,
  index,
  total,
  initialRating,
  canGoBack,
  onSubmit,
  onBack,
  onRequestExplanation,
}: {
  useCase: NotionUseCase
  index: number
  total: number
  initialRating?: Rating
  canGoBack: boolean
  onSubmit: (rating: Rating) => void
  onBack: () => void
  onRequestExplanation: () => void
}) {
  const [value, setValue] = useState<LikertValue | null>(initialRating?.value ?? null)
  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    setValue(initialRating?.value ?? null)
    return () => {
      if (advanceTimer.current) clearTimeout(advanceTimer.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [useCase.notionId])

  function selectValue(v: LikertValue) {
    setValue(v)
    if (advanceTimer.current) clearTimeout(advanceTimer.current)
    advanceTimer.current = setTimeout(() => {
      onSubmit({ value: v })
      setValue(null)
    }, AUTO_ADVANCE_DELAY)
  }

  return (
    <Card>
      <CardHeader>
        <div className="text-xs font-base text-muted-foreground">
          {index} of {total}
        </div>
        <p className="text-base font-heading text-foreground sm:text-lg">{useCase.useCase}</p>
        <button
          type="button"
          onClick={onRequestExplanation}
          className="text-xs font-base text-muted-foreground underline decoration-dotted hover:text-foreground"
        >
          I don&apos;t understand this use case
        </button>
      </CardHeader>

      <CardContent className="space-y-4">
        <LikertControl value={value} onChange={selectValue} />
      </CardContent>

      {canGoBack && (
        <CardFooter className="flex items-center justify-start">
          <Button type="button" size="sm" variant="neutral" onClick={onBack}>
            Back
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}
