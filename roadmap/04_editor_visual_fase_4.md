# 🏗️ Roadmap: Fase 4 - Sidebar Izquierdo y Drag & Drop

> **Contexto:** Esta es la planificación granular de la Fase 4 del Visual Editor de Granada. Diseñada para ejecución paso a paso por agentes de IA.
> **Principio de esta Fase:** Construir la paleta de herramientas (Left Sidebar) y la capacidad de arrastrar esos bloques de construcción para inyectarlos como nuevos nodos en el Canvas (Pinia Store).

---

## 📋 Tarea 4.1: Estructura base del Sidebar Izquierdo (`LeftSidebar.vue`)

**Objetivo**: Crear la UI del sidebar con su sistema de pestañas (Componentes vs. Configuración).

**Instrucciones**:
1. Abrir/Crear `src/runtime/components/editor/LeftSidebar.vue`.
2. Integrar un estado local `activeTab` para alternar entre `'components'` y `'settings'`.
3. Renderizar una cabecera pequeña con dos pestañas/botones para cambiar de tab.
4. En la pestaña **Settings**, añadir placeholders visuales para "Slug URL", "Título SEO" y "Descripción" (la lógica se conectará en Fases futuras).
5. En la pestaña **Componentes**, crear un grid simple de 2 columnas donde residirán los iconos arrastrables.
6. El Sidebar debe tener estilos consistentes: `w-80`, fondo blanco, borde derecho y scroll independiente (`overflow-y-auto`).

---

## 📋 Tarea 4.2: Componente DraggableItem y Lista de Bloques

**Objetivo**: Crear el catálogo visual de bloques que el usuario puede elegir arrastrar.

**Instrucciones**:
1. Crea un pequeño componente `DraggableItem.vue` en `src/runtime/components/editor/DraggableItem.vue`.
   - Prop: `type` (tipo `BlockType`), `label` (String), `icon` (String, nombre del icono Phantom).
   - Estilos: Debe verse como un "botón" cuadrado o tarjeta pequeña, idealmente con el atributo nativo de HTML `draggable="true"`.
   - Evento de arrastre: En `@dragstart`, debe inyectar el tipo de bloque en el evento de datos (`event.dataTransfer.setData('blockType', type)`).
2. En `LeftSidebar.vue` (Pestaña de Componentes), importa `DraggableItem`.
3. Renderiza una cuadrícula iterando sobre esta constante:
   ```typescript
   const blockCategories = [
     {
       name: 'Básicos',
       items: [
         { type: 'heading', label: 'Título', icon: 'ph:text-t-bold' },
         { type: 'text', label: 'Texto', icon: 'ph:text-align-left-bold' },
         { type: 'button', label: 'Botón', icon: 'ph:mouse-left-click-bold' },
         { type: 'image', label: 'Imagen', icon: 'ph:image-bold' },
       ]
     },
     {
       name: 'Layout',
       items: [
         { type: 'section', label: 'Sección', icon: 'ph:square-half-bottom-bold' }
       ]
     }
   ]
   ```

---

## 📋 Tarea 4.3: Preparar el Pinia Store para Inserción y la Función Generadora

**Objetivo**: Crear en el Store la lógica pura para añadir nuevos bloques en ubicaciones específicas.

**Instrucciones**:
1. Crear una función utilitaria en `src/runtime/types/editor.ts` o en el store llamada `createEmptyBlock(type: BlockType): Block`:
   - Que genere un ID único (ej: con `crypto.randomUUID()` o un simple contador temporal).
   - Que devuelva el objeto `Block` base con `props` y `children` vacíos.
   - Opcional: Para `type === 'text'`, que inyecte un texto por defecto de "Nuevo texto".
2. En `useEditorStore.ts`, crear la acción `insertBlock(block: Block, parentId: string | null = null, index: number | null = null)`.
   - Si `parentId` es nulo, se inserta en `this.blocks`.
   - Si `index` es nulo, se hace `push` (al final). Si no, se inserta en ese índice con `splice`.
   - *(En la Fase 4 inicial podemos simplificarlo a solo insertar al Root `blocks` mediante un método `push` para no sobrecomplicar)*.
   - Marcar el `store.isDirty = true`.

---

## 📋 Tarea 4.4: Habilitar "Drop" en el Canvas (`EditorCanvas.vue`)

**Objetivo**: Que el Canvas principal detecte y acepte cuando se le suelta un bloque encima.

**Instrucciones**:
1. En `EditorCanvas.vue`, añadir los eventos nativos de HTML Drag & Drop al contenedor principal de bloques (`div` que envuelve los `BlockRenderer`):
   - `@dragover.prevent` (Requerido por HTML5 para permitir el soltado).
   - `@dragenter.prevent` y `@dragleave` (Opcional, para añadir estilos visuales de "suelta aquí!").
   - `@drop="handleDrop"`
2. Implementar `handleDrop(event: DragEvent)`:
   - Rescatar el dato: `const type = event.dataTransfer?.getData('blockType') as BlockType`.
   - Si existe el tipo, instanciar un nuevo bloque `const newBlock = createEmptyBlock(type)`.
   - Añadirlo usando la acción del store (`store.addBlock` o `store.insertBlock`).
   - Activar su selección: `store.selectBlock(newBlock.id)`.

---

> **🎉 Al completar la Tarea 4.4:** Habremos integrado la capacidad de construcción fundamental visual. El diseñador ya podrá armar su maqueta añadiendo títulos, secciones, botones e imágenes simplemente arrastrándolos desde el panel izquierdo, terminando triunfalmente la Fase 4.
