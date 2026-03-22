import { defineEventHandler, readBody } from 'h3'
import { useDb } from '../../../utils/db'
import { settings } from '../../../db/schema'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const db = useDb()

  const current = await db.select().from(settings).limit(1)

  if (current.length === 0) {
    const result = await db.insert(settings).values({ active_theme: body.active_theme }).returning()
    return result[0]
  }
  else {
    const result = await db.update(settings).set({ active_theme: body.active_theme })
      .where(eq(settings.id, current[0].id)).returning()
    return result[0]
  }
})
