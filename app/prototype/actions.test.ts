import { describe, expect, it, vi, beforeEach } from 'vitest'
import type { ArchetypeResult } from '@/lib/prototype/archetypes'
import { createSessionCode, getSessionByCode, updateSessionCode } from './actions'

const insertMock = vi.fn()
const maybeSingleMock = vi.fn()
const eqMock = vi.fn(() => ({ maybeSingle: maybeSingleMock }))
const selectMock = vi.fn(() => ({ eq: eqMock }))
const updateSelectMock = vi.fn()
const updateEqMock = vi.fn(() => ({ select: updateSelectMock }))
const updateMock = vi.fn<(row: Record<string, unknown>) => { eq: typeof updateEqMock }>(() => ({
  eq: updateEqMock,
}))
const fromMock = vi.fn(() => ({ insert: insertMock, select: selectMock, update: updateMock }))

vi.mock('@/lib/supabase/server', () => ({
  createClient: () => ({ from: fromMock }),
}))

const baseResult: ArchetypeResult = {
  headline: 'The Trusting Patient',
  summary: 'summary text',
  kind: 'domain',
  standoutDomainName: 'Healthcare',
  direction: 'warm',
  overallAverage: 3.2,
  ratingCount: 10,
  domainScores: [{ domainId: 'd1', domainName: 'Healthcare', average: 3.5, count: 4 }],
}

describe('createSessionCode', () => {
  beforeEach(() => {
    insertMock.mockReset().mockResolvedValue({ error: null })
    fromMock.mockClear()
  })

  it('sends the full row shape to insert(), including nullable fallbacks', async () => {
    await createSessionCode(baseResult)

    expect(fromMock).toHaveBeenCalledWith('rating_sessions')
    expect(insertMock).toHaveBeenCalledTimes(1)
    const row = insertMock.mock.calls[0][0]
    expect(row).toMatchObject({
      headline: baseResult.headline,
      summary: baseResult.summary,
      kind: baseResult.kind,
      standout_domain_name: 'Healthcare',
      direction: 'warm',
      overall_average: baseResult.overallAverage,
      rating_count: baseResult.ratingCount,
      domain_scores: baseResult.domainScores,
    })
    expect(typeof row.code).toBe('string')
  })

  it('falls back to null for standout_domain_name and direction when absent', async () => {
    const evenKeel: ArchetypeResult = {
      ...baseResult,
      kind: 'evenKeel',
      standoutDomainName: undefined,
      direction: undefined,
    }
    await createSessionCode(evenKeel)
    const row = insertMock.mock.calls[0][0]
    expect(row.standout_domain_name).toBeNull()
    expect(row.direction).toBeNull()
  })

  it('returns the generated code on success', async () => {
    const code = await createSessionCode(baseResult)
    expect(code).toMatch(/^[a-z0-9]+$/)
  })

  it('throws a friendly message when Supabase errors, not the raw error', async () => {
    insertMock.mockResolvedValue({ error: { message: 'raw pg error: duplicate key' } })
    await expect(createSessionCode(baseResult)).rejects.toThrow(
      'Could not save your results — please try again.'
    )
  })
})

describe('updateSessionCode', () => {
  beforeEach(() => {
    fromMock.mockClear()
    insertMock.mockClear()
    updateMock.mockClear()
    updateEqMock.mockClear()
    updateSelectMock.mockReset().mockResolvedValue({ data: [{ code: 'abc123' }], error: null })
  })

  it('updates the row for the given code instead of inserting a new one', async () => {
    await updateSessionCode('abc123', baseResult)

    expect(fromMock).toHaveBeenCalledWith('rating_sessions')
    expect(insertMock).not.toHaveBeenCalled()
    expect(updateMock).toHaveBeenCalledTimes(1)
    const row = updateMock.mock.calls[0][0]
    expect(row).toMatchObject({
      headline: baseResult.headline,
      summary: baseResult.summary,
      kind: baseResult.kind,
      standout_domain_name: 'Healthcare',
      direction: 'warm',
      overall_average: baseResult.overallAverage,
      rating_count: baseResult.ratingCount,
      domain_scores: baseResult.domainScores,
    })
    expect(updateEqMock).toHaveBeenCalledWith('code', 'abc123')
  })

  it('throws a friendly message when Supabase errors, not the raw error', async () => {
    updateSelectMock.mockResolvedValue({ data: null, error: { message: 'raw pg error' } })
    await expect(updateSessionCode('abc123', baseResult)).rejects.toThrow(
      'Could not save your results — please try again.'
    )
  })

  it('throws when the update matches no rows (e.g. blocked by RLS), not just when Supabase errors', async () => {
    updateSelectMock.mockResolvedValue({ data: [] as { code: string }[], error: null })
    await expect(updateSessionCode('abc123', baseResult)).rejects.toThrow(
      'Could not save your results — please try again.'
    )
  })
})

describe('getSessionByCode', () => {
  beforeEach(() => {
    fromMock.mockClear()
    selectMock.mockClear()
    eqMock.mockClear()
    maybeSingleMock.mockReset()
  })

  it('trims whitespace from the code before querying', async () => {
    maybeSingleMock.mockResolvedValue({ data: null, error: null })
    await getSessionByCode('  abc123  ')
    expect(eqMock).toHaveBeenCalledWith('code', 'abc123')
  })

  it('returns null when no session is found, without throwing', async () => {
    maybeSingleMock.mockResolvedValue({ data: null, error: null })
    await expect(getSessionByCode('missing')).resolves.toBeNull()
  })

  it('maps a found row back into an ArchetypeResult', async () => {
    maybeSingleMock.mockResolvedValue({
      data: {
        headline: 'The Trusting Patient',
        summary: 'summary text',
        kind: 'domain',
        standout_domain_name: 'Healthcare',
        direction: 'warm',
        overall_average: 3.2,
        rating_count: 10,
        domain_scores: baseResult.domainScores,
      },
      error: null,
    })
    const result = await getSessionByCode('abc123')
    expect(result).toEqual(baseResult)
  })

  it('throws a friendly message when Supabase errors, not the raw error', async () => {
    maybeSingleMock.mockResolvedValue({ data: null, error: { message: 'raw pg error' } })
    await expect(getSessionByCode('abc123')).rejects.toThrow(
      'Could not look up that code — please try again.'
    )
  })
})
