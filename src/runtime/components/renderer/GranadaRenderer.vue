<template>
  <div class="granada-renderer w-full h-full">
    <template
      v-for="block in blocks"
      :key="block.id"
    >
      <component
        :is="getComponentFor(block.type)"
        :block="block"
        class="rendered-block"
      >
        <!-- Renderizado Recursivo para Secciones/Contenedores -->
        <template v-if="block.children && block.children.length > 0">
          <GranadaRenderer :blocks="block.children" />
        </template>
      </component>
    </template>
  </div>
</template>

<script setup lang="ts">
import type { Component } from 'vue'
import type { Block, BlockType } from '../../types/editor'

import {
  GranadaBlockHeading,
  GranadaBlockText,
  GranadaBlockImage,
  GranadaBlockButton,
  GranadaBlockSection,
} from '#components'

defineProps<{
  blocks: Block[]
}>()

// El Renderer nativo no usa wrappers (sin bordes de edición ni toolbars).
// Tampoco es reactivo al drag & drop, es un intérprete unidireccional purista V-BIND.
const getComponentFor = (type: BlockType) => {
  const componentMap: Record<string, Component> = {
    heading: GranadaBlockHeading as Component,
    text: GranadaBlockText as Component,
    image: GranadaBlockImage as Component,
    button: GranadaBlockButton as Component,
    section: GranadaBlockSection as Component,
  }
  return componentMap[type] || 'div'
}
</script>
