import { useState } from 'react'
import type { NotionDomain } from '@/lib/notion/client'
import type { ArchetypeResult } from '@/lib/prototype/archetypes'
import { DOMAIN_COLORS, DEFAULT_DOMAIN_MARQUEE_CLASSES } from '@/lib/prototype/domain-colors'
import { Button } from '@/components/ui/button'
import Marquee from '@/components/ui/marquee'
import { FriendCodeForm } from './FriendCodeForm'
import { getSessionByCode } from '../actions'

const HEADING_CLASS =
  'text-5xl font-heading uppercase leading-[0.95] tracking-tight text-background sm:text-6xl'

function buildMarqueeItems(domains: NotionDomain[]) {
  return domains.map((domain) => (
    <span
      key={domain.notionId}
      className={`font-heading text-foreground underline decoration-4 underline-offset-4 ${DOMAIN_COLORS[domain.name]?.marqueeUnderline ?? DEFAULT_DOMAIN_MARQUEE_CLASSES}`}
    >
      {domain.name}
    </span>
  ))
}

export function LandingHero({
  domains,
  onStart,
  onViewSession,
}: {
  domains: NotionDomain[]
  onStart: () => void
  onViewSession: (result: ArchetypeResult) => void
}) {
  const [showCodeEntry, setShowCodeEntry] = useState(false)
  const [code, setCode] = useState('')
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleLookup() {
    setPending(true)
    setError(null)
    try {
      const result = await getSessionByCode(code)
      if (result) {
        onViewSession(result)
      } else {
        setError("We couldn't find a session with that code.")
      }
    } catch {
      setError('Something went wrong — please try again.')
    } finally {
      setPending(false)
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div
        className="fixed inset-0 z-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/legal/justice10.gif')" }}
      />

      <div className="relative z-10 flex min-h-screen flex-col justify-center gap-10 py-16">
        <div className="mx-auto lg:mx-0 lg:ml-20 w-full max-w-[33rem] px-6">
          <h1 className={HEADING_CLASS}>
            AI
            <br />
            is everywhere
          </h1>
        </div>

        <Marquee items={buildMarqueeItems(domains)} />

        <div className="mx-auto lg:mx-0 lg:ml-20 w-full max-w-[33rem] space-y-6 px-6">
          <h2 className={HEADING_CLASS}>
            Do you want AI
            <br />
            in your life?
          </h2>

          <p className="text-sm font-base text-main-foreground sm:text-base">
            Choose when you prefer a human or an AI perform an activity, find out what&apos;s your
            AI profile and see how you compare to others.
          </p>

          <div className="flex flex-col items-center gap-3">
            <Button type="button" variant="neutral" size="lg" onClick={onStart} className="w-full">
              Start Your Profile
            </Button>
            <button
              type="button"
              onClick={() => setShowCodeEntry(true)}
              className="text-center text-xs font-base text-main-foreground underline hover:text-background"
            >
              Enter a code
            </button>
          </div>

          {showCodeEntry && (
            <>
              <FriendCodeForm
                value={code}
                onChange={setCode}
                onSubmit={handleLookup}
                paragraphClassName="text-main-foreground"
                description="Enter a code to view someone's shared results."
                submitLabel={pending ? 'Looking up…' : 'View results'}
                disabled={pending}
              />
              {error && <p className="text-xs font-base text-red-400">{error}</p>}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
