import { describe, expect, it, vi, beforeEach, afterAll } from 'vitest'
import { NextRequest } from 'next/server'
import { POST } from './route'

const fetchDomains = vi.fn()
const fetchPublishedUseCases = vi.fn()

vi.mock('@/lib/notion/client', () => ({
  fetchDomains: (...args: unknown[]) => fetchDomains(...args),
  fetchPublishedUseCases: (...args: unknown[]) => fetchPublishedUseCases(...args),
}))

const upsertMock = vi.fn()
const deleteChain = {
  not: vi.fn(),
  neq: vi.fn(),
}
const fromMock = vi.fn(() => ({
  upsert: upsertMock,
  delete: () => deleteChain,
}))

vi.mock('@/lib/supabase/admin', () => ({
  createAdminClient: () => ({ from: fromMock }),
}))

function makeRequest(authHeader?: string) {
  return new NextRequest('http://localhost/api/sync-use-cases', {
    method: 'POST',
    headers: authHeader ? { authorization: authHeader } : {},
  })
}

const domain = {
  notionId: 'd1',
  name: 'Healthcare',
  description: 'desc',
  imageUrl: null,
}

const useCase = {
  notionId: 'uc1',
  domainId: 'd1',
  subdomain: 'sub',
  useCase: 'do a thing',
  alias: 'alias',
  description: 'desc',
  order: 0,
  status: 'active',
  published: true,
}

describe('POST /api/sync-use-cases', () => {
  const originalSecret = process.env.SYNC_SECRET

  beforeEach(() => {
    process.env.SYNC_SECRET = 'test-secret'
    fetchDomains.mockReset().mockResolvedValue([])
    fetchPublishedUseCases.mockReset().mockResolvedValue([])
    upsertMock.mockReset().mockResolvedValue({ error: null })
    deleteChain.not.mockReset().mockResolvedValue({ error: null })
    deleteChain.neq.mockReset().mockResolvedValue({ error: null })
    fromMock.mockClear()
  })

  afterAll(() => {
    process.env.SYNC_SECRET = originalSecret
  })

  it('returns 401 and never calls Notion/Supabase when the auth header is missing', async () => {
    const res = await POST(makeRequest())
    expect(res.status).toBe(401)
    expect(fetchDomains).not.toHaveBeenCalled()
    expect(fetchPublishedUseCases).not.toHaveBeenCalled()
    expect(fromMock).not.toHaveBeenCalled()
  })

  it('returns 401 when the auth header does not match SYNC_SECRET', async () => {
    const res = await POST(makeRequest('Bearer wrong-secret'))
    expect(res.status).toBe(401)
    expect(fetchDomains).not.toHaveBeenCalled()
  })

  it('runs the delete-all branch (neq) when Notion returns no domains/use cases', async () => {
    const res = await POST(makeRequest('Bearer test-secret'))
    expect(res.status).toBe(200)
    expect(deleteChain.neq).toHaveBeenCalledWith('notion_id', '')
    expect(deleteChain.not).not.toHaveBeenCalled()
    const body = await res.json()
    expect(body).toEqual({ synced: 0, domainsSynced: 0 })
  })

  it('upserts and prunes by not-in when Notion returns rows', async () => {
    fetchDomains.mockResolvedValue([domain])
    fetchPublishedUseCases.mockResolvedValue([useCase])

    const res = await POST(makeRequest('Bearer test-secret'))
    expect(res.status).toBe(200)
    expect(upsertMock).toHaveBeenCalledTimes(2)
    expect(deleteChain.not).toHaveBeenCalledTimes(2)
    const body = await res.json()
    expect(body).toEqual({ synced: 1, domainsSynced: 1 })
  })

  it('short-circuits with 500 and skips later steps when the domain upsert errors', async () => {
    fetchDomains.mockResolvedValue([domain])
    upsertMock.mockResolvedValueOnce({ error: { message: 'boom' } })

    const res = await POST(makeRequest('Bearer test-secret'))
    expect(res.status).toBe(500)
    expect(fetchPublishedUseCases).not.toHaveBeenCalled()
  })

  it('short-circuits with 500 when the use_cases upsert errors', async () => {
    fetchDomains.mockResolvedValue([])
    fetchPublishedUseCases.mockResolvedValue([useCase])
    upsertMock.mockResolvedValueOnce({ error: { message: 'boom' } })

    const res = await POST(makeRequest('Bearer test-secret'))
    expect(res.status).toBe(500)
  })
})
