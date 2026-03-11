import { defineEventHandler } from 'h3'
import { useDb } from '../../../utils/db'
import { content } from '../../../db/schema'
import { desc } from 'drizzle-orm'

export default defineEventHandler(async (_event) => {
  const db = useDb()
  return await db.select().from(content).orderBy(desc(content.id))
})
