import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'

export const content = sqliteTable('content', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  slug: text('slug').notNull().unique(),
  body_markdown: text('body_markdown').default(''),
  body_json: text('body_json'),
  content_type: text('content_type').default('page'),
  status: text('status').default('draft'),
  created_at: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  updated_at: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
})

export const settings = sqliteTable('settings', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  active_theme: text('active_theme').default('basic'),
})
