import {
  defineNuxtModule,
  createResolver,
  extendPages,
  addServerHandler,
  addComponent,
} from '@nuxt/kit'

const resolver = createResolver(import.meta.url)

export interface ModuleOptions {
  databaseUrl: string
  databaseAuthToken: string
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'nuxt-granada',
    configKey: 'granada',
    // Compatibility constraints
    compatibility: {
      // Semver version of supported nuxt versions
      nuxt: '>=4.3.1',
    },
  },
  defaults: {
    databaseUrl: process.env.GRANADA_DATABASE_URL,
    databaseAuthToken: process.env.GRANADA_AUTH_TOKEN,
  },
  // Install required Tailwind module
  moduleDependencies: {
    '@nuxtjs/tailwindcss': {
      overrides: {
        exposeConfig: true,
      },
      defaults: {
        config: {
          content: {
            files: [
              resolver.resolve('./runtime/**/*.{vue,mjs,ts}'),
              resolver.resolve('./runtime/components/**/*.{vue,mjs,ts}'),
              resolver.resolve('./runtime/pages/**/*.{vue,mjs,ts}'),
            ],
          },
        },
      },
    },
  },
  async setup(options, nuxt) {
    nuxt.options.css.push(resolver.resolve('./runtime/assets/css/main.css'))

    // get all modules dependencies
    // const mDependencies = nuxt.options.modules
    // console.log('>>>>>>mDependencies>>>>>>>', mDependencies)

    // 1. Wait until all modules are finished loading
    nuxt.hook('modules:done', () => {
      // 2. Access the resolved modules metadata
      const installedModules = nuxt.options._installedModules
      const modulesMetadata = installedModules.map(({ meta }) => ({
        name: meta.name,
        version: meta.version || 'unknown',
        configKey: meta.configKey,
        description: meta.description || '',
      }))

      // Inject into public runtimeConfig so frontend can access
      nuxt.options.runtimeConfig.public = nuxt.options.runtimeConfig.public || {}
      nuxt.options.runtimeConfig.public.granadaModules = modulesMetadata
    })

    // Inject options into runtimeConfig
    nuxt.options.runtimeConfig.granada = {
      databaseUrl: options.databaseUrl,
      databaseAuthToken: options.databaseAuthToken,
    }

    // Inject Admin Layout
    addComponent({
      name: 'GranadaAdminLayout',
      filePath: resolver.resolve('./runtime/components/GranadaAdminLayout.vue'),
    })

    // Inject Pages
    extendPages((pages) => {
      // Admin dashboard
      pages.push({
        name: 'granada-admin',
        path: '/admin',
        file: resolver.resolve('./runtime/pages/admin/index.vue'),
      })
      // Admin content
      pages.push({
        name: 'granada-admin-content',
        path: '/admin/content',
        file: resolver.resolve('./runtime/pages/admin/content.vue'),
      })
      // Admin editor
      pages.push({
        name: 'granada-admin-editor',
        path: '/admin/editor/:id',
        file: resolver.resolve('./runtime/pages/admin/editor/[id].vue'),
      })
      // Admin modules
      pages.push({
        name: 'granada-admin-modules',
        path: '/admin/modules',
        file: resolver.resolve('./runtime/pages/admin/modules.vue'),
      })
      // Admin settings
      pages.push({
        name: 'granada-admin-settings',
        path: '/admin/settings',
        file: resolver.resolve('./runtime/pages/admin/settings.vue'),
      })

      // Frontend Catch-All
      pages.push({
        name: 'granada-catch-all',
        path: '/:slug(.*)*',
        file: resolver.resolve('./runtime/pages/[...slug].vue'),
      })
    })

    // Inject API Routes (omit extensions for transpilation compatibility)
    addServerHandler({
      route: '/api/granada/content',
      method: 'get',
      handler: resolver.resolve('./runtime/server/api/granada/content/index.get'),
    })

    addServerHandler({
      route: '/api/granada/content',
      method: 'post', handler: resolver.resolve('./runtime/server/api/granada/content/index.post'),
    })

    addServerHandler({
      route: '/api/granada/content/:id',
      method: 'put', handler: resolver.resolve('./runtime/server/api/granada/content/[id].put'),
    })

    addServerHandler({
      route: '/api/granada/content/:id',
      method: 'delete',
      handler: resolver.resolve('./runtime/server/api/granada/content/[id].delete'),
    })

    addServerHandler({
      route: '/api/granada/content/:id',
      method: 'get',
      handler: resolver.resolve('./runtime/server/api/granada/content/[id].get'),
    })

    addServerHandler({
      route: '/api/granada/content/by-slug/:slug',
      method: 'get',
      handler: resolver.resolve('./runtime/server/api/granada/content/by-slug/[slug].get'),
    })

    addServerHandler({
      route: '/api/granada/settings',
      method: 'get',
      handler: resolver.resolve('./runtime/server/api/granada/settings/index.get'),
    })

    addServerHandler({
      route: '/api/granada/settings',
      method: 'put',
      handler: resolver.resolve('./runtime/server/api/granada/settings/index.put'),
    })
  },
})
