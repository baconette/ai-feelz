import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { NotionDomain, NotionUseCase } from '@/lib/notion/client'
import { PrototypeFlow } from './PrototypeFlow'

const getSessionByCode = vi.fn()
const createSessionCode = vi.fn()

vi.mock('./actions', () => ({
  getSessionByCode: (...args: unknown[]) => getSessionByCode(...args),
  createSessionCode: (...args: unknown[]) => createSessionCode(...args),
}))

let searchParams = new URLSearchParams()
vi.mock('next/navigation', () => ({
  useSearchParams: () => searchParams,
}))

const domains: NotionDomain[] = [
  { notionId: 'd1', name: 'Healthcare', description: '', imageUrl: null },
  { notionId: 'd2', name: 'Finances', description: '', imageUrl: null },
]

function makeUseCases(count: number): NotionUseCase[] {
  return Array.from({ length: count }, (_, i) => ({
    notionId: `uc${i}`,
    domainId: i % 2 === 0 ? 'd1' : 'd2',
    subdomain: 'sub',
    useCase: `When should AI do thing ${i}`,
    alias: '',
    description: '',
    order: i,
    status: 'active',
    published: true,
  }))
}

async function start(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole('button', { name: /start your profile/i }))
}

function currentSliderValue() {
  return Number(screen.getByRole('slider').getAttribute('aria-valuenow'))
}

/** Drives the Radix slider to a Likert value (1-4) via keyboard, since the
 * tick-label buttons stay `visibility: hidden` in jsdom (no ResizeObserver
 * layout pass) and are excluded from the accessibility tree. */
async function setRating(user: ReturnType<typeof userEvent.setup>, value: 1 | 2 | 3 | 4) {
  const slider = screen.getByRole('slider')
  slider.focus()
  const diff = value - currentSliderValue()
  const key = diff > 0 ? '{ArrowRight}' : '{ArrowLeft}'
  await user.keyboard(key.repeat(Math.abs(diff)))
}

describe('PrototypeFlow', () => {
  beforeEach(() => {
    searchParams = new URLSearchParams()
    getSessionByCode.mockReset()
    createSessionCode.mockReset()
    vi.spyOn(Math, 'random').mockReturnValue(0)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders the landing hero first, then the rating flow after starting', async () => {
    const user = userEvent.setup()
    render(<PrototypeFlow useCases={makeUseCases(3)} domains={domains} />)

    expect(screen.getByRole('button', { name: /start your profile/i })).toBeInTheDocument()
    await start(user)

    expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument()
  })

  it('re-serves the full pool once every use case has been rated', async () => {
    const user = userEvent.setup()
    const useCases = makeUseCases(3)
    render(<PrototypeFlow useCases={useCases} domains={domains} />)

    await start(user)

    // Rate all 3 (bundle size 10 > pool of 3, so the whole pool is the bundle).
    for (let i = 0; i < 3; i++) {
      await setRating(user, 3)
      await user.click(screen.getByRole('button', { name: /next/i }))
    }

    // All rated -> results view.
    await waitFor(() =>
      expect(screen.getByRole('button', { name: /answer 10 more/i })).toBeInTheDocument()
    )

    // Ask for another bundle: since every use case is now rated, makeBundle
    // must fall back to re-serving the full pool rather than an empty bundle.
    await user.click(screen.getByRole('button', { name: /answer 10 more/i }))
    expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument()
  })

  it('preserves a prior rating when going back', async () => {
    const user = userEvent.setup()
    render(<PrototypeFlow useCases={makeUseCases(3)} domains={domains} />)
    await start(user)

    await setRating(user, 3)
    await user.click(screen.getByRole('button', { name: /next/i }))

    expect(screen.getByRole('button', { name: /← back/i })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /← back/i }))

    expect(currentSliderValue()).toBe(3)
  })

  it('loads a shared session by friend code from the query param', async () => {
    getSessionByCode.mockResolvedValue({
      headline: 'The Trusting Patient',
      summary: 'summary text',
      kind: 'domain',
      standoutDomainName: 'Healthcare',
      direction: 'warm',
      overallAverage: 3.2,
      ratingCount: 10,
      domainScores: [],
    })
    searchParams = new URLSearchParams('friend=abc123')

    render(<PrototypeFlow useCases={makeUseCases(3)} domains={domains} />)

    expect(getSessionByCode).toHaveBeenCalledWith('abc123')
    await waitFor(() => expect(screen.getByText('The Trusting Patient')).toBeInTheDocument())
  })

  it('shows an error state when the friend code cannot be resolved', async () => {
    getSessionByCode.mockResolvedValue(null)
    searchParams = new URLSearchParams('friend=missing')

    render(<PrototypeFlow useCases={makeUseCases(3)} domains={domains} />)

    await waitFor(() =>
      expect(screen.getByText(/couldn.t be found/i)).toBeInTheDocument()
    )
  })

  it('flips hasAggregateThreshold when the not-enough-responses preview checkbox is toggled', async () => {
    const user = userEvent.setup()
    render(<PrototypeFlow useCases={makeUseCases(3)} domains={domains} />)
    await start(user)

    for (let i = 0; i < 3; i++) {
      await setRating(user, 3)
      await user.click(screen.getByRole('button', { name: /next/i }))
    }

    await waitFor(() => expect(screen.getByText(/visitor average/i)).toBeInTheDocument())

    await user.click(screen.getByRole('checkbox', { name: /not-enough-responses state/i }))
    expect(screen.queryByText(/visitor average/i)).not.toBeInTheDocument()
  })
})
