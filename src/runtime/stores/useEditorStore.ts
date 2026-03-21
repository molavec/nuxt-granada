import { defineStore } from 'pinia'
import type { Block, BlockType, EditorState } from '../types/editor'

export const useEditorStore = defineStore('editor', {
  state: (): EditorState => ({
    blocks: [],
    selectedBlockId: null,
    isDirty: false,
    viewportMode: 'desktop',
    rightSidebarTab: 'properties',
  }),

  actions: {
    setBlocks(blocks: Block[]) {
      this.blocks = blocks
    },

    selectBlock(id: string | null) {
      this.selectedBlockId = id
    },

    updateBlock(id: string, updates: Partial<Block>) {
      // NOTE: En Fase 3 solo busca en el primer nivel (Root)
      const index = this.blocks.findIndex(b => b.id === id)
      if (index !== -1) {
        this.blocks[index] = { ...this.blocks[index], ...updates }
        this.isDirty = true
      }
    },

    markSaved() {
      this.isDirty = false
    },

    setViewportMode(mode: 'desktop' | 'tablet' | 'mobile') {
      this.viewportMode = mode
    },

    setRightSidebarTab(tab: 'layers' | 'properties') {
      this.rightSidebarTab = tab
    },

    addBlock(block: Block) {
      this.blocks.push(block)
      this.isDirty = true
    },

    deleteBlock(id: string) {
      if (!id) return

      const removeNode = (blocks: Block[]): boolean => {
        const index = blocks.findIndex(b => b.id === id)
        if (index !== -1) {
          blocks.splice(index, 1)
          return true
        }
        for (const block of blocks) {
          if (block.children && removeNode(block.children)) {
            return true
          }
        }
        return false
      }

      if (removeNode(this.blocks)) {
        this.isDirty = true
        if (this.selectedBlockId === id) {
          this.selectedBlockId = null
        }
      }
    },
  },
})

export function createEmptyBlock(type: BlockType | 'divider'): Block {
  return {
    id: crypto.randomUUID(),
    type: type as BlockType,
    _version: 1,
    props: type === 'text' ? { text: 'Nuevo texto' } : type === 'heading' ? { text: 'Nuevo Título', level: 'h2' } : {},
    children: [],
  }
}
