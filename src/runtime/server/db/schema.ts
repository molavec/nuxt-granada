import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const settings = sqliteTable('settings', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  active_theme: text('active_theme').default('basic').notNull(),
});

export const content = sqliteTable('content', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  slug: text('slug').notNull().unique(),
  body_markdown: text('body_markdown').notNull(),
  content_type: text('content_type', { enum: ['page', 'blog'] }).notNull(),
  status: text('status', { enum: ['published', 'draft'] }).notNull().default('draft'),
});
