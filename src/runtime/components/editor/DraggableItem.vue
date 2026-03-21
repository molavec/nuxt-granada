<template>
  <div
    draggable="true"
    class="p-4 border border-slate-100 bg-slate-50 rounded-2xl flex flex-col items-center gap-2 hover:border-granada-200 hover:bg-granada-50 transition-all cursor-grab active:cursor-grabbing group"
    @dragstart="onDragStart"
  >
    <Icon
      :name="icon"
      class="text-2xl text-slate-400 group-hover:text-granada-500 transition-colors pointer-events-none"
    />
    <span class="text-[11px] font-semibold text-slate-600 pointer-events-none">{{ label }}</span>
  </div>
</template>

<script setup lang="ts">
import type { BlockType } from '../../types/editor'

const props = defineProps<{
  type: BlockType | 'divider'
  label: string
  icon: string
}>()

const onDragStart = (event: DragEvent) => {
  if (event.dataTransfer) {
    event.dataTransfer.setData('blockType', props.type)
    event.dataTransfer.effectAllowed = 'copy'
  }
}
</script>
