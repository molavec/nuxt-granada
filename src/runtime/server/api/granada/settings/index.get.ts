import { defineEventHandler } from 'h3'
import { useDb } from '../../../utils/db'
import { settings } from '../../../db/schema'

export default defineEventHandler(async (_event) => {
  const db = useDb()
  let result = await db.select().from(settings).limit(1)

  // Initialize default if not exists
  if (result.length === 0) {
    result = await db.insert(settings).values({ active_theme: 'basic' }).returning()
  }
  return result[0]
})
