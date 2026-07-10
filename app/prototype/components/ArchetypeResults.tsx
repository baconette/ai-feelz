'use client'

import { useState } from 'react'
import type { ArchetypeResult } from '@/lib/prototype/archetypes'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

export function ArchetypeResults({ result }: { result: ArchetypeResult }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <Card className="text-center">
      <CardHeader className="items-center">
        <div className="mx-auto mb-2 h-14 w-14 rounded-full border-2 border-dashed border-border" />
        <CardTitle className="text-xl">{result.headline}</CardTitle>
        <CardDescription className="mx-auto max-w-sm">{result.summary}</CardDescription>
      </CardHeader>

      <CardContent>
        <p className="text-xs font-base text-muted-foreground">
          Based on {result.ratingCount} ratings so far
        </p>

        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="mt-4 text-xs font-base text-foreground underline"
        >
          {expanded ? 'Hide domain breakdown' : 'See how you rated each domain'}
        </button>

        {expanded && (
          <div className="mt-4 space-y-3 text-left">
            {result.domainScores.map((d) => (
              <div key={d.domainId}>
                <div className="mb-1 flex justify-between text-xs font-base text-foreground">
                  <span>{d.domainName}</span>
                  <span>{d.average.toFixed(1)} / 4</span>
                </div>
                <Progress value={(d.average / 4) * 100} className="h-2" />
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
