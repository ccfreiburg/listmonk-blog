import { fetchListmonk, type ListmonkCampaign } from './listmonk'
import { listInDepthArticles } from './inDepth'

interface CampaignsResponse {
  data: {
    results: ListmonkCampaign[]
  }
}

export interface FeedItem {
  id: string
  kind: 'newsletter' | 'in-depth'
  title: string
  subject: string
  summary: string
  excerpt: string
  tags: string[]
  createdAt: string
  sentAt: string
  url: string
  slug?: string
  postId?: number
  image?: string
}

export async function listFeedItems(config: ReturnType<typeof useRuntimeConfig>): Promise<FeedItem[]> {
  const [campaignsResponse, inDepthArticles] = await Promise.all([
    fetchListmonk<CampaignsResponse>(config, '/api/campaigns', {
      status: 'finished',
      per_page: 100,
      page: 1,
      order_by: 'created_at',
      order: 'DESC',
    }),
    listInDepthArticles(),
  ])

  const newsletters: FeedItem[] = campaignsResponse.data.results.map((campaign) => ({
    id: `newsletter-${campaign.id}`,
    kind: 'newsletter',
    postId: campaign.id,
    title: campaign.name,
    subject: campaign.subject,
    summary: campaign.subject || campaign.name,
    excerpt: campaign.subject || campaign.name,
    tags: campaign.tags ?? [],
    createdAt: campaign.created_at,
    sentAt: campaign.send_at || campaign.created_at,
    url: `/posts/${campaign.id}`,
  }))

  const inDepth: FeedItem[] = inDepthArticles.map((article) => ({
    id: `in-depth-${article.slug}`,
    kind: 'in-depth',
    slug: article.slug,
    title: article.title,
    subject: article.title,
    summary: article.summary,
    excerpt: article.summary,
    image: article.image,
    tags: article.tags,
    createdAt: article.date,
    sentAt: article.date,
    url: `/in-depth/${article.slug}`,
  }))

  return [...newsletters, ...inDepth].sort((a, b) => {
    const aDate = new Date(a.sentAt || a.createdAt).getTime()
    const bDate = new Date(b.sentAt || b.createdAt).getTime()
    return bDate - aDate
  })
}