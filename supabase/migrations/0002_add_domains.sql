-- Run this in the Supabase SQL editor (or `supabase db push` if using the CLI).
-- Adds a domains table mirroring the Notion "Domains" database, and switches
-- use_cases.domain from a free-text column to a domain_id foreign key.

create table if not exists public.domains (
  notion_id text primary key,
  name text not null default '',
  description text not null default '',
  image_url text,
  updated_at timestamptz not null default now()
);

alter table public.domains enable row level security;

create policy "Public can read domains"
  on public.domains
  for select
  using (true);

alter table public.use_cases
  drop column if exists domain;

alter table public.use_cases
  add column if not exists domain_id text references public.domains(notion_id);
