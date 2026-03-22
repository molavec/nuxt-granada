<template>
  <div>
    <div
      class="flex items-center gap-3 p-2 rounded-xl cursor-pointer group transition-colors"
      :class="[
        isActive ? 'bg-granada-50 border border-granada-100 shadow-sm' : 'hover:bg-slate-50 border border-transparent',
        depth > 0 ? 'ml-6 mt-1' : '',
      ]"
      @click.stop="store.selectBlock(block.id)"
    >
      <div
        class="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 shadow-sm transition-colors"
        :class="isActive ? 'bg-white text-granada-500' : 'bg-slate-50 text-slate-400 group-hover:bg-white group-hover:text-slate-600'"
      >
        <Icon
          :name="iconName"
          class="text-sm"
        />
      </div>
      <span
        class="text-xs flex-1 transition-colors"
        :class="isActive ? 'font-bold text-granada-600' : 'font-medium text-slate-500 group-hover:text-slate-700'"
      >
        {{ labelName }}
      </span>
    </div>

    <!-- Recursividad para hijos (ej: secciones) -->
    <div v-if="block.children && block.children.length > 0">
      <GranadaLayerItem
        v-for="child in block.children"
        :key="child.id"
        :block="child"
        :depth="depth + 1"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Block } from '../../types/editor'
import { useEditorStore } from '../../stores/useEditorStore'

const props = defineProps<{
  block: Block
  depth: number
}>()

const store = useEditorStore()

const isActive = computed(() => store.selectedBlockId === props.block.id)

const iconMap: Record<string, string> = {
  heading: 'ph:text-t-bold',
  text: 'ph:text-align-left-bold',
  button: 'ph:mouse-left-click-bold',
  image: 'ph:image-bold',
  section: 'ph:square-half-bottom-bold',
}
const iconName = computed(() => iconMap[props.block.type] || 'ph:cube-bold')

const labelMap: Record<string, string> = {
  heading: 'Título',
  text: 'Texto',
  button: 'Botón',
  image: 'Imagen',
  section: 'Sección',
}
const labelName = computed(() => labelMap[props.block.type] || props.block.type)
</script>
