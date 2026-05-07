export interface ListmonkCampaign {
  id: number
  uuid: string
  name: string
  subject: string
  body: string
  content_type: string
  created_at: string
  send_at: string | null
  status: string
  tags: string[]
}

export async function fetchListmonk<T>(
  config: ReturnType<typeof useRuntimeConfig>,
  path: string,
  params?: Record<string, string | number>
): Promise<T> {
  const baseUrl = (config.listmonkUrl as string) || process.env.LISTMONK_URL || ''
  const apiUser = (config.listmonkApiUser as string) || process.env.LISTMONK_API_USER || ''
  const apiToken = (config.listmonkApiToken as string) || process.env.LISTMONK_API_TOKEN || ''

  const url = new URL(path, baseUrl)
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      url.searchParams.set(k, String(v))
    }
  }

  console.info(`[listmonk] → ${url.toString()}`)

  const res = await fetch(url.toString(), {
    headers: {
      Authorization: `token ${apiUser}:${apiToken}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  })

  if (!res.ok) {
    const body = await res.text().catch(() => '')
    console.error(`[listmonk] ✗ ${res.status} ${res.statusText} – ${body}`)
    throw createError({ statusCode: res.status, message: `listmonk: ${res.status} ${res.statusText}` })
  }

  return res.json() as Promise<T>
}
