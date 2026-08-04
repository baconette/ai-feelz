import type { NotionDomain } from '@/lib/notion/client'
import { DOMAIN_COLORS, DEFAULT_DOMAIN_MARQUEE_CLASSES } from '@/lib/prototype/domain-colors'
import { Button } from '@/components/ui/button'
import Marquee from '@/components/ui/marquee'

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
}: {
  domains: NotionDomain[]
  onStart: () => void
}) {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div
        className="fixed inset-0 z-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/legal/justice10.gif')" }}
      />

      <div className="relative z-10 flex min-h-screen flex-col justify-center gap-10 py-16">
        <div className="ml-20 w-full max-w-lg px-6">
          <h1 className={HEADING_CLASS}>
            AI
            <br />
            is everywhere
          </h1>
        </div>

        <Marquee items={buildMarqueeItems(domains)} />

        <div className="ml-20 w-full max-w-lg space-y-6 px-6">
          <h2 className={HEADING_CLASS}>
            But it&apos;s not
            <br />
            all the same
          </h2>

          <p className="text-sm font-base text-main-foreground sm:text-base">
            Learn about its different applications by choosing who, in your opinion, should
            perform an activity, a human or an AI.
          </p>

          <p className="text-center text-xs font-base text-main-foreground">
            Takes ~5 min · No sign-up needed
          </p>

          <div className="flex flex-col items-center gap-3">
            <Button type="button" variant="neutral" size="lg" onClick={onStart} className="w-full">
              Start Rating →
            </Button>
            <button
              type="button"
              className="text-center text-xs font-base text-main-foreground underline hover:text-background"
            >
              Have a code? Enter it
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
