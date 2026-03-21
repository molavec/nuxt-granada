<template>
  <NuxtLayout name="granada-editor">
    <!-- ── HEADER ── -->
    <template #header>
      <EditorHeader
        :page-title="form.title"
        :active-viewport="editorStore.viewportMode"
        :is-dirty="editorStore.isDirty"
        :is-saving="isSaving"
        :last-saved="lastSaved"
        @update:viewport="editorStore.setViewportMode($event)"
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
    <GranadaEditorCanvas />

    <!-- ── SIDEBAR DERECHO ── -->
    <template #right-sidebar>
      <RightSidebar ref="rightSidebarRef" />
    </template>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter, useFetch, definePageMeta } from '#imports'

// Imports explícitos de componentes del editor
import EditorHeader from '#granada/components/editor/EditorHeader.vue'
import LeftSidebar from '#granada/components/editor/LeftSidebar.vue'
import RightSidebar from '#granada/components/editor/RightSidebar.vue'
import GranadaEditorCanvas from '#granada/components/editor/EditorCanvas.vue'
import { useEditorStore } from '#granada/stores/useEditorStore'

definePageMeta({ layout: false })

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
  body_json: null as string | null,
})

// ─── Estado del editor (Store de Pinia) ──────────────────────
const editorStore = useEditorStore()
const isSaving = ref(false)
const lastSaved = ref<Date | null>(null)

const leftSidebarRef = ref()
const rightSidebarRef = ref()

const initDefaultBlocks = () => {
  editorStore.setBlocks([
    {
      id: 'init-heading-1',
      type: 'heading',
      _version: 1,
      props: { text: '¡Empieza a construir tu landing!', level: 'h1', align: 'center' },
      children: [],
    },
  ])
  editorStore.markSaved()
}

// ─── Carga del contenido existente ───────────────────────────
if (!isNew.value) {
  const { data } = await useFetch(`/api/granada/content/${id}`)
  if (data.value) {
    form.value = { ...form.value, ...(data.value as typeof form.value) }

    // Hidratar bloques del Visual Editor
    if (form.value.body_json) {
      try {
        const parsedBlocks = JSON.parse(form.value.body_json)
        if (Array.isArray(parsedBlocks) && parsedBlocks.length > 0) {
          editorStore.setBlocks(parsedBlocks)
          editorStore.markSaved()
        }
        else {
          initDefaultBlocks()
        }
      }
      catch (e) {
        console.error('Error parseando body_json', e)
        initDefaultBlocks()
      }
    }
    else {
      initDefaultBlocks()
    }
  }
}
else {
  // Documento completamente nuevo
  initDefaultBlocks()
}

// ─── Acciones ─────────────────────────────────────────────────
function openSettings() {
  // Se implementa en Fase 4
}

function handlePreview() {
  if (form.value.slug) {
    window.open(`/${form.value.slug}`, '_blank')
  }
}

async function handleSave() {
  isSaving.value = true
  try {
    // Sincronizar store a form JSON antes de enviar
    form.value.body_json = JSON.stringify(editorStore.blocks)

    const url = isNew.value ? '/api/granada/content' : `/api/granada/content/${id}`
    const method = isNew.value ? 'POST' : 'PUT'

    const response = await $fetch(url, { method, body: form.value })
    if (isNew.value && response && response.id) {
      router.push(`/admin/editor/${response.id}`)
    }

    editorStore.markSaved() // Reset de isDirty
    lastSaved.value = new Date()
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
