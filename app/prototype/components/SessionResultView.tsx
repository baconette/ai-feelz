'use client'

import type { ArchetypeResult } from '@/lib/prototype/archetypes'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { DomainAverageSlider } from './DomainAverageSlider'
import { ArchetypeCard } from './ArchetypeCard'
import { DOMAIN_COLORS, DEFAULT_DOMAIN_TEXT_CLASSES } from '@/lib/prototype/domain-colors'
import { mockAggregateForDomain } from '@/lib/prototype/mockAggregate'

export type SessionViewState =
  | { status: 'loading' }
  | { status: 'found'; result: ArchetypeResult }
  | { status: 'error' }

export function SessionResultView({
  state,
  onStartOwn,
  hasAggregateThreshold = true,
}: {
  state: SessionViewState
  onStartOwn: () => void
  hasAggregateThreshold?: boolean
}) {
  return (
    <div className="space-y-8">
      <div className="space-y-3 text-left">
        <h2 className="text-5xl font-heading uppercase leading-[0.95] tracking-tight text-background">
          Do you want AI
          <br />
          in your life?
        </h2>
        <p className="text-sm font-base text-main-foreground sm:text-base">
          Choose when you prefer a human or an AI perform an activity, find your AI profile and
          see how you compare to your friend.
        </p>
      </div>

      <Button type="button" variant="neutral" onClick={onStartOwn} className="w-full">
        Start your own profile
      </Button>

      <Card className="text-center">
        <CardHeader className="items-center">
          {state.status === 'found' && (
            <ArchetypeCard
              headline={state.result.headline}
              summary={state.result.summary}
              domainName={state.result.standoutDomainName}
              label="THEM"
              layout="horizontal"
              className="w-full"
            />
          )}
          {state.status === 'loading' && (
            <div className="flex w-full animate-pulse items-center gap-4 rounded-base border-2 border-border p-5 shadow-shadow">
              <div className="h-[88px] w-[88px] shrink-0 rounded-full bg-muted-foreground" />
              <div className="flex w-full flex-col gap-3">
                <div className="h-4 w-2/3 rounded-base bg-muted-foreground" />
                <div className="h-3 w-full rounded-base bg-muted-foreground" />
                <div className="h-3 w-full rounded-base bg-muted-foreground" />
                <div className="h-3 w-4/5 rounded-base bg-muted-foreground" />
              </div>
            </div>
          )}
          {state.status === 'error' && (
            <p className="text-lg font-base text-red-500">
              This shared link couldn&apos;t be found — it may have expired.
            </p>
          )}
        </CardHeader>

        <CardContent className="space-y-6 pb-6">
          {state.status === 'loading' && (
            <div className="w-full animate-pulse space-y-8">
              <div className="h-3 w-2/5 rounded-base bg-muted-foreground" />
              <div className="h-10 w-full rounded-base bg-muted-foreground" />
              <div className="space-y-8">
                <div className="h-3 w-full rounded-base bg-muted-foreground" />
                <div className="h-3 w-full rounded-base bg-muted-foreground" />
                <div className="h-3 w-full rounded-base bg-muted-foreground" />
                <div className="h-3 w-full rounded-base bg-muted-foreground" />
              </div>
              <div className="mx-auto h-10 w-3/5 rounded-base bg-muted-foreground" />
            </div>
          )}

          {state.status === 'found' && (
            <>
              <p className="text-xs font-base text-muted-foreground">
                Based on {state.result.ratingCount} answers
              </p>

              <div className="flex items-center justify-between text-4xl">
                <span aria-hidden>🧠</span>
                <span aria-hidden>🤖</span>
              </div>

              <div className="!mt-2 space-y-10 text-left">
                {state.result.domainScores.map((d) => (
                  <div key={d.domainId}>
                    <div
                      className={`mb-2 text-base font-base ${DOMAIN_COLORS[d.domainName]?.domainText ?? DEFAULT_DOMAIN_TEXT_CLASSES}`}
                    >
                      {d.domainName}
                    </div>
                    <DomainAverageSlider
                      average={d.average}
                      averageEmoji="✌️"
                      othersAverage={hasAggregateThreshold ? mockAggregateForDomain(d.domainName) : undefined}
                    />
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-base text-muted-foreground">
                <span>✌️ Them</span>
                {hasAggregateThreshold && <span>🫥 Visitor average</span>}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
