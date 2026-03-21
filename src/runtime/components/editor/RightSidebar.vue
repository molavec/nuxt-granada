<template>
  <div class="flex flex-col h-full overflow-hidden">
    <!-- Tabs de navegación -->
    <div class="flex border-b border-slate-100 shrink-0">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        class="flex-1 flex items-center justify-center gap-2 py-3 text-xs font-semibold transition-all"
        :class="store.rightSidebarTab === tab.id
          ? 'text-granada-500 border-b-2 border-granada-500'
          : 'text-slate-400 hover:text-slate-600'"
        @click="store.setRightSidebarTab(tab.id)"
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
        v-if="store.rightSidebarTab === 'layers'"
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

        <!-- Visor del árbol de capas -->
        <div class="space-y-1">
          <p
            v-if="store.blocks.length === 0"
            class="text-xs text-slate-400 text-center py-8"
          >
            No hay capas aún
          </p>
          <GranadaLayerItem
            v-for="block in store.blocks"
            :key="block.id"
            :block="block"
            :depth="0"
          />
        </div>
      </div>

      <!-- Tab: Propiedades -->
      <div
        v-else-if="store.rightSidebarTab === 'properties'"
        class="p-4"
      >
        <p class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
          Propiedades
        </p>

        <!-- Estado Vacío -->
        <div
          v-if="!store.selectedBlockId"
          class="flex flex-col items-center justify-center py-12 gap-3"
        >
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

        <!-- Propiedades Activas (Motor de Formularios Fase 5.3) -->
        <div
          v-else-if="activeBlock"
          class="space-y-6"
        >
          <!-- Detalles del componente seleccionado -->
          <div class="flex items-center gap-3 mb-2 p-3 bg-slate-50 border border-slate-100 rounded-xl">
            <div class="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-granada-500 shadow-sm">
              <Icon
                :name="getIconFor(activeBlock.type)"
                class="text-lg"
              />
            </div>
            <div class="flex-1">
              <p class="text-xs font-bold text-slate-700 capitalize">
                Bloque {{ activeBlock.type }}
              </p>
              <p class="text-[9px] text-slate-400 font-mono">
                ID: {{ activeBlock.id.split('-')[0] }}...
              </p>
            </div>
          </div>

          <!-- Input Universal de Texto -->
          <div
            v-if="['heading', 'text', 'button'].includes(activeBlock.type)"
            class="space-y-1.5"
          >
            <label class="text-[11px] font-bold text-slate-500">Texto</label>
            <textarea
              v-if="activeBlock.type === 'text'"
              v-model="activeBlock.props.text"
              rows="4"
              class="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-granada-500/20 focus:border-granada-300 outline-none transition-all resize-none"
              placeholder="Escribe el texto aquí..."
              @input="markDirty"
            />
            <input
              v-else
              v-model="activeBlock.props.text"
              type="text"
              class="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-granada-500/20 focus:border-granada-300 outline-none transition-all"
              placeholder="Texto principal"
              @input="markDirty"
            >
          </div>

          <!-- Nivel de Heading (H1-H6) -->
          <div
            v-if="activeBlock.type === 'heading'"
            class="space-y-1.5"
          >
            <label class="text-[11px] font-bold text-slate-500">Nivel de Título</label>
            <select
              v-model="activeBlock.props.level"
              class="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-granada-500/20 focus:border-granada-300 outline-none transition-all"
              @change="markDirty"
            >
              <option value="h1">
                H1 - Título Principal
              </option>
              <option value="h2">
                H2 - Subtítulo Mayor
              </option>
              <option value="h3">
                H3 - Subtítulo Medio
              </option>
              <option value="h4">
                H4 - Subtítulo Menor
              </option>
              <option value="h5">
                H5 - Encabezado Pequeño
              </option>
              <option value="h6">
                H6 - Encabezado Mínimo
              </option>
            </select>
          </div>

          <!-- URL Remota (Imagen o Link) -->
          <div
            v-if="['image', 'button'].includes(activeBlock.type)"
            class="space-y-1.5"
          >
            <label class="text-[11px] font-bold text-slate-500">{{ activeBlock.type === 'image' ? 'URL de la Imagen' : 'Enlace de Destino' }}</label>
            <input
              v-model="activeBlock.props.url"
              type="text"
              class="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-granada-500/20 focus:border-granada-300 outline-none transition-all"
              placeholder="https://..."
              @input="markDirty"
            >
          </div>

          <!-- Estilo Visual (Variante del Botón) -->
          <div
            v-if="activeBlock.type === 'button'"
            class="space-y-1.5"
          >
            <label class="text-[11px] font-bold text-slate-500">Variante Visual</label>
            <select
              v-model="activeBlock.props.variant"
              class="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-granada-500/20 focus:border-granada-300 outline-none transition-all"
              @change="markDirty"
            >
              <option value="solid">
                Principal (Fondo sólido)
              </option>
              <option value="outline">
                Secundario (Solo contorno)
              </option>
            </select>
          </div>

          <!-- Botonera Universal de Alineación -->
          <div
            v-if="['heading', 'text', 'button', 'image'].includes(activeBlock.type)"
            class="space-y-1.5"
          >
            <label class="text-[11px] font-bold text-slate-500">Alineación</label>
            <div class="flex bg-slate-100 p-1.5 rounded-xl gap-1">
              <button
                v-for="align in ['left', 'center', 'right']"
                :key="align"
                class="flex-1 py-1.5 rounded-lg text-sm flex justify-center items-center transition-all"
                :class="activeBlock.props.align === align ? 'bg-white shadow-sm text-granada-600 font-bold' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'"
                @click="activeBlock.props.align = align; markDirty()"
              >
                <Icon :name="`ph:text-align-${align}-bold`" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Colaboración -->
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
import { computed } from 'vue'
import { useEditorStore } from '../../stores/useEditorStore'
import type { Block } from '../../types/editor'

const store = useEditorStore()

// Búsqueda profunda en el DOM para inyectar al formulario las props reales activas
const findBlockDeep = (blocks: Block[], id: string): Block | null => {
  for (const block of blocks) {
    if (block.id === id) return block
    if (block.children) {
      const found = findBlockDeep(block.children, id)
      if (found) return found
    }
  }
  return null
}

const activeBlock = computed(() => {
  if (!store.selectedBlockId) return null
  return findBlockDeep(store.blocks, store.selectedBlockId)
})

const markDirty = () => {
  store.isDirty = true
}

const getIconFor = (type: string) => {
  const iconMap: Record<string, string> = {
    heading: 'ph:text-t-bold',
    text: 'ph:text-align-left-bold',
    button: 'ph:mouse-left-click-bold',
    image: 'ph:image-bold',
    section: 'ph:square-half-bottom-bold',
  }
  return iconMap[type] || 'ph:cube-bold'
}

const tabs = [
  { id: 'layers' as const, label: 'Capas', icon: 'ph:stack-bold' },
  { id: 'properties' as const, label: 'Propiedades', icon: 'ph:sliders-horizontal-bold' },
]

defineExpose({
  showProperties: () => { store.setRightSidebarTab('properties') },
  showLayers: () => { store.setRightSidebarTab('layers') },
})
</script>
