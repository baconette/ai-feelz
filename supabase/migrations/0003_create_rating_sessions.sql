-- Run this in the Supabase SQL editor (or `supabase db push` if using the CLI).
-- Stores completed rating sessions behind a shareable code, so the homepage
-- "enter a code" flow can look up a previous session's results.

create table if not exists public.rating_sessions (
  code text primary key,
  headline text not null,
  summary text not null,
  kind text not null,
  standout_domain_name text,
  direction text,
  overall_average numeric not null,
  rating_count integer not null,
  domain_scores jsonb not null,
  created_at timestamptz not null default now()
);

alter table public.rating_sessions enable row level security;

-- Unlike use_cases/domains (written only by the service-role sync job),
-- sessions are created directly by anonymous visitors sharing their results,
-- so anon writes must be allowed here.
create policy "Public can read rating sessions"
  on public.rating_sessions
  for select
  using (true);

create policy "Public can create rating sessions"
  on public.rating_sessions
  for insert
  with check (true);
