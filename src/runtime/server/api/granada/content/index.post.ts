import { defineEventHandler, readBody } from 'h3'
import { useDb } from '../../../utils/db'
import { content } from '../../../db/schema'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const db = useDb()

  const result = await db.insert(content).values({
    title: body.title,
    slug: body.slug,
    body_markdown: body.body_markdown ?? '',
    body_json: body.body_json ?? null,
    content_type: body.content_type ?? 'page',
    status: body.status ?? 'draft',
  }).returning()

  return result[0]
})
