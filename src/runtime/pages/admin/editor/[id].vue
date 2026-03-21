<template>
  <NuxtLayout name="granada-editor">
    <!-- ── HEADER ── -->
    <template #header>
      <EditorHeader
        :page-title="form.title"
        :active-viewport="viewport"
        :is-dirty="isDirty"
        :is-saving="isSaving"
        :last-saved="lastSaved"
        @update:viewport="viewport = $event"
        @save="handleSave"
        @publish="handlePublish"
        @preview="handlePreview"
        @open-settings="openSettings"
      />
    </template>

    <!-- ── SIDEBAR IZQUIERDO ── -->
    <template #left-sidebar>
      <LeftSidebar ref="leftSidebarRef" />
    </template>

    <!-- ── CANVAS CENTRAL ── -->
    <div class="p-8 md:p-12 flex justify-center min-h-full">
      <div
        class="bg-white rounded-3xl border border-slate-200 overflow-hidden relative transition-all duration-300 shadow-[0_10px_50px_-12px_rgba(0,0,0,0.08)]"
        :class="canvasWidthClass"
        style="min-height: 800px;"
      >
        <!-- Placeholder del canvas — se sustituye en Fase 3 -->
        <div class="p-10 md:p-16">
          <!-- Indicador de zona editable vacía -->
          <div
            v-if="!form.title"
            class="flex flex-col items-center justify-center py-24 gap-4 text-center"
          >
            <div class="w-16 h-16 rounded-3xl bg-slate-100 flex items-center justify-center">
              <Icon
                name="ph:paint-brush-bold"
                class="text-3xl text-slate-300"
              />
            </div>
            <h3 class="font-bold text-slate-400">
              Canvas vacío
            </h3>
            <p class="text-sm text-slate-400 max-w-xs leading-relaxed">
              Arrastra componentes desde el panel izquierdo para empezar a construir tu página.
            </p>
          </div>

          <!-- Preview básico del contenido actual (mientras no existe el editor visual) -->
          <div
            v-else
            class="space-y-6"
          >
            <div class="inline-block px-4 py-1 rounded-full bg-granada-50 text-granada-500 text-[10px] font-bold uppercase tracking-widest">
              Granada Editor
            </div>
            <h1 class="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight">
              {{ form.title }}
            </h1>
            <p class="text-lg text-slate-400 italic">
              Los bloques de contenido aparecerán aquí en la Fase 3.
            </p>
            <div class="mt-8 p-6 border-2 border-dashed border-slate-200 rounded-2xl text-center text-slate-400 text-sm">
              <Icon
                name="ph:plus-circle-bold"
                class="text-2xl mb-2"
              />
              <p>Zona de bloques arrastrables</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ── SIDEBAR DERECHO ── -->
    <template #right-sidebar>
      <RightSidebar ref="rightSidebarRef" />
    </template>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter, useFetch, definePageMeta } from '#imports'

// Imports explícitos de componentes del editor (evita ambigüedad del prefijo de addComponentsDir)
import EditorHeader from '#granada/components/editor/EditorHeader.vue'
import LeftSidebar from '#granada/components/editor/LeftSidebar.vue'
import RightSidebar from '#granada/components/editor/RightSidebar.vue'

definePageMeta({ layout: false }) // El layout lo gestiona NuxtLayout con name explícito

// ─── Tipos ────────────────────────────────────────────────────
type Viewport = 'desktop' | 'tablet' | 'mobile'

// ─── Route / Router ───────────────────────────────────────────
const route = useRoute()
const router = useRouter()
const id = route.params.id as string
const isNew = computed(() => id === 'new')

// ─── Estado del formulario ───────────────────────────────────
const form = ref({
  title: '',
  slug: '',
  content_type: 'page',
  status: 'draft',
  body_markdown: '',
})

// ─── Estado del editor ───────────────────────────────────────
const viewport = ref<Viewport>('desktop')
const isDirty = ref(false)
const isSaving = ref(false)
const lastSaved = ref<Date | null>(null)

// Referencias a los sidebars (para acceder a sus métodos expuestos)
const leftSidebarRef = ref()
const rightSidebarRef = ref()

// ─── Ancho del canvas según viewport ─────────────────────────
const canvasWidthClass = computed(() => ({
  'w-full': viewport.value === 'desktop',
  'w-full max-w-3xl': viewport.value === 'tablet', // 768px (iPad portrait)
  'w-full max-w-sm': viewport.value === 'mobile', // 384px (iPhone)
}))

// ─── Carga del contenido existente ───────────────────────────
if (!isNew.value) {
  const { data } = await useFetch(`/api/granada/content/${id}`)
  if (data.value) {
    form.value = { ...data.value as typeof form.value }
  }
}

// ─── Acciones ─────────────────────────────────────────────────
function openSettings() {
  // Activar tab de configuración en el sidebar izquierdo
  // Se implementa mejor en Fase 4 cuando LeftSidebar tenga el método expuesto
}

function handlePreview() {
  if (form.value.slug) {
    window.open(`/${form.value.slug}`, '_blank')
  }
}

async function handleSave() {
  isSaving.value = true
  try {
    const url = isNew.value ? '/api/granada/content' : `/api/granada/content/${id}`
    const method = isNew.value ? 'POST' : 'PUT'
    await $fetch(url, { method, body: form.value })
    isDirty.value = false
    lastSaved.value = new Date()
    if (isNew.value) router.push('/admin/content')
  }
  catch (err) {
    console.error('Error al guardar:', err)
  }
  finally {
    isSaving.value = false
  }
}

async function handlePublish() {
  form.value.status = 'published'
  await handleSave()
}
</script>
