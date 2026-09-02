-- Run this in the Supabase SQL editor (or `supabase db push` if using the CLI).
-- Visitors reuse their existing share code when re-sharing after rating more
-- use cases, which requires an UPDATE against their own row. Without this
-- policy, RLS silently drops the update (no error, zero rows affected) since
-- 0003 only granted anon insert/select.

create policy "Public can update rating sessions"
  on public.rating_sessions
  for update
  using (true)
  with check (true);
