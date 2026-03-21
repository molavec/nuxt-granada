<template>
  <div
    class="relative group transition-all duration-200 border-2 rounded-lg cursor-pointer p-4 mb-2"
    :class="[
      isActive
        ? 'border-granada-500 bg-granada-50/50'
        : 'border-transparent hover:border-granada-200 hover:bg-white',
    ]"
    @click.stop="handleClick"
  >
    <!-- Contenido del Bloque -->
    <slot />

    <!-- Toolbar Flotante (Solo visible al hacer hover o si está activo) -->
    <div
      v-show="isActive || isHovered"
      class="absolute -top-3 right-4 flex items-center bg-white shadow-md border border-gray-200 rounded-md overflow-hidden z-10 transition-opacity duration-200"
      :class="isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'"
      @mouseenter="isHovered = true"
      @mouseleave="isHovered = false"
    >
      <button
        type="button"
        class="p-1 px-2 text-gray-500 hover:bg-gray-100 hover:text-granada-600 focus:outline-none focus:bg-gray-100"
        title="Subir"
        @click.stop="$emit('moveUp', block)"
      >
        <Icon
          name="ph:caret-up-bold"
          class="w-4 h-4"
        />
      </button>
      <div class="w-px h-4 bg-gray-200" />
      <button
        type="button"
        class="p-1 px-2 text-gray-500 hover:bg-gray-100 hover:text-granada-600 focus:outline-none focus:bg-gray-100"
        title="Bajar"
        @click.stop="$emit('moveDown', block)"
      >
        <Icon
          name="ph:caret-down-bold"
          class="w-4 h-4"
        />
      </button>
      <div class="w-px h-4 bg-gray-200" />
      <button
        type="button"
        class="p-1 px-2 text-red-500 hover:bg-red-50 hover:text-red-600 focus:outline-none focus:bg-red-50"
        title="Eliminar"
        @click.stop="$emit('delete', block)"
      >
        <Icon
          name="ph:trash-bold"
          class="w-4 h-4"
        />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Block } from '../../types/editor'
import { useEditorStore } from '../../stores/useEditorStore'

const props = defineProps<{
  block: Block
}>()

defineEmits<{
  (e: 'moveUp' | 'moveDown' | 'delete', block: Block): void
}>()

const store = useEditorStore()
const isHovered = ref(false)

// Computed para determinar si este bloque es el activo
const isActive = computed(() => store.selectedBlockId === props.block.id)

const handleClick = () => {
  store.selectBlock(props.block.id)
}
</script>
