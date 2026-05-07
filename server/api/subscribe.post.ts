import { createError, defineEventHandler, readBody } from 'h3'

interface ListsResponse {
  data: {
    results: Array<{ id: number }>
  }
}

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const email: string = (body.email ?? '').trim().toLowerCase()
  const name: string = (body.name ?? '').trim()
  let listIds: number[] = Array.isArray(body.list_ids)
    ? body.list_ids.map((v: unknown) => Number(v)).filter((v: number) => Number.isInteger(v) && v > 0)
    : []

  // Basic validation
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw createError({ statusCode: 400, message: 'Invalid email address' })
  }
  const runtime = (globalThis as any).process?.env ?? {}
  const baseUrl = (runtime.LISTMONK_URL as string) || ''
  const apiUser = (runtime.LISTMONK_API_USER as string) || ''
  const apiToken = (runtime.LISTMONK_API_TOKEN as string) || ''

  if (listIds.length === 0) {
    const res = await fetch(`${baseUrl}/api/lists?per_page=1&page=1`, {
      headers: {
        Authorization: `token ${apiUser}:${apiToken}`,
      },
    })
    if (res.ok) {
      const lists = (await res.json()) as ListsResponse
      const firstId = lists.data?.results?.[0]?.id
      if (firstId) {
        listIds = [firstId]
      }
    }
  }
  if (listIds.length === 0) {
    throw createError({ statusCode: 400, message: 'No list available for subscription' })
  }
  for (const id of listIds) {
    if (!Number.isInteger(id) || id <= 0) {
      throw createError({ statusCode: 400, message: 'Invalid list ID' })
    }
  }

  const res = await fetch(`${baseUrl}/api/subscribers`, {
    method: 'POST',
    body: JSON.stringify({
      email,
      name,
      status: 'enabled',
      lists: listIds,
      preconfirm_subscriptions: true,
    }),
    headers: {
      Authorization: `token ${apiUser}:${apiToken}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  })

  if (!res.ok) {
    const errBody = await res.text().catch(() => '')
    if (res.status === 403 && /Permission denied: lists/i.test(errBody)) {
      throw createError({ statusCode: 403, message: 'API user needs list write access: grant lists:manage_all or attach a list role with manage permission.' })
    }
    throw createError({ statusCode: 502, message: `Subscription failed: ${errBody || res.statusText}` })
  }

  return { success: true }
})
