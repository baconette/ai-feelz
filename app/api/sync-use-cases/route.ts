import { NextRequest, NextResponse } from 'next/server'
import { fetchDomains, fetchPublishedUseCases } from '@/lib/notion/client'
import { createAdminClient } from '@/lib/supabase/admin'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.SYNC_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createAdminClient()

  const domains = await fetchDomains()
  const domainRows = domains.map((d) => ({
    notion_id: d.notionId,
    name: d.name,
    description: d.description,
    image_url: d.imageUrl,
    updated_at: new Date().toISOString(),
  }))

  if (domainRows.length > 0) {
    const { error: domainUpsertError } = await supabase
      .from('domains')
      .upsert(domainRows, { onConflict: 'notion_id' })

    if (domainUpsertError) {
      return NextResponse.json({ error: domainUpsertError.message }, { status: 500 })
    }
  }

  const domainDeleteQuery = supabase.from('domains').delete()
  const { error: domainDeleteError } =
    domainRows.length > 0
      ? await domainDeleteQuery.not(
          'notion_id',
          'in',
          `(${domainRows.map((d) => `"${d.notion_id}"`).join(',')})`
        )
      : await domainDeleteQuery.neq('notion_id', '')

  if (domainDeleteError) {
    return NextResponse.json({ error: domainDeleteError.message }, { status: 500 })
  }

  const useCases = await fetchPublishedUseCases()

  const rows = useCases.map((uc) => ({
    notion_id: uc.notionId,
    domain_id: uc.domainId,
    subdomain: uc.subdomain,
    use_case: uc.useCase,
    alias: uc.alias,
    description: uc.description,
    order_index: uc.order,
    status: uc.status,
    published: uc.published,
    updated_at: new Date().toISOString(),
  }))

  if (rows.length > 0) {
    const { error: upsertError } = await supabase
      .from('use_cases')
      .upsert(rows, { onConflict: 'notion_id' })

    if (upsertError) {
      return NextResponse.json({ error: upsertError.message }, { status: 500 })
    }
  }

  // Remove rows for pages that are no longer published (or were deleted in Notion).
  // Runs even when rows.length is 0, so unpublishing everything actually clears the table.
  const deleteQuery = supabase.from('use_cases').delete()
  const { error: deleteError } =
    rows.length > 0
      ? await deleteQuery.not(
          'notion_id',
          'in',
          `(${rows.map((r) => `"${r.notion_id}"`).join(',')})`
        )
      : await deleteQuery.neq('notion_id', '')

  if (deleteError) {
    return NextResponse.json({ error: deleteError.message }, { status: 500 })
  }

  return NextResponse.json({ synced: rows.length, domainsSynced: domainRows.length })
}
