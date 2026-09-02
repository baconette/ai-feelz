# ai-feelz

An interactive web experience where visitors rate real-world AI use cases — "should a human or an AI do this?" — and get back a personalized "AI attitude profile" they can compare against friends and the broader visitor pool.

## What this project does

Visitors rate AI use cases (103 at launch, organized into domains and subdomains) on a 1–5 scale from Never to Always a human should do it instead of AI. Ratings are served in randomized bundles of 10 so the experience feels like a continuous stream rather than a category-by-category survey. After each bundle, visitors see a personalized results visualization, can compare it against a friend's shared results or an aggregate of all visitors, and can share their own results as a unique link.

## Why this project is useful

Conversations about AI's role in creative, professional, and personal life tend to stay abstract and polarized. This app gives people a structured, low-friction way to articulate where they personally draw the line between human and AI-performed work, see how that compares to their peers, and discover AI use cases they hadn't considered before — turning an abstract debate into something personal and shareable.

## Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Database / Backend**: Supabase (Postgres, Auth, Realtime)
- **Deployment**: Netlify

## Getting Started

1. Clone the repo and install dependencies:

```bash
npm install
```

2. Copy `.env.local.example` to `.env.local` and fill in your Supabase credentials:

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

3. Start the dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Project Structure

```
app/
  page.tsx          # Public visitor form
  dashboard/        # Protected chart dashboard
  actions/          # Server Actions for form submissions
components/
  charts/           # Recharts wrapper components (all "use client")
lib/
  supabase/
    client.ts       # Browser Supabase client
    server.ts       # Server Component / Server Action Supabase client
```

## Key Commands

```bash
npm run dev        # Start local dev server
npm run build      # Production build
npm run lint       # ESLint
npm run typecheck  # tsc --noEmit
```
