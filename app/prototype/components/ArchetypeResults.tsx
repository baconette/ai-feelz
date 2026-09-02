'use client'

import { useEffect, useState } from 'react'
import type { ArchetypeResult } from '@/lib/prototype/archetypes'
import { mockAggregateForDomain } from '@/lib/prototype/mockAggregate'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { DomainAverageSlider } from './DomainAverageSlider'
import { ArchetypeCard } from './ArchetypeCard'
import { FriendCodeForm } from './FriendCodeForm'
import { DOMAIN_COLORS, DEFAULT_DOMAIN_TEXT_CLASSES } from '@/lib/prototype/domain-colors'
import { createSessionCode, getSessionByCode, updateSessionCode } from '../actions'

type FriendState = 'idle' | 'form' | 'active'

export function ArchetypeResults({
  result,
  onContinueRating,
  bundleSize,
  onRestart,
  prefillFriendCode,
  hasAggregateThreshold,
  sessionCode,
  onSessionCodeChange,
}: {
  result: ArchetypeResult
  onContinueRating: () => void
  bundleSize: number
  onRestart: () => void
  prefillFriendCode?: string
  hasAggregateThreshold: boolean
  sessionCode?: string
  onSessionCodeChange: (code: string) => void
}) {
  const [friendState, setFriendState] = useState<FriendState>(prefillFriendCode ? 'active' : 'idle')
  const [friendCode, setFriendCode] = useState(prefillFriendCode ?? '')

  const [shared, setShared] = useState(false)
  const [permalink, setPermalink] = useState('')
  const [sharing, setSharing] = useState(false)
  const [shareError, setShareError] = useState(false)
  const [recopyHint, setRecopyHint] = useState(false)

  const [friendResult, setFriendResult] = useState<ArchetypeResult | null>(null)
  const [friendLoading, setFriendLoading] = useState(false)
  const [friendLookupError, setFriendLookupError] = useState(false)

  useEffect(() => {
    if (friendState !== 'active' || !friendCode) return
    let cancelled = false
    setFriendLoading(true)
    setFriendLookupError(false)
    getSessionByCode(friendCode)
      .then((found) => {
        if (cancelled) return
        if (found) {
          setFriendResult(found)
        } else {
          setFriendResult(null)
          setFriendLookupError(true)
        }
      })
      .catch((error) => {
        console.error('[ArchetypeResults] friend lookup failed', error)
        if (!cancelled) {
          setFriendResult(null)
          setFriendLookupError(true)
        }
      })
      .finally(() => {
        if (!cancelled) setFriendLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [friendState, friendCode])

  function handleToggleFriend() {
    if (friendState === 'idle') {
      setShared(false)
      setPermalink('')
      setRecopyHint(false)
      setFriendState('form')
    } else {
      setFriendState('idle')
    }
  }

  async function handleShare() {
    if (shared) {
      setRecopyHint(true)
      navigator.clipboard?.writeText(permalink).catch(() => {})
      return
    }

    setSharing(true)
    setShareError(false)
    setRecopyHint(false)
    try {
      let code = sessionCode
      if (code) {
        await updateSessionCode(code, result)
      } else {
        code = await createSessionCode(result)
        onSessionCodeChange(code)
      }
      const url = `${window.location.origin}/prototype?friend=${code}`
      setPermalink(url)
      setShared(true)
      navigator.clipboard?.writeText(url).catch(() => {})
    } catch {
      setShareError(true)
    } finally {
      setSharing(false)
    }
  }

  const friend = friendState === 'active' ? friendResult : null

  const domainAgreement = friend
    ? result.domainScores
        .flatMap((d) => {
          const friendDomain = friend.domainScores.find((fd) => fd.domainName === d.domainName)
          if (!friendDomain) return []
          return [
            {
              domainId: d.domainId,
              domainName: d.domainName,
              average: d.average,
              friendAverage: friendDomain.average,
              diff: Math.abs(d.average - friendDomain.average),
            },
          ]
        })
        .sort((a, b) => a.diff - b.diff)
    : []
  const mostAgreed = domainAgreement.slice(0, 2)
  const mostDisagreed = [...domainAgreement].reverse().slice(0, 2)

  return (
    <Card className="text-center">
      <CardHeader className="items-center">
        <div className="flex w-full flex-row items-stretch gap-2 sm:gap-3">
          <ArchetypeCard
            headline={result.headline}
            summary={result.summary}
            domainName={result.standoutDomainName}
            label={friend ? 'You' : undefined}
            layout={friend ? 'stacked' : 'horizontal'}
            className="flex-1"
          />
          {friend && (
            <ArchetypeCard
              headline={friend.headline}
              summary={friend.summary}
              domainName={friend.standoutDomainName}
              label="Your Friend"
              layout="stacked"
              className="flex-1"
            />
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6 pb-6">
        <div className="flex items-center justify-between">
          <p className="text-xs font-base text-muted-foreground">
            Your average across {result.ratingCount} answers
          </p>
          <button
            type="button"
            onClick={onContinueRating}
            className="text-xs font-base text-foreground underline hover:text-muted-foreground"
          >
            Answer {bundleSize} more
          </button>
        </div>

        <div className="flex items-center justify-between text-4xl">
          <span aria-hidden>🧠</span>
          <span aria-hidden>🤖</span>
        </div>

        {friendState === 'active' && friendLoading && (
          <p className="mb-12 !mt-4 text-xs font-base text-muted-foreground">
            Loading your friend&apos;s results…
          </p>
        )}

        {friendState === 'active' && friendLookupError && (
          <p className="mb-12 !mt-4 text-xs font-base text-red-500">
            Couldn&apos;t find that code — check it and try again.
          </p>
        )}

        {friend && domainAgreement.length === 0 && (
          <p className="mb-12 !mt-4 text-xs font-base text-muted-foreground">
            You and your friend haven&apos;t rated any of the same domains yet — answer a few more to see
            where you agree and disagree.
          </p>
        )}

        {friend && domainAgreement.length > 0 && (
          <div className="mb-12 !mt-4 text-left">
            <div>
              <p className="mb-4 text-base font-heading text-foreground">Where you agreed most</p>
              <div className="space-y-10">
                {mostAgreed.map((d) => (
                  <div key={d.domainId}>
                    <div
                      className={`mb-2 text-base font-base ${DOMAIN_COLORS[d.domainName]?.domainText ?? DEFAULT_DOMAIN_TEXT_CLASSES}`}
                    >
                      {d.domainName}
                    </div>
                    <DomainAverageSlider
                      average={d.average}
                      friendAverage={d.friendAverage}
                      othersAverage={hasAggregateThreshold ? mockAggregateForDomain(d.domainName) : undefined}
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-12">
              <p className="mb-4 text-base font-heading text-foreground">Where you disagree the most</p>
              <div className="space-y-10">
                {mostDisagreed.map((d) => (
                  <div key={d.domainId}>
                    <div
                      className={`mb-2 text-base font-base ${DOMAIN_COLORS[d.domainName]?.domainText ?? DEFAULT_DOMAIN_TEXT_CLASSES}`}
                    >
                      {d.domainName}
                    </div>
                    <DomainAverageSlider
                      average={d.average}
                      friendAverage={d.friendAverage}
                      othersAverage={hasAggregateThreshold ? mockAggregateForDomain(d.domainName) : undefined}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {friendState !== 'active' && (
          <div className="mb-12 !mt-2 space-y-10 text-left">
            {result.domainScores.map((d) => (
              <div key={d.domainId}>
                <div
                  className={`mb-2 text-base font-base ${DOMAIN_COLORS[d.domainName]?.domainText ?? DEFAULT_DOMAIN_TEXT_CLASSES}`}
                >
                  {d.domainName}
                </div>
                <DomainAverageSlider
                  average={d.average}
                  othersAverage={
                    hasAggregateThreshold ? mockAggregateForDomain(d.domainName) : undefined
                  }
                />
              </div>
            ))}
          </div>
        )}

        <div className="flex flex-wrap items-center justify-center gap-4 pt-4 text-xs font-base text-muted-foreground">
          <span>😃 You</span>
          {friend && <span>✌️ Your Friend</span>}
          {hasAggregateThreshold && <span>🫥 Visitor average</span>}
        </div>

        <div className="flex flex-wrap justify-center gap-3 pt-4">
          <Button type="button" onClick={handleToggleFriend}>
            {friendState === 'idle' ? '✌️ Compare to friend' : 'Hide friend'}
          </Button>
          <Button type="button" variant="neutral" disabled={sharing} onClick={handleShare}>
            🔗 {sharing ? 'Sharing…' : shared ? 'Link copied' : 'Share your results'}
          </Button>
        </div>

        {shareError && (
          <p className="text-xs font-base text-red-500">Could not save your results — please try again.</p>
        )}

        {recopyHint && (
          <p className="text-xs font-base text-red-500">
            Your link has been copied to your clipboard, you may select it below and copy again if that
            didn&apos;t work.
          </p>
        )}

        {friendState === 'form' && (
          <FriendCodeForm
            value={friendCode}
            onChange={setFriendCode}
            onSubmit={() => setFriendState('active')}
          />
        )}

        {shared && (
          <div className="rounded-base border-2 border-dashed border-muted-foreground bg-secondary-background p-3 text-xs font-base text-muted-foreground">
            {permalink}
          </div>
        )}

        <button
          type="button"
          onClick={onRestart}
          className="pt-4 text-xs font-base text-muted-foreground underline"
        >
          Start over
        </button>
      </CardContent>
    </Card>
  )
}
