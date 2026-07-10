import { fetchAllUseCases, fetchDomains } from '@/lib/notion/client'
import { PrototypeFlow } from './PrototypeFlow'

export const dynamic = 'force-dynamic'

export default async function PrototypePage() {
  // Uses fetchAllUseCases (not fetchPublishedUseCases) because only 1 use case in Notion
  // is currently marked Published — too few to demo the real bundle-of-7 flow.
  const [useCases, domains] = await Promise.all([fetchAllUseCases(), fetchDomains()])

  if (useCases.length === 0) {
    return (
      <div className="mx-auto max-w-lg px-4 py-10 text-center text-sm font-base text-muted-foreground">
        No use cases found in Notion. Check NOTION_TOKEN and NOTION_USE_CASES_DATA_SOURCE_ID.
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <PrototypeFlow useCases={useCases} domains={domains} />
    </main>
  )
}
