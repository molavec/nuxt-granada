<template>
  <section class="p-8 border-2 border-dashed border-gray-200 rounded-xl min-h-[100px] flex flex-col gap-4 relative">
    <div
      v-if="(!block.children || block.children.length === 0) && !isActive"
      class="absolute inset-0 flex items-center justify-center text-gray-400 pointer-events-none"
    >
      Sección vacía
    </div>

    <!-- Renderizado Recursivo de los hijos de la sección -->
    <GranadaBlockRenderer
      v-for="(child, index) in block.children"
      :key="child.id"
      :block="child"
      @delete="handleChildDelete"
      @move-up="handleChildMoveUp(index)"
      @move-down="handleChildMoveDown(index)"
    />
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Block } from '../../../types/editor'
import { useEditorStore } from '../../../stores/useEditorStore'

const props = defineProps<{
  block: Block
}>()

const store = useEditorStore()

const isActive = computed(() => store.selectedBlockId === props.block.id)

// Manejo de eventos de los hijos directos de la sección
const handleChildDelete = (childBlock: Block) => {
  if (!props.block.children) return
  const index = props.block.children.findIndex(b => b.id === childBlock.id)
  if (index !== -1) {
    // eslint-disable-next-line vue/no-mutating-props
    props.block.children.splice(index, 1)
    store.isDirty = true
  }
}

const handleChildMoveUp = (index: number) => {
  if (!props.block.children || index <= 0) return
  const temp = props.block.children[index]
  // eslint-disable-next-line vue/no-mutating-props
  props.block.children[index] = props.block.children[index - 1]
  // eslint-disable-next-line vue/no-mutating-props
  props.block.children[index - 1] = temp
  store.isDirty = true
}

const handleChildMoveDown = (index: number) => {
  if (!props.block.children || index >= props.block.children.length - 1) return
  const temp = props.block.children[index]
  // eslint-disable-next-line vue/no-mutating-props
  props.block.children[index] = props.block.children[index + 1]
  // eslint-disable-next-line vue/no-mutating-props
  props.block.children[index + 1] = temp
  store.isDirty = true
}
</script>
