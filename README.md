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
- **Content**: Notion (use cases and domains are authored there, synced into Supabase)
- **Database / Backend**: Supabase (Postgres)
- **Testing**: Vitest + React Testing Library (unit/component), Playwright (E2E)
- **Deployment**: Netlify

## Getting Started

1. Clone the repo and install dependencies:

```bash
npm install
```

2. Copy `.env.test.example` to `.env.local` and fill in your Supabase and Notion credentials:

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
NOTION_TOKEN=...
NOTION_USE_CASES_DATA_SOURCE_ID=...
NOTION_DOMAINS_DATA_SOURCE_ID=...
SYNC_SECRET=...
```

3. Start the dev server:

```bash
npm run dev
```

Open [http://localhost:3000/prototype](http://localhost:3000/prototype) to see the app (the root path redirects there).

## Project Structure

```
app/
  page.tsx                    # Redirects to /prototype
  prototype/
    page.tsx                  # Fetches use cases + domains from Supabase, renders the flow
    PrototypeFlow.tsx         # Client-side state machine: intro -> rating -> results
    actions.ts                # Server Actions for saving/loading a shareable results session
    components/               # Rating card, Likert slider, archetype results, etc.
  api/
    sync-use-cases/route.ts   # Syncs Notion domains/use cases into Supabase (bearer-auth'd)
components/
  ui/                         # shadcn primitives
lib/
  prototype/
    archetypes.ts             # Scoring model that derives a visitor's AI-attitude archetype
    types.ts, mockAggregate.ts, mockFriend.ts, domain-colors.ts
  notion/client.ts            # Notion data-source client
  supabase/
    client.ts / server.ts     # Browser vs. Server Component/Action Supabase clients
    admin.ts                  # Service-role client for the Notion sync job
e2e/                          # Playwright specs
docs/                         # PRD, archetype-logic spec, flow diagrams
scripts/simulate-archetypes.ts  # Synthetic-data harness for tuning the archetype thresholds
```

## Key Commands

```bash
npm run dev            # Start local dev server
npm run build          # Production build
npm run lint           # ESLint
npm run typecheck      # tsc --noEmit
npm run test           # Vitest unit/component tests
npm run test:watch     # Vitest in watch mode
npm run test:coverage  # Vitest with coverage report
npm run test:e2e       # Playwright E2E tests (needs .env.test — see e2e/prototype.spec.ts)
```
