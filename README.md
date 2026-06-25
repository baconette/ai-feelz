# ai-feelz

A web app that captures visitor sentiment via a form and visualizes the data on a live dashboard with rich charts.

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
