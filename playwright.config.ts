import { defineConfig } from '@playwright/test'

// `next build`/`next start` don't auto-load .env.test (only .env.local and
// .env.production do) — load it explicitly so webServer below runs against
// a test Supabase/Notion project rather than falling through to .env.local.
import { config } from 'dotenv'
config({ path: '.env.test' })

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  use: {
    baseURL: process.env.E2E_BASE_URL ?? 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  webServer: process.env.E2E_BASE_URL
    ? undefined
    : {
        command: 'npm run build && npm run start',
        url: 'http://localhost:3000',
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
      },
})
