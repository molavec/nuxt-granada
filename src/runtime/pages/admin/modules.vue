<template>
  <NuxtLayout>
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-slate-900 tracking-tight">
            Installed Modules
          </h1>
          <p class="text-slate-500 mt-1">
            Manage and view Nuxt modules loaded in your application.
          </p>
        </div>
        <div class="flex items-center gap-3">
          <div class="px-3 py-1.5 bg-granada-50 text-granada-700 rounded-lg text-sm font-medium flex items-center gap-2">
            <div class="w-4 h-4 i-lucide-box" />
            {{ modules.length }} Modules
          </div>
        </div>
      </div>

      <!-- Modules Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <template v-if="modules.length > 0">
          <div
            v-for="mod in modules"
            :key="mod.name"
            class="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col hover:border-granada-300 hover:shadow-md hover:-translate-y-1 transition-all duration-300 group"
          >
            <div class="flex items-start justify-between mb-4">
              <div class="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-granada-50 group-hover:text-granada-600 group-hover:border-granada-100 transition-colors">
                <div class="w-6 h-6 i-lucide-package" />
              </div>
              <span class="px-2.5 py-1 text-xs font-semibold rounded-full bg-slate-100 text-slate-600 group-hover:bg-granada-100 group-hover:text-granada-700 transition-colors">
                v{{ mod.version }}
              </span>
            </div>

            <h3
              class="text-lg font-bold text-slate-900 mb-2 truncate"
              :title="mod.name"
            >
              {{ mod.name }}
            </h3>

            <p
              class="text-sm text-slate-500 mb-4 line-clamp-2 flex-grow"
              :title="mod.description || 'No description provided.'"
            >
              {{ mod.description || 'No description provided.' }}
            </p>

            <div class="mt-auto pt-4 border-t border-slate-100">
              <div class="flex items-center text-xs text-slate-500 font-medium">
                <div class="w-4 h-4 i-lucide-key mr-2 opacity-70" />
                <span
                  class="truncate"
                  :title="mod.configKey || 'No config key'"
                >
                  {{ mod.configKey || 'No config key' }}
                </span>
              </div>
            </div>
          </div>
        </template>

        <!-- Empty State -->
        <div
          v-else
          class="col-span-full py-16 flex flex-col items-center justify-center text-center bg-slate-50 rounded-2xl border border-slate-200 border-dashed"
        >
          <div class="w-16 h-16 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 mb-4 shadow-sm">
            <div class="w-8 h-8 i-lucide-box" />
          </div>
          <h3 class="text-lg font-bold text-slate-900 mb-1">
            No modules found
          </h3>
          <p class="text-slate-500 max-w-sm">
            It looks like there are no installed modules available in the runtime configuration.
          </p>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { useRuntimeConfig, useHead, definePageMeta } from '#imports'

definePageMeta({ layout: 'granada-admin' })

useHead({
  title: 'Modules | Granada CMS',
})

interface GranadaModule {
  name: string
  version: string
  configKey: string
  description: string
}

const config = useRuntimeConfig()
const modules: GranadaModule[] = (config.public.granadaModules as GranadaModule[]) || []
</script>
