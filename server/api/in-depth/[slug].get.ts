import { getInDepthArticleBySlug } from '../../utils/inDepth'

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')

  if (!slug) {
    throw createError({ statusCode: 400, message: 'Invalid article slug' })
  }

  const article = await getInDepthArticleBySlug(slug)

  if (!article) {
    throw createError({ statusCode: 404, message: 'Article not found' })
  }

  return {
    id: `in-depth-${article.slug}`,
    kind: 'in-depth',
    slug: article.slug,
    title: article.title,
    subject: article.title,
    summary: article.summary,
    body: article.body,
    image: article.image,
    tags: article.tags,
    createdAt: article.date,
    sentAt: article.date,
  }
})
