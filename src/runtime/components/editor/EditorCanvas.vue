<template>
  <div
    class="flex-1 overflow-y-auto p-4 md:p-8 flex justify-center"
    @click="store.selectBlock(null)"
  >
    <div
      class="bg-white transition-all duration-300 min-h-[600px] w-full relative group"
      :class="[
        store.viewportMode === 'mobile' ? 'max-w-[384px] shadow-2xl rounded-[2rem] border-[12px] border-gray-900 my-4' : '',
        store.viewportMode === 'tablet' ? 'max-w-[768px] shadow-2xl rounded-[1.5rem] border-[12px] border-gray-900 my-4' : '',
        store.viewportMode === 'desktop' ? 'max-w-[1280px] shadow-md rounded-md border border-gray-200' : '',
        isDraggingOver ? 'ring-4 ring-granada-400 bg-granada-50/30 outline-dashed outline-2 outline-granada-500' : '',
      ]"
      @dragover.prevent
      @dragenter.prevent="isDraggingOver = true"
      @dragleave="isDraggingOver = false"
      @drop="handleDrop"
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
import { ref } from 'vue'
import { useEditorStore, createEmptyBlock } from '../../stores/useEditorStore'
import { useEditorShortcuts } from '../../composables/useEditorShortcuts'
import type { Block, BlockType } from '../../types/editor'

const store = useEditorStore()
useEditorShortcuts()

const isDraggingOver = ref(false)

const handleDrop = (event: DragEvent) => {
  isDraggingOver.value = false
  const blockType = event.dataTransfer?.getData('blockType') as BlockType | undefined
  if (blockType) {
    const newBlock = createEmptyBlock(blockType)
    store.addBlock(newBlock)
    store.selectBlock(newBlock.id)
  }
}

const handleDelete = (id: string) => {
  store.deleteBlock(id)
}

const handleMoveUp = (index: number) => {
  if (index <= 0 || !store.blocks[index] || !store.blocks[index - 1]) return
  const temp = store.blocks[index] as Block
  store.blocks[index] = store.blocks[index - 1] as Block
  store.blocks[index - 1] = temp
  store.isDirty = true
}

const handleMoveDown = (index: number) => {
  if (index >= store.blocks.length - 1 || !store.blocks[index] || !store.blocks[index + 1]) return
  const temp = store.blocks[index] as Block
  store.blocks[index] = store.blocks[index + 1] as Block
  store.blocks[index + 1] = temp
  store.isDirty = true
}
</script>
