export default defineNuxtConfig({
  modules: ['nuxt-granada', '@nuxtjs/tailwindcss'],
  devtools: { enabled: true },
  compatibilityDate: 'latest',
  granada: {
    databaseUrl: process.env.GRANADA_DATABASE_URL,
    databaseAuthToken: process.env.GRANADA_AUTH_TOKEN,
  },
})
