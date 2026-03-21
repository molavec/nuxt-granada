export default {
  schema: './src/runtime/server/db/schema.ts',
  out: './drizzle',
  dialect: process.env.GRANADA_AUTH_TOKEN ? 'turso' : 'sqlite',
  dbCredentials: {
    url: process.env.GRANADA_DATABASE_URL!,
    ...(process.env.GRANADA_AUTH_TOKEN ? { authToken: process.env.GRANADA_AUTH_TOKEN } : {}),
  },
}
