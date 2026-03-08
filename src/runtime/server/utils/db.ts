import { drizzle } from 'drizzle-orm/libsql'
import { createClient } from '@libsql/client'
import * as schema from '../db/schema'

let dbInstance: ReturnType<typeof drizzle>

export function useDb() {
  if (dbInstance) return dbInstance

  // @ts-expect-error - useRuntimeConfig is a global in Nitro
  const config = useRuntimeConfig()
  const url = config.granada.databaseUrl
  const authToken = config.granada.databaseAuthToken

  if (!url) {
    throw new Error('granada.databaseUrl is missing in module options or .env')
  }

  const client = createClient({
    url,
    authToken,
  })

  dbInstance = drizzle(client, { schema })
  return dbInstance
}
