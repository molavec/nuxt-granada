import { onMounted, onUnmounted } from 'vue'
import { useEditorStore } from '../stores/useEditorStore'
import { useEditorHistory } from './useEditorHistory'

export const useEditorShortcuts = () => {
  const store = useEditorStore()
  const { undo, redo } = useEditorHistory()

  const handleKeydown = (e: KeyboardEvent) => {
    // Evitar interceptar si el usuario está tipeando activamente
    const activeEl = document.activeElement
    if (activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA' || activeEl.hasAttribute('contenteditable'))) {
      return
    }

    // Deshacer (Ctrl+Z o Cmd+Z)
    if ((e.ctrlKey || e.metaKey) && !e.shiftKey && e.key.toLowerCase() === 'z') {
      e.preventDefault()
      undo()
      return
    }

    // Rehacer (Ctrl+Shift+Z o Cmd+Shift+Z)
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'z') {
      e.preventDefault()
      redo()
      return
    }

    // Borrado (Delete o Backspace)
    if ((e.key === 'Delete' || e.key === 'Backspace') && store.selectedBlockId) {
      e.preventDefault()
      store.deleteBlock(store.selectedBlockId)
    }
  }

  onMounted(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('keydown', handleKeydown)
    }
  })

  onUnmounted(() => {
    if (typeof window !== 'undefined') {
      window.removeEventListener('keydown', handleKeydown)
    }
  })
}
