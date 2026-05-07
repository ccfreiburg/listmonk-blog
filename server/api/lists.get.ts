import { fetchListmonk } from '../utils/listmonk'
import { defineEventHandler } from 'h3'
import { useRuntimeConfig } from 'nitropack/runtime'

interface ListsResponse {
  data: {
    results: Array<{
      id: number
      uuid: string
      name: string
      type: string
      optin: string
      status: string
    }>
  }
}

export default defineEventHandler(async () => {
  const config = useRuntimeConfig()

  const response = await fetchListmonk<ListsResponse>(config, '/api/lists', {
    per_page: 100,
    page: 1,
  })
  // Expose active lists; private lists are valid for API-backed subscriptions.
  return (response.data.results ?? [])
    .filter((l) => l.status === 'active')
    .map((l) => ({ id: l.id, uuid: l.uuid, name: l.name, type: l.type }))
})
