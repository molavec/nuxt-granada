<template>
  <header class="h-16 border-b border-slate-200 bg-white flex items-center justify-between px-4 md:px-6 z-50 shrink-0 gap-2">
    <!-- ── ZONA IZQUIERDA: Contexto de la página ── -->
    <div class="flex items-center gap-2 md:gap-4 min-w-0 w-1/3">
      <!-- Botón volver al listado de contenidos -->
      <NuxtLink
        to="/admin/content"
        class="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-50 border border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-all shrink-0"
        title="Volver al listado"
      >
        <Icon
          name="ph:caret-left-bold"
          class="text-sm"
        />
      </NuxtLink>

      <div class="h-6 w-px bg-slate-200 mx-1 hidden md:block shrink-0" />

      <!-- Nombre de la página + Settings -->
      <div class="flex items-center gap-2 min-w-0">
        <div class="flex flex-col min-w-0 hidden md:flex">
          <span class="text-[10px] uppercase tracking-wider font-bold text-slate-400 leading-none">Editando</span>
          <div class="flex items-center gap-1 cursor-pointer group mt-0.5">
            <span class="font-semibold text-sm text-slate-700 group-hover:text-granada-500 transition-colors truncate max-w-[140px]">
              {{ pageTitle || 'Sin título' }}
            </span>
            <Icon
              name="ph:caret-down-bold"
              class="text-[10px] text-slate-400 shrink-0"
            />
          </div>
        </div>

        <!-- Botón toggle sidebar izquierdo — solo móvil -->
        <button
          class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-50 transition-all"
          :class="showLeftSidebar
            ? 'bg-granada-50 text-granada-500 border border-granada-100'
            : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'"
          title="Componentes"
          @click="toggleLeftSidebar"
        >
          <Icon
            name="ph:squares-four-bold"
            class="text-lg"
          />
        </button>

        <!-- TODO: molavec. No sé si hará realmente falta el botón Settings de la página (abre config en left sidebar). -->
        <!-- <button
          class="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-all"
          title="Configuración de la página"
          @click="$emit('open-settings')"
        >
          <Icon
            name="ph:gear-six-bold"
            class="text-lg"
          />
        </button> -->
      </div>
    </div>

    <!-- ── ZONA CENTRAL: Selector de viewport ── -->
    <div class="flex items-center bg-slate-100 p-1 rounded-2xl shrink-0">
      <button
        v-for="vp in viewports"
        :key="vp.value"
        class="w-9 h-7 flex items-center justify-center rounded-xl transition-all"
        :class="activeViewport === vp.value
          ? 'bg-white shadow-sm text-granada-500'
          : 'text-slate-400 hover:text-slate-600'"
        :title="vp.label"
        @click="$emit('update:viewport', vp.value)"
      >
        <Icon
          :name="vp.icon"
          class="text-lg"
        />
      </button>
    </div>

    <!-- ── ZONA DERECHA: Acciones del editor ── -->
    <div class="flex items-center justify-end gap-1 md:gap-2 w-1/3">
      <!-- Indicador de estado de guardado -->
      <span class="text-[11px] text-slate-400 italic hidden lg:block mr-1 shrink-0">
        {{ saveStatusLabel }}
      </span>

      <!-- Toggle Layers Sidebar — siempre visible -->
      <button
        class="w-9 h-9 flex items-center justify-center rounded-xl transition-all shrink-0"
        :class="showRightSidebar
          ? 'bg-granada-50 text-granada-500 border border-granada-100'
          : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'"
        title="Capas y propiedades"
        @click="toggleRightSidebar"
      >
        <Icon
          name="ph:stack-bold"
          class="text-lg"
        />
      </button>

      <div class="h-6 w-px bg-slate-200 hidden md:block shrink-0" />

      <!-- Vista Previa -->
      <button
        class="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 rounded-xl transition-all border border-transparent hover:border-slate-200 hidden md:block shrink-0"
        @click="$emit('preview')"
      >
        Vista Previa
      </button>

      <!-- Guardar -->
      <button
        :disabled="!isDirty || isSaving"
        class="px-3 md:px-5 py-1.5 md:py-2 text-xs md:text-sm font-bold bg-white border-2 border-slate-900 text-slate-900 rounded-xl hover:bg-slate-900 hover:text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
        @click="$emit('save')"
      >
        <span class="hidden md:inline">{{ isSaving ? 'Guardando...' : 'Guardar' }}</span>
        <Icon
          name="ph:floppy-disk-bold"
          class="text-base md:hidden"
        />
      </button>

      <!-- Publicar -->
      <button
        class="px-3 md:px-5 py-1.5 md:py-2 text-xs md:text-sm font-bold bg-granada-500 text-white rounded-xl shadow-md shadow-granada-200 hover:bg-granada-600 transition-all shrink-0"
        @click="$emit('publish')"
      >
        <span class="hidden md:inline">Publicar</span>
        <Icon
          name="ph:rocket-launch-bold"
          class="text-base md:hidden"
        />
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { inject, computed, ref, onMounted, onUnmounted } from 'vue'
import type { Ref } from 'vue'

// ─── Props ──────────────────────────────────────────────────────
interface Props {
  pageTitle?: string
  activeViewport?: 'desktop' | 'tablet' | 'mobile'
  isDirty?: boolean
  isSaving?: boolean
  lastSaved?: Date | null
}

const props = withDefaults(defineProps<Props>(), {
  pageTitle: '',
  activeViewport: 'desktop',
  isDirty: false,
  isSaving: false,
  lastSaved: null,
})

// ─── Emits ──────────────────────────────────────────────────────
defineEmits<{
  'update:viewport': [value: 'desktop' | 'tablet' | 'mobile']
  'save': []
  'publish': []
  'preview': []
  'open-settings': []
}>()

// ─── Inject del layout padre ────────────────────────────────────
const editorLayout = inject<{
  showLeftSidebar: Ref<boolean>
  showRightSidebar: Ref<boolean>
  toggleLeftSidebar: () => void
  toggleRightSidebar: () => void
}>('editorLayout')

const showLeftSidebar = editorLayout?.showLeftSidebar
const showRightSidebar = editorLayout?.showRightSidebar
const toggleLeftSidebar = editorLayout?.toggleLeftSidebar ?? (() => {})
const toggleRightSidebar = editorLayout?.toggleRightSidebar ?? (() => {})

// ─── Breakpoint helper para mostrar/ocultar en desktop ─────────
const isDesktop = ref(typeof window !== 'undefined' ? window.innerWidth >= 768 : true)
function onResize() {
  isDesktop.value = window.innerWidth >= 768
}
onMounted(() => window.addEventListener('resize', onResize))
onUnmounted(() => window.removeEventListener('resize', onResize))

// ─── Selectores de viewport ─────────────────────────────────────
const viewports = [
  { value: 'desktop', label: 'Desktop', icon: 'ph:desktop-bold' },
  { value: 'tablet', label: 'Tablet', icon: 'ph:device-tablet-bold' },
  { value: 'mobile', label: 'Móvil', icon: 'ph:device-mobile-bold' },
] as const

// ─── Indicador de estado de guardado ────────────────────────────
const saveStatusLabel = computed(() => {
  if (props.isSaving) return 'Guardando...'
  if (!props.isDirty && props.lastSaved) {
    const mins = Math.round((Date.now() - props.lastSaved.getTime()) / 60000)
    return mins < 1 ? 'Guardado hace un momento' : `Guardado hace ${mins}m`
  }
  if (props.isDirty) return '● Cambios sin guardar'
  return ''
})
</script>
