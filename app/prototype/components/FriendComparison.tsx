'use client'

import { useState } from 'react'
import type { ArchetypeResult } from '@/lib/prototype/archetypes'
import { mockFriendForDomain, MOCK_FRIEND_OVERALL_AVERAGE } from '@/lib/prototype/mockFriend'
import { Card, CardContent, CardHeader, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { CompareTabs, type CompareTab } from './CompareTabs'

export function FriendComparison({
  result,
  prefillCode,
  activeTab,
  onTabChange,
}: {
  result: ArchetypeResult
  prefillCode?: string
  activeTab: CompareTab
  onTabChange: (tab: CompareTab) => void
}) {
  const [code, setCode] = useState(prefillCode ?? '')
  const [submittedCode, setSubmittedCode] = useState(prefillCode ?? '')

  if (!submittedCode) {
    return (
      <Card>
        <CardHeader>
          <CompareTabs active={activeTab} onChange={onTabChange} />
          <CardDescription>Compare with a friend</CardDescription>
          <p className="text-xs font-base text-muted-foreground">
            Enter the permalink code from a friend&apos;s shared results to see how you compare.
          </p>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="e.g. wmoqie"
          />
          <Button
            type="button"
            disabled={!code.trim()}
            onClick={() => setSubmittedCode(code.trim())}
          >
            Compare
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CompareTabs active={activeTab} onChange={onTabChange} />
        <CardDescription>
          {prefillCode && submittedCode === prefillCode
            ? "You vs. the friend who shared this with you"
            : `You vs. code “${submittedCode}”`}
        </CardDescription>
        <p className="text-xs font-base text-muted-foreground">
          Your overall average: {result.overallAverage.toFixed(1)} / 4 · Your friend:{' '}
          {MOCK_FRIEND_OVERALL_AVERAGE.toFixed(1)} / 4
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        {result.domainScores.map((d) => {
          const friend = mockFriendForDomain(d.domainName)
          return (
            <div key={d.domainId}>
              <div className="mb-1 text-xs font-base text-foreground">{d.domainName}</div>
              <div className="flex items-center gap-2">
                <div className="h-3 flex-1 rounded-base border-2 border-border bg-secondary-background">
                  <div
                    className="h-full rounded-[3px] bg-main"
                    style={{ width: `${(d.average / 4) * 100}%` }}
                  />
                </div>
                <span className="w-8 text-right text-xs font-base text-foreground">
                  {d.average.toFixed(1)}
                </span>
              </div>
              <div className="mt-1 flex items-center gap-2">
                <div className="h-3 flex-1 rounded-base border-2 border-border bg-secondary-background">
                  <div
                    className="h-full rounded-[3px] bg-chart-3"
                    style={{ width: `${(friend / 4) * 100}%` }}
                  />
                </div>
                <span className="w-8 text-right text-xs font-base text-muted-foreground">
                  {friend.toFixed(1)}
                </span>
              </div>
            </div>
          )
        })}

        <div className="flex items-center justify-between gap-4 border-t-2 border-border pt-3">
          <div className="flex gap-4 text-xs font-base text-muted-foreground">
            <span className="flex items-center gap-1">
              <span className="inline-block h-3 w-3 rounded-base border-2 border-border bg-main" /> You
            </span>
            <span className="flex items-center gap-1">
              <span className="inline-block h-3 w-3 rounded-base border-2 border-border bg-chart-3" />{' '}
              Your friend
            </span>
          </div>
          <button
            type="button"
            onClick={() => {
              setSubmittedCode('')
              setCode('')
            }}
            className="text-xs font-base text-muted-foreground underline"
          >
            Enter a different code
          </button>
        </div>
      </CardContent>
    </Card>
  )
}
