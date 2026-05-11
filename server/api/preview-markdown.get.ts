import { readdir, readFile } from 'fs/promises'
import { join, resolve } from 'path'
import { marked } from 'marked'

export default defineEventHandler(async (event) => {
  const filename = getQuery(event).file as string

  if (!filename) {
    // List available markdown files
    const tmpDir = resolve('./tmp')
    try {
      const files = await readdir(tmpDir)
      const markdownFiles = files
        .filter((f) => f.endsWith('.md') && f !== '1.md')
        .sort()
        .reverse()

      return { files: markdownFiles }
    } catch (err) {
      console.error('Error reading tmp directory:', tmpDir, err)
      throw createError({ statusCode: 500, message: 'Failed to read newsletter files' })
    }
  }

  // Security: only allow markdown files from tmp folder
  if (!filename.endsWith('.md') || filename.includes('..')) {
    throw createError({ statusCode: 400, message: 'Invalid filename' })
  }

  try {
    const filePath = resolve('./tmp', filename)
    const content = await readFile(filePath, 'utf-8')
    const html = await marked.parse(content)

    return {
      filename,
      content,
      html,
    }
  } catch (err) {
    console.error('Error reading file:', err)
    throw createError({ statusCode: 404, message: `File not found: ${filename}` })
  }
})
