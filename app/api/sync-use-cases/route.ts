import { NextRequest, NextResponse } from 'next/server'
import { fetchPublishedUseCases } from '@/lib/notion/client'
import { createAdminClient } from '@/lib/supabase/admin'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.SYNC_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const useCases = await fetchPublishedUseCases()
  const supabase = createAdminClient()

  const rows = useCases.map((uc) => ({
    notion_id: uc.notionId,
    domain: uc.domain,
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

  return NextResponse.json({ synced: rows.length })
}
