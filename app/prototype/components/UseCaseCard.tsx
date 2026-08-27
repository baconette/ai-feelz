'use client'

import { useEffect, useState } from 'react'
import { Info } from 'lucide-react'
import type { NotionDomain, NotionUseCase } from '@/lib/notion/client'
import type { LikertValue, Rating } from '@/lib/prototype/types'
import {
  DOMAIN_COLORS,
  DEFAULT_DOMAIN_BADGE_CLASSES,
  DEFAULT_DOMAIN_SENTENCE_UNDERLINE_CLASSES,
} from '@/lib/prototype/domain-colors'
import { LikertControl } from './LikertControl'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'

const EXPLANATION_PLACEHOLDER = "There is no explanation, we'll get right to writing it."

const SENTENCE_PREFIXES = ['When should AI ', 'When should ']

function splitSentence(sentence: string): { prefix: string; rest: string } {
  const prefix = SENTENCE_PREFIXES.find((p) => sentence.startsWith(p)) ?? ''
  return { prefix, rest: sentence.slice(prefix.length) }
}

export function UseCaseCard({
  useCase,
  index,
  total,
  domains,
  initialRating,
  canGoBack,
  onSubmit,
  onBack,
}: {
  useCase: NotionUseCase
  index: number
  total: number
  domains: NotionDomain[]
  initialRating?: Rating
  canGoBack: boolean
  onSubmit: (rating: Rating) => void
  onBack: () => void
}) {
  const [value, setValue] = useState<LikertValue | null>(initialRating?.value ?? null)
  const [showExplanation, setShowExplanation] = useState(false)

  useEffect(() => {
    setValue(initialRating?.value ?? null)
    setShowExplanation(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [useCase.notionId])

  const domainName = domains.find((d) => d.notionId === useCase.domainId)?.name ?? 'Other'
  const { prefix, rest } = splitSentence(useCase.useCase)

  function handleNext() {
    if (value === null) return
    onSubmit({ value })
  }

  return (
    <Card>
      <CardHeader className="gap-3">
        <Progress
          value={(index / total) * 100}
          className="h-2 border-2 border-muted-foreground bg-secondary-background"
          indicatorClassName="border-none bg-muted-foreground"
        />
        <div className="flex items-center justify-between">
          <Badge
            variant="neutral"
            className={DOMAIN_COLORS[domainName]?.badge ?? DEFAULT_DOMAIN_BADGE_CLASSES}
          >
            {domainName}
          </Badge>
          {canGoBack && (
            <button
              type="button"
              onClick={onBack}
              className="text-xs font-base text-foreground underline hover:text-muted-foreground"
            >
              ← Back
            </button>
          )}
        </div>
      </CardHeader>

      <CardContent className="py-4">
        <p className="text-base font-heading text-foreground sm:text-lg">
          {prefix}
          <span
            className={`underline decoration-4 underline-offset-4 ${DOMAIN_COLORS[domainName]?.sentenceUnderline ?? DEFAULT_DOMAIN_SENTENCE_UNDERLINE_CLASSES}`}
          >
            {rest}
          </span>
        </p>

        <div className="mt-1">
          <button
            type="button"
            onClick={() => setShowExplanation((prev) => !prev)}
            className="text-left text-xs font-base text-muted-foreground underline decoration-dotted hover:text-foreground"
          >
            Explain this question more
          </button>
          {showExplanation && (
            <Alert className="mt-2 bg-background text-foreground">
              <Info />
              <AlertDescription>{EXPLANATION_PLACEHOLDER}</AlertDescription>
            </Alert>
          )}
        </div>

        <LikertControl value={value} onChange={setValue} className="mt-16" />
      </CardContent>

      <CardFooter className="justify-end">
        <Button type="button" onClick={handleNext} disabled={value === null}>
          Next
        </Button>
      </CardFooter>
    </Card>
  )
}
