'use client'

import { useState } from 'react'
import type { ArchetypeResult } from '@/lib/prototype/archetypes'
import { mockFriendForDomain } from '@/lib/prototype/mockFriend'
import { mockAggregateForDomain } from '@/lib/prototype/mockAggregate'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DomainAverageSlider } from './DomainAverageSlider'

type FriendState = 'idle' | 'form' | 'active'

export function ArchetypeResults({
  result,
  onContinueRating,
  bundleSize,
  onRestart,
  prefillFriendCode,
  hasAggregateThreshold,
}: {
  result: ArchetypeResult
  onContinueRating: () => void
  bundleSize: number
  onRestart: () => void
  prefillFriendCode?: string
  hasAggregateThreshold: boolean
}) {
  const [friendState, setFriendState] = useState<FriendState>(prefillFriendCode ? 'active' : 'idle')
  const [friendCode, setFriendCode] = useState(prefillFriendCode ?? '')

  const [shared, setShared] = useState(false)
  const [permalink, setPermalink] = useState('')

  function handleToggleFriend() {
    if (friendState === 'idle') {
      setShared(false)
      setPermalink('')
      setFriendState('form')
    } else {
      setFriendState('idle')
    }
  }

  function handleShare() {
    const code = Math.random().toString(36).slice(2, 8)
    const url = `${window.location.origin}/prototype?friend=${code}`
    setPermalink(url)
    setShared(true)
    navigator.clipboard?.writeText(url).catch(() => {})
  }

  return (
    <Card className="text-center">
      <CardHeader className="items-center">
        <div className="mx-auto mb-2 h-14 w-14 rounded-full border-2 border-dashed border-border" />
        <CardTitle className="text-xl">{result.headline}</CardTitle>
        <CardDescription className="mx-auto max-w-sm">{result.summary}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-xs font-base text-muted-foreground">
            Based on {result.ratingCount} answers
          </p>
          <button
            type="button"
            onClick={onContinueRating}
            className="text-xs font-base text-foreground underline hover:text-muted-foreground"
          >
            Answer {bundleSize} more
          </button>
        </div>

        <div className="mb-12 space-y-6 text-left">
          {result.domainScores.map((d) => (
            <div key={d.domainId}>
              <div className="mb-2 text-xs font-base text-foreground">{d.domainName}</div>
              <DomainAverageSlider
                average={d.average}
                friendAverage={
                  friendState === 'active' ? mockFriendForDomain(d.domainName) : undefined
                }
                othersAverage={
                  hasAggregateThreshold ? mockAggregateForDomain(d.domainName) : undefined
                }
              />
            </div>
          ))}
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          <Button type="button" onClick={handleToggleFriend}>
            {friendState === 'idle' ? '✌️ Compare to friend' : 'Hide friend'}
          </Button>
          <Button type="button" variant="neutral" onClick={handleShare}>
            🔗 {shared ? 'Link copied' : 'Share your results'}
          </Button>
        </div>

        {friendState === 'form' && (
          <div className="space-y-2 text-left">
            <p className="text-xs font-base text-muted-foreground">
              Enter the permalink code from a friend&apos;s shared results to see how you compare.
            </p>
            <div className="flex gap-2">
              <Input
                className="flex-1"
                value={friendCode}
                onChange={(e) => setFriendCode(e.target.value)}
                placeholder="e.g. wmoqie"
              />
              <Button
                type="button"
                variant="neutral"
                disabled={!friendCode.trim()}
                onClick={() => setFriendState('active')}
              >
                Compare
              </Button>
            </div>
          </div>
        )}

        {shared && (
          <div className="rounded-base border-2 border-dashed border-muted-foreground bg-secondary-background p-3 text-xs font-base text-muted-foreground">
            {permalink}
          </div>
        )}

        <button
          type="button"
          onClick={onRestart}
          className="text-xs font-base text-muted-foreground underline"
        >
          Start over
        </button>
      </CardContent>
    </Card>
  )
}
