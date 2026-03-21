<template>
  <GranadaBlockWrapper
    :block="block"
    @delete="handleDelete"
    @move-up="handleMoveUp"
    @move-down="handleMoveDown"
  >
    <!-- Componente resuelto dinámicamente -->
    <component
      :is="resolvedComponent"
      :block="block"
    />
  </GranadaBlockWrapper>
</template>

<script setup lang="ts">
import { computed, resolveComponent } from 'vue'
import type { Block } from '../../types/editor'

const props = defineProps<{
  block: Block
}>()

const emit = defineEmits<{
  (e: 'delete' | 'moveUp' | 'moveDown', block: Block): void
}>()

// El componente padre (EditorCanvas o BlockSection) escuchará estos
// eventos y se encargará de reordenar el arreglo local de bloques.
const handleDelete = (b: Block) => emit('delete', b)
const handleMoveUp = (b: Block) => emit('moveUp', b)
const handleMoveDown = (b: Block) => emit('moveDown', b)

// Mapeo del prop 'type' al nombre del componente de Nuxt
const resolvedComponent = computed(() => {
  const map: Record<string, string> = {
    heading: 'GranadaBlockHeading',
    text: 'GranadaBlockText',
    image: 'GranadaBlockImage',
    button: 'GranadaBlockButton',
    section: 'GranadaBlockSection',
  }

  const componentName = map[props.block.type]
  return componentName ? resolveComponent(componentName) : 'div'
})
</script>
