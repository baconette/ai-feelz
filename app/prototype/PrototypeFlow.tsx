'use client'

import { useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import type { NotionDomain, NotionUseCase } from '@/lib/notion/client'
import { computeArchetype } from '@/lib/prototype/archetypes'
import type { Rating, RatingsMap } from '@/lib/prototype/types'
import { UseCaseCard } from './components/UseCaseCard'
import { LandingHero } from './components/LandingHero'
import { ArchetypeResults } from './components/ArchetypeResults'
import { Checkbox } from '@/components/ui/checkbox'

const BUNDLE_SIZE = 10

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
  const [showThresholdPlaceholder, setShowThresholdPlaceholder] = useState(false)

  const searchParams = useSearchParams()
  const friendCodeFromLink = searchParams.get('friend') ?? undefined

  const archetype = useMemo(
    () => computeArchetype(ratings, useCases, domains),
    [ratings, useCases, domains]
  )

  function startBundle() {
    setBundle(makeBundle(useCases))
    setBundleIndex(0)
    setView('rating')
  }

  function handleRatingSubmit(rating: Rating) {
    const current = bundle[bundleIndex]
    setRatings((prev) => ({ ...prev, [current.notionId]: rating }))

    if (bundleIndex + 1 < bundle.length) {
      setBundleIndex(bundleIndex + 1)
    } else {
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
    setView('intro')
  }

  if (view === 'intro') {
    return <LandingHero domains={domains} onStart={startBundle} />
  }

  return (
    <div className="relative isolate ml-20 max-w-lg px-4 pt-16 pb-10">
      <div
        className="fixed inset-0 z-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/legal/justice1.gif')" }}
      />

      <div className="relative z-10">
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
