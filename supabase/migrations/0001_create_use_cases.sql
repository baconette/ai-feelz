-- Run this in the Supabase SQL editor (or `supabase db push` if using the CLI).
-- Mirrors the "AI-use-cases" Notion database for public read access.

create table if not exists public.use_cases (
  notion_id text primary key,
  domain text not null default '',
  subdomain text not null default '',
  use_case text not null default '',
  alias text not null default '',
  description text not null default '',
  order_index integer not null default 0,
  status text not null default '',
  published boolean not null default false,
  updated_at timestamptz not null default now()
);

alter table public.use_cases enable row level security;

-- Writes only happen from the sync route via the service-role key, which
-- bypasses RLS entirely, so no insert/update/delete policy is needed here.
create policy "Public can read use cases"
  on public.use_cases
  for select
  using (true);
