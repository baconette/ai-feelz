'use client'

import { useMemo, useState } from 'react'
import { Card, CardContent, CardHeader, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export function ShareScreen({ onRestart }: { onRestart: () => void }) {
  const [copied, setCopied] = useState(false)

  const fakeUrl = useMemo(() => {
    const code = Math.random().toString(36).slice(2, 8)
    return `${window.location.origin}/prototype?friend=${code}`
  }, [])

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(fakeUrl)
    } catch {
      // clipboard access unavailable in this context — the confirmation still shows
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Card className="text-center">
      <CardHeader>
        <CardDescription>Thanks for rating! Share your results:</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="rounded-base border-2 border-dashed border-border bg-secondary-background p-3 text-xs font-base text-muted-foreground">
          {fakeUrl}
        </div>

        <Button type="button" onClick={handleCopy}>
          {copied ? 'Copied!' : 'Copy link'}
        </Button>

        <div>
          <button type="button" onClick={onRestart} className="text-xs font-base text-muted-foreground underline">
            Start over
          </button>
        </div>
      </CardContent>
    </Card>
  )
}
