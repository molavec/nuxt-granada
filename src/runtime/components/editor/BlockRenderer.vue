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
import { computed } from 'vue'
import type { Component } from 'vue'
import type { Block } from '../../types/editor'

import {
  GranadaBlockHeading,
  GranadaBlockText,
  GranadaBlockImage,
  GranadaBlockButton,
  GranadaBlockSection,
} from '#components'

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

// Resolvemos componentes estáticamente usando imports
const resolvedComponent = computed(() => {
  const map: Record<string, Component> = {
    heading: GranadaBlockHeading as Component,
    text: GranadaBlockText as Component,
    image: GranadaBlockImage as Component,
    button: GranadaBlockButton as Component,
    section: GranadaBlockSection as Component,
  }

  return map[props.block.type] || 'div'
})
</script>
