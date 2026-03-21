<template>
  <div
    class="flex-1 overflow-y-auto p-4 md:p-8 flex justify-center"
    @click="store.selectBlock(null)"
  >
    <div
      class="bg-white transition-all duration-300 min-h-[600px] w-full relative group"
      :class="[
        store.viewportMode === 'mobile' ? 'max-w-[384px] shadow-2xl rounded my-4' : '',
        store.viewportMode === 'tablet' ? 'max-w-[768px] shadow-2xl rounded my-4' : '',
        store.viewportMode === 'desktop' ? 'max-w-[1280px] shadow-md rounded border border-gray-200' : '',
      ]"
    >
      <div
        class="h-full flex flex-col gap-1"
        :class="store.viewportMode === 'desktop' ? 'p-8' : 'p-4'"
      >
        <!-- Estado Vacío -->
        <div
          v-if="store.blocks.length === 0"
          class="flex-1 min-h-[300px] border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center text-gray-400 bg-gray-50/50"
        >
          <div class="text-center">
            <Icon
              name="ph:canvas-logo-duotone"
              class="w-12 h-12 mx-auto mb-2 text-gray-300"
            />
            <p>El lienzo está vacío.</p>
            <p class="text-xs mt-1">
              Arrastra bloques desde el panel izquierdo.
            </p>
          </div>
        </div>

        <!-- Renderizado de Bloques Raíz -->
        <GranadaBlockRenderer
          v-for="(block, index) in store.blocks"
          :key="block.id"
          :block="block"
          @delete="handleDelete"
          @move-up="handleMoveUp(index)"
          @move-down="handleMoveDown(index)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useEditorStore } from '../../stores/useEditorStore'
import type { Block } from '../../types/editor'

const store = useEditorStore()

// Manejo de eventos en la capa raíz (Top-level blocks)
const handleDelete = (childBlock: Block) => {
  const index = store.blocks.findIndex(b => b.id === childBlock.id)
  if (index !== -1) {
    store.blocks.splice(index, 1)
    store.isDirty = true
  }
}

const handleMoveUp = (index: number) => {
  if (index <= 0) return
  const temp = store.blocks[index]
  store.blocks[index] = store.blocks[index - 1]
  store.blocks[index - 1] = temp
  store.isDirty = true
}

const handleMoveDown = (index: number) => {
  if (index >= store.blocks.length - 1) return
  const temp = store.blocks[index]
  store.blocks[index] = store.blocks[index + 1]
  store.blocks[index + 1] = temp
  store.isDirty = true
}
</script>
