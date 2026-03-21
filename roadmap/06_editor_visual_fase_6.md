# 🚀 Roadmap: Fase 6 - Funciones Avanzadas y Pulido (Final)

> **Contexto:** Esta es la fase de cierre del Editor Visual Mínimo Viable (MVP). El núcleo de renderizado y el drag & drop ya funcionan. El objetivo aquí es dotar al editor de características de "calidad de vida" (QoL) indispensables para un CMS profesional, como Deshacer/Rehacer y atajos de teclado rápidos.

---

## 📋 Tarea 6.1: Conectar Deshacer / Rehacer en el Header

**Objetivo**: Habilitar los históricos de tiempo inyectando la lógica de `useEditorHistory` (preparada en Fase 2) directamente en la UI del EditorHeader.

**Instrucciones**:
1. Abrir `src/runtime/components/editor/EditorHeader.vue`.
2. Importar el composable `useEditorHistory` y extraer `undo`, `redo`, `canUndo` y `canRedo`.
3. Añadir dos nuevos iconos/botones en el centro del Header (ej: `ph:arrow-u-up-left-bold` y `ph:arrow-u-up-right-bold`).
4. Vincular los botones a `@click="undo()"` y `@click="redo()"`.
5. Deshabilitar dinámicamente (`:disabled="!canUndo"`, class `opacity-50 cursor-not-allowed`) los botones cuando no haya historial disponible.

---

## 📋 Tarea 6.2: Sistema de Atajos de Teclado Globales

**Objetivo**: Permitir trabajar sin ratón para acciones repetitivas usando una escucha de eventos global del teclado.

**Instrucciones**:
1. En `pages/admin/editor/[id].vue` (o mediante un composable dedicado `useEditorShortcuts.ts` si se prefiere mayor limpieza), añadir un `onMounted` con un `window.addEventListener('keydown', handleKeydown)` y su respectivo `onUnmounted`.
2. **Atajo de Borrado:** Si se presiona `Delete` o `Backspace` (y el usuario *no* está escribiendo activamente dentro de un input/textarea):
   - Eliminar el bloque que corresponda a `store.selectedBlockId`.
   - Limpiar el `selectedBlockId` (`store.selectBlock(null)`).
3. **Atajos de Historial:** 
   - `Ctrl + Z` (o `Cmd + Z` en Mac): Invocar `undo()`.
   - `Ctrl + Shift + Z` (o `Cmd + Shift + Z`): Invocar `redo()`.

*(Nota: Para evitar borrar cosas escribiendo en el sidebar derecho, la escucha de `Backspace` debe verificar `document.activeElement?.tagName`. Si el tag es `INPUT` o `TEXTAREA`, se ignora el atajo de borrado de bloque).*

---

## 📋 Tarea 6.3: Lógica Recursiva de Eliminación

**Objetivo**: Asegurarse de que el borrado por teclado o por la UI elimine correctamente el bloque sin importar qué tan profundo esté anidado dentro de una `<BlockSection>`.

**Instrucciones**:
1. En `useEditorStore.ts`, crear o fortalecer una acción `deleteBlock(id: string)`.
2. Esta función debe buscar recursivamente en `this.blocks` (y en los `children` de las secciones) hasta encontrar el nodo con ese ID, cortarlo (`splice`) del arreglo padre correspondiente, marcar `this.isDirty = true` y limpiar el `selectedBlockId` si coincide.
3. Sustituir la lógica plana actual de eliminación en `EditorCanvas.vue` e invocar directamente `store.deleteBlock(id)`.

---

## 📋 Tarea 6.4: Auditoría y Pulido Final

**Objetivo**: La capa de pintura final.
1. Ejecutar el `pnpm lint --fix` en toda la base del código.
2. Hacer un recorrido visual del editor viendo que los Toolbars de los bloques floten limpiamente.
3. Asegurar de que no existan errores rojos de TS o Vue en la terminal de compilación referentes al layout.

---

> **🎉 Al completar la Fase 6:** El framework del Granada Visual Builder estará 100% operativo y listo para empaquetarse. El diseñador Web tendrá una experiencia fluida igual a la de un editor headless moderno premium.
