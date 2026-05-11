import { readdir, readFile } from 'fs/promises'
import { resolve } from 'path'
import { marked } from 'marked'

export interface InDepthArticleSummary {
  slug: string
  title: string
  summary: string
  image: string
  tags: string[]
  date: string
}

export interface InDepthArticleDetail extends InDepthArticleSummary {
  body: string
}

interface ParsedFrontmatter {
  title: string
  date: string
  summary: string
  image: string
  tags: string[]
  bodyMarkdown: string
}

const CONTENT_DIR = resolve('./content/in-depth')

export async function listInDepthArticles(): Promise<InDepthArticleSummary[]> {
  const files = await readdir(CONTENT_DIR)
  const markdownFiles = files.filter((file) => file.endsWith('.md'))

  const articles = await Promise.all(
    markdownFiles.map(async (file) => {
      const slug = file.replace(/\.md$/i, '')
      const source = await readFile(resolve(CONTENT_DIR, file), 'utf-8')
      const parsed = parseFrontmatter(source)

      return {
        slug,
        title: parsed.title || slugToTitle(slug),
        summary: parsed.summary || extractExcerpt(parsed.bodyMarkdown),
        image: parsed.image,
        tags: parsed.tags,
        date: parsed.date,
      }
    })
  )

  return articles.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export async function getInDepthArticleBySlug(slug: string): Promise<InDepthArticleDetail | null> {
  const safeSlug = slug.replace(/[^a-zA-Z0-9-_]/g, '')
  if (!safeSlug) return null

  try {
    const source = await readFile(resolve(CONTENT_DIR, `${safeSlug}.md`), 'utf-8')
    const parsed = parseFrontmatter(source)
    const body = await marked.parse(parsed.bodyMarkdown)

    return {
      slug: safeSlug,
      title: parsed.title || slugToTitle(safeSlug),
      summary: parsed.summary || extractExcerpt(parsed.bodyMarkdown),
      image: parsed.image,
      tags: parsed.tags,
      date: parsed.date,
      body,
    }
  } catch {
    return null
  }
}

function parseFrontmatter(source: string): ParsedFrontmatter {
  const defaultMeta: ParsedFrontmatter = {
    title: '',
    date: '',
    summary: '',
    image: '',
    tags: [],
    bodyMarkdown: source,
  }

  if (!source.startsWith('---\n')) {
    return defaultMeta
  }

  const endMarkerIndex = source.indexOf('\n---\n', 4)
  if (endMarkerIndex === -1) {
    return defaultMeta
  }

  const frontmatterRaw = source.slice(4, endMarkerIndex)
  const bodyMarkdown = source.slice(endMarkerIndex + 5)
  const meta = { ...defaultMeta, bodyMarkdown }

  for (const line of frontmatterRaw.split('\n')) {
    const match = line.match(/^([a-zA-Z0-9_]+):\s*(.*)$/)
    if (!match) continue

    const key = match[1].trim().toLowerCase()
    const value = stripQuotes(match[2].trim())

    if (key === 'title') meta.title = value
    if (key === 'date') meta.date = value
    if (key === 'summary') meta.summary = value
    if (key === 'image') meta.image = value
    if (key === 'tags') meta.tags = value.split(',').map((tag) => tag.trim()).filter(Boolean)
  }

  if (!meta.date) {
    meta.date = new Date().toISOString()
  }

  return meta
}

function extractExcerpt(markdown: string): string {
  const plain = markdown
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]*`/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/[>#*_~-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

  if (plain.length <= 180) return plain
  return `${plain.slice(0, 177).trim()}...`
}

function slugToTitle(slug: string): string {
  return slug
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

function stripQuotes(value: string): string {
  if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
    return value.slice(1, -1)
  }
  return value
}
