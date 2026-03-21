<template>
  <div
    :class="[
      block.props.align === 'center' ? 'text-center' : '',
      block.props.align === 'right' ? 'text-right' : 'text-left',
    ]"
  >
    <button
      v-if="!block.props.url"
      class="px-4 py-2 bg-granada-500 text-white font-medium rounded-md hover:bg-granada-600 transition-colors"
      :class="[
        block.props.variant === 'outline' ? 'bg-transparent border-2 border-granada-500 text-granada-500 hover:bg-granada-50' : '',
      ]"
    >
      {{ block.props.text || 'Haz clic aquí' }}
    </button>
    <NuxtLink
      v-else
      :to="block.props.url"
      class="inline-block px-4 py-2 bg-granada-500 text-white font-medium rounded-md hover:bg-granada-600 transition-colors"
      :class="[
        block.props.variant === 'outline' ? 'bg-transparent border-2 border-granada-500 text-granada-500 hover:bg-granada-50' : '',
      ]"
    >
      {{ block.props.text || 'Haz clic aquí' }}
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
import type { Block } from '../../../types/editor'

defineProps<{
  block: Block
}>()
</script>
