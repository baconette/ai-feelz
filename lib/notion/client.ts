import { Client } from '@notionhq/client'
import type { PageObjectResponse, QueryDataSourceResponse } from '@notionhq/client'

export interface NotionUseCase {
  notionId: string
  domainId: string | null
  subdomain: string
  useCase: string
  alias: string
  description: string
  order: number
  status: string
  published: boolean
}

export interface NotionDomain {
  notionId: string
  name: string
  description: string
  imageUrl: string | null
}

function getNotionClient() {
  return new Client({ auth: process.env.NOTION_TOKEN })
}

function plainText(property: PageObjectResponse['properties'][string] | undefined): string {
  if (!property) return ''
  if (property.type === 'title') return property.title.map((t) => t.plain_text).join('')
  if (property.type === 'rich_text') return property.rich_text.map((t) => t.plain_text).join('')
  return ''
}

function firstRelationId(property: PageObjectResponse['properties'][string] | undefined): string | null {
  if (!property || property.type !== 'relation') return null
  return property.relation[0]?.id ?? null
}

function firstFileUrl(property: PageObjectResponse['properties'][string] | undefined): string | null {
  if (!property || property.type !== 'files') return null
  const file = property.files[0]
  if (!file) return null
  return file.type === 'external' ? file.external.url : file.type === 'file' ? file.file.url : null
}

function toUseCase(page: PageObjectResponse): NotionUseCase {
  const props = page.properties

  return {
    notionId: page.id,
    domainId: firstRelationId(props['Domain']),
    subdomain: plainText(props['SubDomain']),
    useCase: plainText(props['Use Case']),
    alias: plainText(props['Alias 1']),
    description: plainText(props['Description']),
    order: props['Order']?.type === 'number' ? props['Order'].number ?? 0 : 0,
    status: props['Status']?.type === 'select' ? props['Status'].select?.name ?? '' : '',
    published: props['Published']?.type === 'checkbox' ? props['Published'].checkbox : false,
  }
}

function toDomain(page: PageObjectResponse): NotionDomain {
  const props = page.properties

  return {
    notionId: page.id,
    name: plainText(props['Name']),
    description: plainText(props['Description']),
    imageUrl: firstFileUrl(props['Image']),
  }
}

/** Fetches every row from the AI-use-cases Notion data source where Published is checked. */
export async function fetchPublishedUseCases(): Promise<NotionUseCase[]> {
  const notion = getNotionClient()
  const dataSourceId = process.env.NOTION_USE_CASES_DATA_SOURCE_ID!

  const useCases: NotionUseCase[] = []
  let cursor: string | undefined

  do {
    const response: QueryDataSourceResponse = await notion.dataSources.query({
      data_source_id: dataSourceId,
      filter: { property: 'Published', checkbox: { equals: true } },
      start_cursor: cursor,
    })

    for (const page of response.results) {
      if ('properties' in page) {
        useCases.push(toUseCase(page as PageObjectResponse))
      }
    }

    cursor = response.has_more ? response.next_cursor ?? undefined : undefined
  } while (cursor)

  return useCases
}

/** Fetches every row from the Notion Domains data source. */
export async function fetchDomains(): Promise<NotionDomain[]> {
  const notion = getNotionClient()
  const dataSourceId = process.env.NOTION_DOMAINS_DATA_SOURCE_ID!

  const domains: NotionDomain[] = []
  let cursor: string | undefined

  do {
    const response: QueryDataSourceResponse = await notion.dataSources.query({
      data_source_id: dataSourceId,
      start_cursor: cursor,
    })

    for (const page of response.results) {
      if ('properties' in page) {
        domains.push(toDomain(page as PageObjectResponse))
      }
    }

    cursor = response.has_more ? response.next_cursor ?? undefined : undefined
  } while (cursor)

  return domains
}
