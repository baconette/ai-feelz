import { test, expect } from '@playwright/test'

/**
 * These hit the real Notion + Supabase clients configured via env vars (see
 * .env.test.example) — run against a disposable/test project, never
 * production, since the first spec writes a real row to `rating_sessions`.
 */

test('rate a bundle, reach results, and generate a share link', async ({ page }) => {
  await page.goto('/prototype')

  await page.getByRole('button', { name: /start your profile/i }).click()

  // Answer every card in the first bundle by dragging the slider to a value
  // via keyboard, which works regardless of how many cards the bundle serves.
  while (await page.getByRole('button', { name: /^next$/i }).isVisible()) {
    await page.getByRole('slider', { name: 'Rating' }).focus()
    await page.keyboard.press('ArrowRight')
    await page.getByRole('button', { name: /^next$/i }).click()
  }

  await expect(page.getByRole('button', { name: /share your results/i })).toBeVisible()

  await page.getByRole('button', { name: /share your results/i }).click()
  await expect(page.getByText(/\/prototype\?friend=/)).toBeVisible()
})

test('an invalid friend code shows an error state instead of crashing', async ({ page }) => {
  await page.goto('/prototype?friend=does-not-exist')

  await expect(page.getByText(/couldn.t be found/i)).toBeVisible()
})
