<template>
  <div class="flex flex-col h-full overflow-hidden">
    <!-- Tabs de navegación -->
    <div class="flex border-b border-slate-100 shrink-0">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        class="flex-1 flex items-center justify-center gap-2 py-3 text-xs font-semibold transition-all"
        :class="activeTab === tab.id
          ? 'text-granada-500 border-b-2 border-granada-500'
          : 'text-slate-400 hover:text-slate-600'"
        @click="activeTab = tab.id"
      >
        <Icon
          :name="tab.icon"
          class="text-base"
        />
        <span class="hidden sm:inline">{{ tab.label }}</span>
      </button>
    </div>

    <!-- Contenido del tab activo -->
    <div class="flex-1 overflow-y-auto">
      <!-- Tab: Componentes -->
      <div
        v-if="activeTab === 'components'"
        class="p-5"
      >
        <div
          v-for="category in blockCategories"
          :key="category.name"
          class="mb-6"
        >
          <p class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
            {{ category.name }}
          </p>
          <div class="grid grid-cols-2 gap-3">
            <GranadaDraggableItem
              v-for="block in category.items"
              :key="block.type"
              :type="block.type"
              :label="block.label"
              :icon="block.icon"
            />
          </div>
        </div>
      </div>

      <!-- Tab: Configuración de Página -->
      <div
        v-else-if="activeTab === 'settings'"
        class="p-5 space-y-5"
      >
        <p class="text-xs font-bold text-slate-400 uppercase tracking-widest">
          Configuración
        </p>
        <!-- Placeholder: en Fase 4 se conecta al estado del editor -->
        <div class="space-y-4">
          <div class="flex flex-col gap-1.5">
            <label class="text-[11px] font-bold text-slate-500">Slug de la URL</label>
            <input
              type="text"
              placeholder="/mi-pagina"
              class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-granada-500/20 focus:border-granada-300 transition-all"
            >
          </div>
          <div class="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
            <span class="text-xs font-semibold text-slate-700">Indexar en Google</span>
            <div class="w-10 h-5 bg-emerald-500 rounded-full relative shadow-inner cursor-pointer">
              <div class="absolute right-1 top-1 w-3 h-3 bg-white rounded-full shadow-sm" />
            </div>
          </div>
          <div class="flex flex-col gap-1.5">
            <label class="text-[11px] font-bold text-slate-500">Título SEO</label>
            <input
              type="text"
              placeholder="Título para los buscadores"
              class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-granada-500/20 focus:border-granada-300 transition-all"
            >
          </div>
          <div class="flex flex-col gap-1.5">
            <label class="text-[11px] font-bold text-slate-500">Descripción SEO</label>
            <textarea
              rows="3"
              placeholder="Descripción breve para los buscadores..."
              class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-granada-500/20 focus:border-granada-300 transition-all resize-none"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Footer del sidebar -->
    <div class="mt-auto p-4 border-t border-slate-100 shrink-0">
      <button class="w-full flex items-center justify-center gap-2 text-xs font-semibold text-slate-400 hover:text-slate-600 transition-colors py-1">
        <Icon
          name="ph:question-bold"
          class="text-base"
        />
        Ayuda y Soporte
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

import GranadaDraggableItem from '#granada/components/editor/DraggableItem.vue'
import type { BlockType } from '../../types/editor'

const activeTab = ref<'components' | 'settings'>('components')

const tabs = [
  { id: 'components', label: 'Componentes', icon: 'ph:squares-four-bold' },
  { id: 'settings', label: 'Configuración', icon: 'ph:gear-six-bold' },
] as const

const blockCategories = [
  {
    name: 'Básicos',
    items: [
      { type: 'heading' as BlockType, label: 'Título', icon: 'ph:text-t-bold' },
      { type: 'text' as BlockType, label: 'Texto', icon: 'ph:text-align-left-bold' },
      { type: 'button' as BlockType, label: 'Botón', icon: 'ph:mouse-left-click-bold' },
      { type: 'image' as BlockType, label: 'Imagen', icon: 'ph:image-bold' },
    ],
  },
  {
    name: 'Layout',
    items: [
      { type: 'section' as BlockType, label: 'Sección', icon: 'ph:square-half-bottom-bold' },
    ],
  },
]
</script>
