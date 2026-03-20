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

    <!-- Contenido -->
    <div class="flex-1 overflow-y-auto">
      <!-- Tab: Capas -->
      <div
        v-if="activeTab === 'layers'"
        class="p-4"
      >
        <div class="flex items-center justify-between mb-4">
          <p class="text-xs font-bold text-slate-400 uppercase tracking-widest">
            Capas
          </p>
          <Icon
            name="ph:stack-bold"
            class="text-slate-400 text-base"
          />
        </div>

        <!-- Placeholder del árbol de capas — se implementa en Fase 6 -->
        <div class="space-y-1">
          <!-- Capa simulada: Hero Section (expandida) -->
          <div class="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-xl cursor-pointer group">
            <Icon
              name="ph:caret-down-bold"
              class="text-[10px] text-slate-300"
            />
            <div class="w-7 h-7 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-500 shrink-0">
              <Icon
                name="ph:browser-bold"
                class="text-sm"
              />
            </div>
            <span class="text-xs font-medium text-slate-600 flex-1">Hero Section</span>
            <Icon
              name="ph:eye-bold"
              class="text-[12px] text-slate-300 group-hover:text-slate-400"
            />
          </div>

          <div class="ml-8 space-y-1">
            <div class="flex items-center gap-3 p-2 bg-granada-50 border border-granada-100 rounded-xl cursor-pointer shadow-sm">
              <div class="w-7 h-7 bg-white rounded-lg flex items-center justify-center text-granada-500 shadow-sm shrink-0">
                <Icon
                  name="ph:text-h-bold"
                  class="text-sm"
                />
              </div>
              <span class="text-xs font-bold text-granada-600 flex-1">Título Principal</span>
              <Icon
                name="ph:pencil-simple-bold"
                class="text-[12px] text-granada-300"
              />
            </div>
            <div class="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-xl cursor-pointer group">
              <div class="w-7 h-7 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400 shrink-0">
                <Icon
                  name="ph:text-align-left-bold"
                  class="text-sm"
                />
              </div>
              <span class="text-xs font-medium text-slate-500 flex-1">Descripción</span>
              <Icon
                name="ph:eye-bold"
                class="text-[12px] text-slate-300 group-hover:text-slate-400"
              />
            </div>
          </div>

          <!-- Capa simulada: Footer (colapsada) -->
          <div class="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-xl cursor-pointer group mt-2">
            <Icon
              name="ph:caret-right-bold"
              class="text-[10px] text-slate-300"
            />
            <div class="w-7 h-7 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400 shrink-0">
              <Icon
                name="ph:layout-bold"
                class="text-sm"
              />
            </div>
            <span class="text-xs font-medium text-slate-600 flex-1">Pie de Página</span>
            <Icon
              name="ph:eye-bold"
              class="text-[12px] text-slate-300 group-hover:text-slate-400"
            />
          </div>
        </div>
      </div>

      <!-- Tab: Propiedades -->
      <div
        v-else-if="activeTab === 'properties'"
        class="p-4"
      >
        <p class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
          Propiedades
        </p>
        <!-- Placeholder — se implementa en Fase 5 -->
        <div class="flex flex-col items-center justify-center py-12 gap-3">
          <div class="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center">
            <Icon
              name="ph:cursor-click-bold"
              class="text-2xl text-slate-300"
            />
          </div>
          <p class="text-xs text-slate-400 text-center leading-relaxed">
            Selecciona un bloque en el canvas para ver sus propiedades
          </p>
        </div>
      </div>
    </div>

    <!-- Colaboración (UI placeholder del diseño original) -->
    <div class="p-4 border-t border-slate-100 shrink-0">
      <div class="p-3.5 bg-slate-900 rounded-2xl">
        <div class="flex items-center gap-2 mb-2">
          <div class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Colaboración</span>
        </div>
        <p class="text-xs text-slate-300 leading-relaxed">
          <span class="text-white font-bold">Tú</span> estás editando esta página ahora.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

type TabId = 'layers' | 'properties'

const activeTab = ref<TabId>('layers')

const tabs = [
  { id: 'layers' as const, label: 'Capas', icon: 'ph:stack-bold' },
  { id: 'properties' as const, label: 'Propiedades', icon: 'ph:sliders-horizontal-bold' },
]

// Exponer método para activar tab de propiedades desde el exterior
// (se usa cuando el usuario hace doble click en una capa — Fase 5)
defineExpose({
  showProperties: () => { activeTab.value = 'properties' },
  showLayers: () => { activeTab.value = 'layers' },
})
</script>
