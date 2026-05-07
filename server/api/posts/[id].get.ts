import { fetchListmonk, type ListmonkCampaign } from '../../utils/listmonk'
import { marked } from 'marked'

interface CampaignResponse {
  data: ListmonkCampaign
}

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  // Only allow numeric IDs to prevent injection
  if (!id || !/^\d+$/.test(id)) {
    throw createError({ statusCode: 400, message: 'Invalid post ID' })
  }

  const config = useRuntimeConfig()

  const response = await fetchListmonk<CampaignResponse>(config, `/api/campaigns/${id}`)
  const c = response.data

  if (c.status !== 'finished') {
    throw createError({ statusCode: 404, message: 'Post not found' })
  }

  const cleaned = stripTemplateVars(c.body)
  const html = c.content_type === 'markdown'
    ? await marked.parse(cleaned)
    : cleaned

  return {
    id: c.id,
    uuid: c.uuid,
    title: c.name,
    subject: c.subject,
    body: html,
    contentType: c.content_type,
    tags: c.tags ?? [],
    createdAt: c.created_at,
    sentAt: c.send_at,
  }
})

function stripTemplateVars(text: string): string {
  // Remove listmonk/Go template expressions: {{ ... }}
  return text.replace(/\{\{[^}]*\}\}/g, '')
}
