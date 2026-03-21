<template>
  <p
    class="cursor-text focus:outline-none"
    :class="[
      block.props.align === 'center' ? 'text-center' : '',
      block.props.align === 'right' ? 'text-right' : 'text-left',
    ]"
    v-html="block.props.text || 'Escribe tu párrafo...'"
  />
</template>

<script setup lang="ts">
import type { Block } from '../../../types/editor'

defineProps<{
  block: Block
}>()
</script>
