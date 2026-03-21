<template>
  <component
    :is="block.props.level || 'h2'"
    class="font-bold cursor-text focus:outline-none"
    :class="[
      block.props.level === 'h1' ? 'text-4xl' : '',
      block.props.level === 'h2' || !block.props.level ? 'text-3xl' : '',
      block.props.level === 'h3' ? 'text-2xl' : '',
      block.props.level === 'h4' ? 'text-xl' : '',
      block.props.level === 'h5' ? 'text-lg' : '',
      block.props.level === 'h6' ? 'text-base' : '',
      block.props.align === 'center' ? 'text-center' : '',
      block.props.align === 'right' ? 'text-right' : 'text-left',
    ]"
  >
    {{ block.props.text || 'Nuevo Título' }}
  </component>
</template>

<script setup lang="ts">
import type { Block } from '../../../types/editor'

defineProps<{
  block: Block
}>()
</script>
