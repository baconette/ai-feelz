'use client'

import { useState } from 'react'
import type { NotionUseCase } from '@/lib/notion/client'
import { NEGATIVE_POLE, type LikertValue, type Rating } from '@/lib/prototype/types'
import { LikertControl } from './LikertControl'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Progress } from '@/components/ui/progress'

export function UseCaseCard({
  useCase,
  index,
  total,
  onSubmit,
  onRequestExplanation,
}: {
  useCase: NotionUseCase
  index: number
  total: number
  onSubmit: (rating: Rating) => void
  onRequestExplanation: () => void
}) {
  const [value, setValue] = useState<LikertValue | null>(null)
  const [why, setWhy] = useState('')

  const isNegative = value === NEGATIVE_POLE

  function submit(withWhy: boolean) {
    if (!value) return
    onSubmit({ value, why: withWhy && why.trim() ? why.trim() : undefined })
    setValue(null)
    setWhy('')
  }

  return (
    <Card>
      <CardHeader>
        <Progress value={(index / total) * 100} className="mb-1 h-2" />
        <div className="text-xs font-base text-muted-foreground">
          {index} of {total}
        </div>
        <p className="text-base font-heading text-foreground sm:text-lg">{useCase.useCase}</p>
      </CardHeader>

      <CardContent className="space-y-4">
        {useCase.description && (
          <p className="text-sm font-base text-foreground">{useCase.description}</p>
        )}

        <LikertControl value={value} onChange={setValue} />

        {isNegative && (
          <div className="border-t-2 border-border pt-3">
            <label className="mb-1 block text-xs font-base text-muted-foreground">
              Want to say why? (optional)
            </label>
            <Textarea
              value={why}
              onChange={(e) => setWhy(e.target.value)}
              rows={2}
              placeholder="Type your thoughts..."
            />
          </div>
        )}
      </CardContent>

      <CardFooter className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onRequestExplanation}
          className="text-xs font-base text-muted-foreground underline decoration-dotted hover:text-foreground"
        >
          Something unclear? Request an explanation
        </button>

        <div className="flex items-center gap-2">
          <Button type="button" size="sm" disabled={!value} onClick={() => submit(true)}>
            Next
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
