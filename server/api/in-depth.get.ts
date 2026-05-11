import { listInDepthArticles } from '../utils/inDepth'

export default defineEventHandler(async () => {
  const articles = await listInDepthArticles()

  return articles.map((article) => ({
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
})
