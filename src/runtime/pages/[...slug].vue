<template>
  <div>
    <NuxtLayout
      v-if="content"
      :name="computedLayoutName"
    >
      <!-- Modo Visual Editor -->
      <template v-if="hasBlocks">
        <GranadaRenderer :blocks="parsedBlocks" />
      </template>

      <!-- Modo Legacy Markdown -->
      <template v-else>
        <div class="max-w-4xl mx-auto px-6 py-16">
          <h1 class="text-4xl md:text-5xl font-extrabold tracking-tight mb-8 text-slate-900">
            {{ content.title }}
          </h1>
          <!-- eslint-disable-next-line vue/no-v-html -->
          <article
            class="prose prose-slate prose-lg max-w-none"
            v-html="htmlContent"
          />
        </div>
      </template>
    </NuxtLayout>

    <!-- Error 404 -->
    <div
      v-else
      class="flex items-center justify-center min-h-screen bg-slate-50"
    >
      <div class="text-center">
        <h1 class="text-6xl font-bold text-slate-200">
          404
        </h1>
        <p class="text-slate-500 mt-4 text-xl tracking-tight">
          Content not found.
        </p>
        <NuxtLink
          to="/"
          class="text-granada-600 mt-6 inline-block font-semibold hover:underline"
        >Go Home</NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useFetch } from '#imports'
import { marked } from 'marked'
import GranadaRenderer from '#granada/components/renderer/GranadaRenderer.vue'
import type { Block } from '../types/editor'

const route = useRoute()
const slugArray = route.params.slug || []
const slug = Array.isArray(slugArray) ? slugArray.join('/') : slugArray

// Fetch content
const { data: content } = await useFetch<Record<string, unknown>>(`/api/granada/content/by-slug/${slug || 'index'}`)
const { data: settings } = await useFetch<Record<string, unknown>>('/api/granada/settings')

// ─── Lógica Modo Editor Visual (Prioridad) ──────────────────
const parsedBlocks = computed<Block[]>(() => {
  if (!content.value?.body_json) return []
  try {
    const blocks = JSON.parse(content.value.body_json)
    return Array.isArray(blocks) ? blocks : []
  }
  catch (e) {
    console.warn('Error parsing body_json in frontend', e)
    return []
  }
})

const hasBlocks = computed(() => parsedBlocks.value.length > 0)

// ─── Lógica Modo Legacy Markdown ────────────────────────────
const htmlContent = computed(() => {
  if (!content.value?.body_markdown) return ''
  return marked.parse(content.value.body_markdown)
})

const computedLayoutName = computed(() => {
  if (!content.value) return 'default'
  const theme = settings.value?.active_theme || 'basic'
  const type = content.value.content_type || 'page'
  return `${theme}-${type}`
})
</script>
