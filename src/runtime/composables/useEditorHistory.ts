import { useRefHistory } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { useEditorStore } from '../stores/useEditorStore'

export const useEditorHistory = () => {
  const store = useEditorStore()
  const { blocks } = storeToRefs(store)

  // useRefHistory mantiene un historial del ref provisto.
  // Es necesario usar deep: true y clone: true para que
  // guarde copias inmutables de todo el árbol de bloques
  // cada vez que hay una mutación anidada.
  const { undo, redo, canUndo, canRedo, clear } = useRefHistory(blocks, {
    deep: true,
    clone: true,
  })

  // Funciones envueltas para que también cambien el estado 'isDirty'
  // cuando regresamos en el tiempo (porque hubo un cambio real en el canvas)
  const performUndo = () => {
    if (canUndo.value) {
      undo()
      store.isDirty = true
    }
  }

  const performRedo = () => {
    if (canRedo.value) {
      redo()
      store.isDirty = true
    }
  }

  return {
    undo: performUndo,
    redo: performRedo,
    canUndo,
    canRedo,
    clearHistory: clear,
  }
}
