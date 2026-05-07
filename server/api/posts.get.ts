import { fetchListmonk, type ListmonkCampaign } from '../utils/listmonk'

interface CampaignsResponse {
  data: {
    results: ListmonkCampaign[]
    total: number
    per_page: number
    page: number
  }
}

export default defineEventHandler(async () => {
  const config = useRuntimeConfig()

  const response = await fetchListmonk<CampaignsResponse>(config, '/api/campaigns', {
    status: 'finished',
    per_page: 100,
    page: 1,
    order_by: 'created_at',
    order: 'DESC',
  })

  return response.data.results.map((c) => ({
    id: c.id,
    uuid: c.uuid,
    title: c.name,
    subject: c.subject,
    tags: c.tags ?? [],
    createdAt: c.created_at,
    sentAt: c.send_at,
  }))
})
