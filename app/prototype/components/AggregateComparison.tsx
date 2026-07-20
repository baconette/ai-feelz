'use client'

import type { ArchetypeResult } from '@/lib/prototype/archetypes'
import {
  MOCK_OVERALL_AVERAGE,
  MOCK_RESPONDENT_COUNT,
  MOCK_RESPONSE_THRESHOLD,
  mockAggregateForDomain,
} from '@/lib/prototype/mockAggregate'
import { Card, CardContent, CardHeader, CardDescription } from '@/components/ui/card'
import { CompareTabs, type CompareTab } from './CompareTabs'

export function AggregateComparison({
  result,
  showPlaceholder,
  activeTab,
  onTabChange,
}: {
  result: ArchetypeResult
  showPlaceholder: boolean
  activeTab: CompareTab
  onTabChange: (tab: CompareTab) => void
}) {
  if (showPlaceholder) {
    return (
      <Card className="text-center">
        <CardHeader>
          <CompareTabs active={activeTab} onChange={onTabChange} />
        </CardHeader>
        <CardContent>
          <p className="text-sm font-base text-muted-foreground">
            Not enough people have rated yet — aggregate comparisons unlock once at least{' '}
            {MOCK_RESPONSE_THRESHOLD} people complete a bundle.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CompareTabs active={activeTab} onChange={onTabChange} />
        <CardDescription>You vs. {MOCK_RESPONDENT_COUNT} other visitors</CardDescription>
        <p className="text-xs font-base text-muted-foreground">
          Your overall average: {result.overallAverage.toFixed(1)} / 5 · Everyone else:{' '}
          {MOCK_OVERALL_AVERAGE.toFixed(1)} / 5
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        {result.domainScores.map((d) => {
          const aggregate = mockAggregateForDomain(d.domainName)
          return (
            <div key={d.domainId}>
              <div className="mb-1 text-xs font-base text-foreground">{d.domainName}</div>
              <div className="flex items-center gap-2">
                <div className="h-3 flex-1 rounded-base border-2 border-border bg-secondary-background">
                  <div
                    className="h-full rounded-[3px] bg-main"
                    style={{ width: `${(d.average / 5) * 100}%` }}
                  />
                </div>
                <span className="w-8 text-right text-xs font-base text-foreground">
                  {d.average.toFixed(1)}
                </span>
              </div>
              <div className="mt-1 flex items-center gap-2">
                <div className="h-3 flex-1 rounded-base border-2 border-border bg-secondary-background">
                  <div
                    className="h-full rounded-[3px] bg-chart-2"
                    style={{ width: `${(aggregate / 5) * 100}%` }}
                  />
                </div>
                <span className="w-8 text-right text-xs font-base text-muted-foreground">
                  {aggregate.toFixed(1)}
                </span>
              </div>
            </div>
          )
        })}

        <div className="flex gap-4 border-t-2 border-border pt-3 text-xs font-base text-muted-foreground">
          <span className="flex items-center gap-1">
            <span className="inline-block h-3 w-3 rounded-base border-2 border-border bg-main" /> You
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block h-3 w-3 rounded-base border-2 border-border bg-chart-2" />{' '}
            Everyone else
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
