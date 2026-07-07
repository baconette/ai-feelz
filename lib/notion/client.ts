import { Client } from '@notionhq/client'
import type { PageObjectResponse, QueryDataSourceResponse } from '@notionhq/client'

export interface NotionUseCase {
  notionId: string
  domain: string
  subdomain: string
  useCase: string
  alias: string
  description: string
  order: number
  status: string
  published: boolean
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

function toUseCase(page: PageObjectResponse): NotionUseCase {
  const props = page.properties

  return {
    notionId: page.id,
    domain: plainText(props['Domain']),
    subdomain: plainText(props['SubDomain']),
    useCase: plainText(props['Use Case']),
    alias: plainText(props['Alias 1']),
    description: plainText(props['Description']),
    order: props['Order']?.type === 'number' ? props['Order'].number ?? 0 : 0,
    status: props['Status']?.type === 'select' ? props['Status'].select?.name ?? '' : '',
    published: props['Published']?.type === 'checkbox' ? props['Published'].checkbox : false,
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
