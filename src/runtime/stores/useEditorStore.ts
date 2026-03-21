import { defineStore } from 'pinia'
import type { Block, EditorState } from '../types/editor'

export const useEditorStore = defineStore('editor', {
  state: (): EditorState => ({
    blocks: [],
    selectedBlockId: null,
    isDirty: false,
    viewportMode: 'desktop',
    rightSidebarTab: 'layers',
  }),
  actions: {
    setBlocks(blocks: Block[]) {
      this.blocks = blocks
      this.isDirty = true
    },
    addBlock(block: Block) {
      this.blocks.push(block)
      this.isDirty = true
    },
    updateBlock(id: string, updates: Partial<Block>) {
      const blockIndex = this.blocks.findIndex(b => b.id === id)
      if (blockIndex !== -1) {
        this.blocks[blockIndex] = { ...this.blocks[blockIndex], ...updates }
        this.isDirty = true
      }
    },
    selectBlock(id: string | null) {
      this.selectedBlockId = id
      if (id) {
        this.rightSidebarTab = 'properties' // Auto switch tab UX
      }
    },
    setViewportMode(mode: EditorState['viewportMode']) {
      this.viewportMode = mode
    },
    setRightSidebarTab(tab: EditorState['rightSidebarTab']) {
      this.rightSidebarTab = tab
    },
    markSaved() {
      this.isDirty = false
    },
  },
})
