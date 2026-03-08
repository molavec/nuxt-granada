import { defineEventHandler, getRouterParam } from 'h3';
import { useDb } from '../../../../utils/db';
import { content } from '../../../../db/schema';
import { eq } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug');
  const db = useDb();

  const result = await db.select().from(content).where(eq(content.slug, String(slug)));
  return result[0] || null;
});
