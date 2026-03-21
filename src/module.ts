import {
  defineNuxtModule,
  createResolver,
  extendPages,
  addServerHandler,
  addLayout,
  addComponentsDir,
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
  // Install required modules
  moduleDependencies: {
    '@nuxt/icon': {},
    '@nuxtjs/tailwindcss': {
      overrides: {
        exposeConfig: true,
      },
      defaults: {
        config: {
          theme: {
            extend: {
              colors: {
                granada: {
                  50: 'oklch(0.97 0.02 16.3)',
                  100: 'oklch(0.94 0.04 16.3)',
                  200: 'oklch(0.88 0.08 16.3)',
                  300: 'oklch(0.81 0.13 16.3)',
                  400: 'oklch(0.73 0.18 16.3)',
                  500: 'oklch(0.645 0.211 16.3)', /* Tu color base */
                  600: 'oklch(0.56 0.19 16.3)',
                  700: 'oklch(0.47 0.15 16.3)',
                  800: 'oklch(0.38 0.12 16.3)',
                  900: 'oklch(0.29 0.08 16.3)',
                  950: 'oklch(0.20 0.05 16.3)',
                },
                cream: {
                  50: 'oklch(0.99 0.01 90)',
                  100: 'oklch(0.97 0.03 90)',
                  200: 'oklch(0.92 0.06 90)',
                  300: 'oklch(0.86 0.09 90)',
                  400: 'oklch(0.78 0.12 90)',
                  500: 'oklch(0.72 0.14 90)',
                  600: 'oklch(0.62 0.12 90)',
                  700: 'oklch(0.52 0.10 90)',
                  800: 'oklch(0.42 0.08 90)',
                  900: 'oklch(0.32 0.06 90)',
                  950: 'oklch(0.25 0.04 90)',
                },
              },
            },
          },
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
    // nuxt.options.css.push(resolver.resolve('./runtime/assets/css/main.css'))
    nuxt.options.alias['#granada'] = resolver.resolve('./runtime')

    // In dev mode, watch runtime dir so Nuxt auto-restarts on changes
    // (avoids having to delete .nuxt manually)
    if (nuxt.options.dev) {
      nuxt.options.watch.push(resolver.resolve('./runtime'))
    }

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

    // Inject Admin Layout as a Nuxt layout
    addLayout(
      { src: resolver.resolve('./runtime/layouts/GranadaAdmin.vue') },
      'granada-admin',
    )
    addLayout(
      { src: resolver.resolve('./runtime/layouts/GranadaEditor.vue') },
      'granada-editor',
    )

    // Inject editor components directory (EditorHeader, LeftSidebar, RightSidebar, etc.)
    await addComponentsDir({
      path: resolver.resolve('./runtime/components'),
      prefix: 'Granada',
      pathPrefix: false, // GranadaEditorHeader, GranadaLeftSidebar, GranadaRightSidebar
      global: false,
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
