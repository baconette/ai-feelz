'use client'

import { useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import type { NotionDomain, NotionUseCase } from '@/lib/notion/client'
import { computeArchetype } from '@/lib/prototype/archetypes'
import type { Rating, RatingsMap } from '@/lib/prototype/types'
import { UseCaseCard } from './components/UseCaseCard'
import { ArchetypeResults } from './components/ArchetypeResults'
import { AggregateComparison } from './components/AggregateComparison'
import { FriendComparison } from './components/FriendComparison'
import { ShareScreen } from './components/ShareScreen'
import type { CompareTab } from './components/CompareTabs'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'

const BUNDLE_SIZE = 7

type View = 'intro' | 'rating' | 'results'

function shuffle<T>(items: T[]): T[] {
  const copy = [...items]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

function makeBundle(pool: NotionUseCase[]): NotionUseCase[] {
  return shuffle(pool).slice(0, Math.min(BUNDLE_SIZE, pool.length))
}

export function PrototypeFlow({
  useCases,
  domains,
}: {
  useCases: NotionUseCase[]
  domains: NotionDomain[]
}) {
  const [view, setView] = useState<View>('intro')
  const [ratings, setRatings] = useState<RatingsMap>({})
  const [bundle, setBundle] = useState<NotionUseCase[]>([])
  const [bundleIndex, setBundleIndex] = useState(0)
  const [completedBundles, setCompletedBundles] = useState(0)
  const [showThresholdPlaceholder, setShowThresholdPlaceholder] = useState(false)
  const [ack, setAck] = useState<string | null>(null)
  const [shareOpen, setShareOpen] = useState(false)
  const [showAggregate, setShowAggregate] = useState(false)
  const [compareTab, setCompareTab] = useState<CompareTab>('friend')

  const searchParams = useSearchParams()
  const friendCodeFromLink = searchParams.get('friend') ?? undefined

  const archetype = useMemo(
    () => computeArchetype(ratings, useCases, domains),
    [ratings, useCases, domains]
  )

  function showAck(message: string) {
    setAck(message)
    setTimeout(() => setAck(null), 2000)
  }

  function startBundle() {
    setBundle(makeBundle(useCases))
    setBundleIndex(0)
    setView('rating')
    setShowAggregate(false)
  }

  function handleRatingSubmit(rating: Rating) {
    const current = bundle[bundleIndex]
    setRatings((prev) => ({ ...prev, [current.notionId]: rating }))

    if (bundleIndex + 1 < bundle.length) {
      setBundleIndex(bundleIndex + 1)
    } else {
      setCompletedBundles((n) => n + 1)
      setView('results')
    }
  }

  function handleBack() {
    setBundleIndex((i) => Math.max(0, i - 1))
  }

  function reset() {
    setRatings({})
    setBundle([])
    setBundleIndex(0)
    setCompletedBundles(0)
    setView('intro')
    setShareOpen(false)
    setShowAggregate(false)
  }

  return (
    <div className="relative isolate mx-auto max-w-lg px-4 py-10">
      {view === 'intro' && (
        <div
          className="fixed inset-0 z-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/dunes.gif')" }}
        />
      )}
      {view === 'intro' && (
        <Card className="relative z-10 text-center">
          <CardHeader>
            <CardTitle className="text-xl">Where do you draw the line?</CardTitle>
            <CardDescription>
              Rate a handful of real AI use cases, then see how your attitude toward AI compares
              to everyone else&apos;s.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button type="button" size="lg" onClick={startBundle}>
              Start rating
            </Button>
          </CardContent>
        </Card>
      )}

      {view === 'rating' && bundle[bundleIndex] && (
        <UseCaseCard
          useCase={bundle[bundleIndex]}
          index={bundleIndex + 1}
          total={bundle.length}
          initialRating={ratings[bundle[bundleIndex].notionId]}
          canGoBack={bundleIndex > 0}
          onSubmit={handleRatingSubmit}
          onBack={handleBack}
          onRequestExplanation={() => showAck("Flagged for the content team — thanks!")}
        />
      )}

      {view === 'results' && (
        <div className="space-y-4">
          <ArchetypeResults result={archetype} />
          <div className="flex flex-wrap justify-center gap-3">
            {!showAggregate && (
              <Button type="button" onClick={() => setShowAggregate(true)}>
                Compare my results
              </Button>
            )}
            <Button type="button" variant="neutral" onClick={startBundle}>
              Continue rating
            </Button>
            <Button type="button" variant="neutral" onClick={() => setShareOpen(true)}>
              Share my results
            </Button>
          </div>
        </div>
      )}

      {shareOpen && <ShareScreen onClose={() => setShareOpen(false)} onRestart={reset} />}

      <p className="mt-8 text-center text-xs font-base text-muted-foreground">
        {completedBundles} round{completedBundles === 1 ? '' : 's'} complete · neobrutalist prototype
      </p>

      {view === 'results' && showAggregate && (
        <div className="mt-6 space-y-4">
          {compareTab === 'friend' ? (
            <FriendComparison
              result={archetype}
              prefillCode={friendCodeFromLink}
              activeTab={compareTab}
              onTabChange={setCompareTab}
            />
          ) : (
            <>
              <AggregateComparison
                result={archetype}
                showPlaceholder={showThresholdPlaceholder}
                activeTab={compareTab}
                onTabChange={setCompareTab}
              />
              <label className="flex items-center justify-center gap-2 text-xs font-base text-muted-foreground">
                <Checkbox
                  checked={showThresholdPlaceholder}
                  onCheckedChange={(checked) => setShowThresholdPlaceholder(checked === true)}
                />
                Preview: not-enough-responses state
              </label>
            </>
          )}

          <div className="text-center">
            <button
              type="button"
              onClick={() => setShowAggregate(false)}
              className="text-sm font-base text-muted-foreground underline"
            >
              Hide comparison
            </button>
          </div>
        </div>
      )}

      {ack && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 rounded-base border-2 border-border bg-secondary-background px-4 py-2 text-xs font-base text-foreground shadow-shadow">
          {ack}
        </div>
      )}
    </div>
  )
}
