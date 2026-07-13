'use client'

import { useMemo, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

export function ShareScreen({ onClose, onRestart }: { onClose: () => void; onRestart: () => void }) {
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
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) onClose()
      }}
    >
      <DialogContent className="text-center">
        <DialogHeader>
          <DialogTitle className="text-center">Thanks for rating! Share your results:</DialogTitle>
        </DialogHeader>

        <div className="rounded-base border-2 border-dashed border-border bg-secondary-background p-3 text-xs font-base text-muted-foreground">
          {fakeUrl}
        </div>

        <Button type="button" onClick={handleCopy} className="mx-auto">
          {copied ? 'Copied!' : 'Copy link'}
        </Button>

        <button
          type="button"
          onClick={onRestart}
          className="text-xs font-base text-muted-foreground underline"
        >
          Start over
        </button>
      </DialogContent>
    </Dialog>
  )
}
