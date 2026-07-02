# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A web app that captures data from visitors via a form and visualizes that data on a dashboard with rich charts.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Database / Backend**: Supabase (Postgres, Auth, Realtime)
- **Deployment**: Netlify

## Key Commands

```bash
npm run dev        # Start local dev server (http://localhost:3000)
npm run build      # Production build
npm run lint       # ESLint
npm run typecheck  # tsc --noEmit
```

## Architecture

### Two main surfaces
1. **Visitor capture** — a public-facing form that writes submissions to Supabase
2. **Dashboard** — a protected route that queries submissions and renders Recharts visualizations

### Data flow
- Visitor form → Next.js Server Action → Supabase `submissions` table
- Dashboard page → Supabase query (server component) → Recharts (client component)

### Directory conventions
- `app/` — Next.js App Router pages and layouts
- `app/dashboard/` — chart dashboard (auth-protected)
- `app/actions/` — Server Actions for form submissions
- `components/charts/` — Recharts wrapper components (all `"use client"`)
- `lib/supabase/` — Supabase client helpers (server vs. client instances)

### Supabase clients
Two separate clients must be used:
- `lib/supabase/server.ts` — for Server Components and Server Actions (uses `cookies()`)
- `lib/supabase/client.ts` — for Client Components (singleton browser client)

Mixing these up causes auth/session bugs.

### Chart components
All Recharts components require `"use client"` since they use browser APIs. Data fetching should happen in the parent Server Component and be passed down as props.
