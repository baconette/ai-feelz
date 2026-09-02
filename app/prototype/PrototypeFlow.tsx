'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import type { NotionDomain, NotionUseCase } from '@/lib/notion/client'
import { computeArchetype } from '@/lib/prototype/archetypes'
import type { Rating, RatingsMap } from '@/lib/prototype/types'
import { UseCaseCard } from './components/UseCaseCard'
import { LandingHero } from './components/LandingHero'
import { ArchetypeResults } from './components/ArchetypeResults'
import { SessionResultView, type SessionViewState } from './components/SessionResultView'
import { Checkbox } from '@/components/ui/checkbox'
import { getSessionByCode } from './actions'
import { getOrCreateVisitorId, track } from '@/lib/analytics/posthog'

const BUNDLE_SIZE = 10

type View = 'intro' | 'rating' | 'results' | 'viewingSession'

function shuffle<T>(items: T[]): T[] {
  const copy = [...items]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

function makeBundle(pool: NotionUseCase[], ratings: RatingsMap): NotionUseCase[] {
  const unrated = pool.filter((useCase) => !(useCase.notionId in ratings))
  const source = unrated.length > 0 ? unrated : pool
  return shuffle(source).slice(0, Math.min(BUNDLE_SIZE, source.length))
}

export function PrototypeFlow({
  useCases,
  domains,
}: {
  useCases: NotionUseCase[]
  domains: NotionDomain[]
}) {
  const searchParams = useSearchParams()
  const friendCodeFromLink = searchParams.get('friend') ?? undefined

  const [view, setView] = useState<View>(friendCodeFromLink ? 'viewingSession' : 'intro')
  const [ratings, setRatings] = useState<RatingsMap>({})
  const [bundle, setBundle] = useState<NotionUseCase[]>([])
  const [bundleIndex, setBundleIndex] = useState(0)
  const [showThresholdPlaceholder, setShowThresholdPlaceholder] = useState(false)
  const [sharedSession, setSharedSession] = useState<SessionViewState>({ status: 'loading' })
  const [sessionCode, setSessionCode] = useState<string | undefined>(undefined)
  const [bundleNumber, setBundleNumber] = useState(0)
  const [bundlesCompletedTotal, setBundlesCompletedTotal] = useState(0)
  const sessionStartedAt = useRef<number>(0)
  const hasTrackedSessionStart = useRef(false)

  useEffect(() => {
    if (hasTrackedSessionStart.current) return
    hasTrackedSessionStart.current = true
    sessionStartedAt.current = Date.now()
    const { id: visitorId, isReturning } = getOrCreateVisitorId()
    const params = new URLSearchParams(window.location.search)
    track('session_started', {
      visitor_id: visitorId,
      referral_code: friendCodeFromLink ?? null,
      is_returning: isReturning,
      referrer_domain: document.referrer ? new URL(document.referrer).hostname : null,
      utm_source: params.get('utm_source'),
      utm_medium: params.get('utm_medium'),
      utm_campaign: params.get('utm_campaign'),
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!friendCodeFromLink) return
    let cancelled = false
    setSharedSession({ status: 'loading' })
    getSessionByCode(friendCodeFromLink)
      .then((result) => {
        if (cancelled) return
        setSharedSession(result ? { status: 'found', result } : { status: 'error' })
      })
      .catch((error) => {
        console.error('[PrototypeFlow] getSessionByCode failed', error)
        if (!cancelled) setSharedSession({ status: 'error' })
      })
    return () => {
      cancelled = true
    }
  }, [friendCodeFromLink])

  const archetype = useMemo(
    () => computeArchetype(ratings, useCases, domains),
    [ratings, useCases, domains]
  )

  function startBundle() {
    const nextBundleNumber = bundleNumber + 1
    setBundleNumber(nextBundleNumber)
    setBundle(makeBundle(useCases, ratings))
    setBundleIndex(0)
    setView('rating')
    track('bundle_started', { bundle_number: nextBundleNumber })
  }

  function handleRatingSubmit(rating: Rating) {
    const current = bundle[bundleIndex]
    setRatings((prev) => ({ ...prev, [current.notionId]: rating }))
    track('use_case_rated', {
      use_case_id: current.notionId,
      domain: domains.find((d) => d.notionId === current.domainId)?.name ?? null,
      rating_value: rating.value,
      bundle_number: bundleNumber,
    })

    if (bundleIndex + 1 < bundle.length) {
      setBundleIndex(bundleIndex + 1)
    } else {
      const nextBundlesCompletedTotal = bundlesCompletedTotal + 1
      setBundlesCompletedTotal(nextBundlesCompletedTotal)
      setView('results')
      track('bundle_completed', {
        bundle_number: bundleNumber,
        bundles_completed_total: nextBundlesCompletedTotal,
      })
      track('results_viewed', {
        bundles_completed_total: nextBundlesCompletedTotal,
        session_duration_ms: Date.now() - sessionStartedAt.current,
      })
    }
  }

  function handleBack() {
    setBundleIndex((i) => Math.max(0, i - 1))
  }

  function reset() {
    setRatings({})
    setBundle([])
    setBundleIndex(0)
    setSessionCode(undefined)
    setView('intro')
  }

  if (view === 'intro') {
    return <LandingHero domains={domains} onStart={startBundle} />
  }

  return (
    <div className="relative isolate mx-auto lg:mx-0 lg:ml-20 max-w-[33rem] px-4 pt-16 pb-10">
      <div
        className="fixed inset-0 z-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/legal/justice1.gif')" }}
      />

      <div className="relative z-10">
        {view === 'viewingSession' && (
          <SessionResultView state={sharedSession} onStartOwn={startBundle} />
        )}

        {view === 'rating' && bundle[bundleIndex] && (
          <UseCaseCard
            useCase={bundle[bundleIndex]}
            index={bundleIndex + 1}
            total={bundle.length}
            domains={domains}
            initialRating={ratings[bundle[bundleIndex].notionId]}
            canGoBack={bundleIndex > 0}
            onSubmit={handleRatingSubmit}
            onBack={handleBack}
            bundleNumber={bundleNumber}
          />
        )}

        {view === 'results' && (
          <div className="space-y-4">
            <ArchetypeResults
              result={archetype}
              onContinueRating={startBundle}
              bundleSize={BUNDLE_SIZE}
              onRestart={reset}
              prefillFriendCode={friendCodeFromLink}
              hasAggregateThreshold={!showThresholdPlaceholder}
              sessionCode={sessionCode}
              onSessionCodeChange={setSessionCode}
            />

            <label className="flex items-center justify-center gap-2 text-xs font-base text-muted-foreground">
              <Checkbox
                checked={showThresholdPlaceholder}
                onCheckedChange={(checked) => setShowThresholdPlaceholder(checked === true)}
              />
              Preview: not-enough-responses state
            </label>
          </div>
        )}
      </div>
    </div>
  )
}
