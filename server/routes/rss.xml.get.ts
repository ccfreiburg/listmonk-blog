import { listFeedItems } from '../utils/feed'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const feedItems = await listFeedItems(config)
  const requestUrl = getRequestURL(event)
  const siteUrl = ((config.public.siteUrl as string) || requestUrl.origin).replace(/\/$/, '')
  const feedUrl = `${siteUrl}/rss.xml`
  const siteTitle = String(config.public.siteName || 'Blog')
  const siteDescription = String(config.public.siteDescription || 'News and Updates')
  const lastBuildDate = feedItems[0]?.sentAt || feedItems[0]?.createdAt || new Date().toISOString()

  const itemsXml = feedItems
    .map((item) => {
      const itemUrl = `${siteUrl}${item.url}`
      const pubDate = new Date(item.sentAt || item.createdAt).toUTCString()
      const description = item.summary || item.excerpt || item.subject || item.title
      const categories = item.tags.map((tag) => `    <category>${escapeXml(tag)}</category>`).join('\n')

      return [
        '  <item>',
        `    <title>${escapeXml(item.subject || item.title)}</title>`,
        `    <link>${escapeXml(itemUrl)}</link>`,
        `    <guid isPermaLink="true">${escapeXml(itemUrl)}</guid>`,
        `    <pubDate>${escapeXml(pubDate)}</pubDate>`,
        `    <description>${escapeXml(description)}</description>`,
        categories,
        '  </item>',
      ].filter(Boolean).join('\n')
    })
    .join('\n')

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0">',
    '  <channel>',
    `    <title>${escapeXml(siteTitle)}</title>`,
    `    <link>${escapeXml(siteUrl)}</link>`,
    `    <description>${escapeXml(siteDescription)}</description>`,
    `    <language>en-us</language>`,
    `    <lastBuildDate>${escapeXml(new Date(lastBuildDate).toUTCString())}</lastBuildDate>`,
    `    <atom:link href="${escapeXml(feedUrl)}" rel="self" type="application/rss+xml" xmlns:atom="http://www.w3.org/2005/Atom" />`,
    itemsXml,
    '  </channel>',
    '</rss>',
  ].join('\n')

  setHeader(event, 'content-type', 'application/rss+xml; charset=utf-8')
  return xml
})

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}