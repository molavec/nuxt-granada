<template>
  <img
    :src="block.props.url || 'https://via.placeholder.com/800x400?text=Placeholder+Image'"
    :alt="block.props.alt || 'Imagen'"
    class="max-w-full h-auto rounded-md object-cover"
    :class="[
      block.props.align === 'center' ? 'mx-auto block' : '',
      block.props.align === 'right' ? 'ml-auto block' : '',
    ]"
  >
</template>

<script setup lang="ts">
import type { Block } from '../../../types/editor'

defineProps<{
  block: Block
}>()
</script>
