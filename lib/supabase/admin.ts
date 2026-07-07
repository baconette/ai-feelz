import { createClient } from '@supabase/supabase-js'

/**
 * Service-role client for server-only writes (e.g. the Notion sync job).
 * Bypasses RLS — never import this into client components or expose the key.
 */
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  )
}
