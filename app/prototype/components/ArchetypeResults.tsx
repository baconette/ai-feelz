import type { ArchetypeResult } from '@/lib/prototype/archetypes'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

export function ArchetypeResults({
  result,
  onContinueRating,
  bundleSize,
}: {
  result: ArchetypeResult
  onContinueRating: () => void
  bundleSize: number
}) {
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

        <div className="space-y-3 text-left">
          {result.domainScores.map((d) => (
            <div key={d.domainId}>
              <div className="mb-1 flex justify-between text-xs font-base text-foreground">
                <span>{d.domainName}</span>
                <span>{d.average.toFixed(1)} / 5</span>
              </div>
              <Progress value={(d.average / 5) * 100} className="h-2" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
