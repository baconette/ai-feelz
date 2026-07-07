// Netlify Scheduled Function — runs once every 24 hours and triggers the
// Next.js sync route, which pulls Published rows from Notion into Supabase.
export default async () => {
  const siteUrl = process.env.URL || process.env.DEPLOY_PRIME_URL
  const response = await fetch(`${siteUrl}/api/sync-use-cases`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.SYNC_SECRET}` },
  })

  if (!response.ok) {
    throw new Error(`Use-cases sync failed: ${response.status} ${await response.text()}`)
  }
}

export const config = {
  schedule: '@daily',
}
