'use client'

import type { ArchetypeResult } from '@/lib/prototype/archetypes'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { DomainAverageSlider } from './DomainAverageSlider'
import { ArchetypeCard } from './ArchetypeCard'
import { DOMAIN_COLORS, DEFAULT_DOMAIN_TEXT_CLASSES } from '@/lib/prototype/domain-colors'

export function SessionResultView({
  result,
  onStartOwn,
  onBack,
}: {
  result: ArchetypeResult
  onStartOwn: () => void
  onBack: () => void
}) {
  return (
    <Card className="text-center">
      <CardHeader className="items-center">
        <ArchetypeCard
          headline={result.headline}
          summary={result.summary}
          domainName={result.standoutDomainName}
          layout="horizontal"
          className="w-full"
        />
      </CardHeader>

      <CardContent className="space-y-6 pb-6">
        <p className="text-xs font-base text-muted-foreground">
          Based on {result.ratingCount} answers
        </p>

        <div className="mb-12 !mt-2 space-y-10 text-left">
          {result.domainScores.map((d) => (
            <div key={d.domainId}>
              <div
                className={`mb-2 text-base font-base ${DOMAIN_COLORS[d.domainName]?.domainText ?? DEFAULT_DOMAIN_TEXT_CLASSES}`}
              >
                {d.domainName}
              </div>
              <DomainAverageSlider average={d.average} />
            </div>
          ))}
        </div>

        <div className="flex flex-wrap justify-center gap-3 pt-4">
          <Button type="button" onClick={onStartOwn}>
            Start your own profile
          </Button>
        </div>

        <button
          type="button"
          onClick={onBack}
          className="pt-4 text-xs font-base text-muted-foreground underline"
        >
          Back to home
        </button>
      </CardContent>
    </Card>
  )
}
