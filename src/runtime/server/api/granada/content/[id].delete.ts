import { defineEventHandler, getRouterParam } from 'h3'
import { useDb } from '../../../utils/db'
import { content } from '../../../db/schema'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const db = useDb()

  const result = await db.delete(content).where(eq(content.id, Number(id))).returning()
  return result[0]
})
