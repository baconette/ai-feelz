'use server'

import { createClient } from '@/lib/supabase/server'
import type { ArchetypeResult } from '@/lib/prototype/archetypes'

function generateCode() {
  return Math.random().toString(36).slice(2, 8)
}

export async function createSessionCode(result: ArchetypeResult): Promise<string> {
  const supabase = createClient()
  const code = generateCode()

  const { error } = await supabase.from('rating_sessions').insert({
    code,
    headline: result.headline,
    summary: result.summary,
    kind: result.kind,
    standout_domain_name: result.standoutDomainName ?? null,
    direction: result.direction ?? null,
    overall_average: result.overallAverage,
    rating_count: result.ratingCount,
    domain_scores: result.domainScores,
  })

  if (error) throw new Error('Could not save your results — please try again.')
  return code
}

export async function getSessionByCode(code: string): Promise<ArchetypeResult | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('rating_sessions')
    .select('*')
    .eq('code', code.trim())
    .maybeSingle()

  if (error) throw new Error('Could not look up that code — please try again.')
  if (!data) return null

  return {
    headline: data.headline,
    summary: data.summary,
    kind: data.kind,
    standoutDomainName: data.standout_domain_name ?? undefined,
    direction: data.direction ?? undefined,
    overallAverage: data.overall_average,
    ratingCount: data.rating_count,
    domainScores: data.domain_scores,
  }
}
