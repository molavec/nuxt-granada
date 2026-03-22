import { defineEventHandler, readBody, getRouterParam } from 'h3'
import { useDb } from '../../../utils/db'
import { content } from '../../../db/schema'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)
  const db = useDb()

  const result = await db.update(content).set({
    title: body.title,
    slug: body.slug,
    body_markdown: body.body_markdown,
    body_json: body.body_json,
    content_type: body.content_type,
    status: body.status,
  }).where(eq(content.id, Number(id))).returning()

  return result[0]
})
