# 🏗️ Roadmap: Fase 3 - Canvas Central y Componentes Base

> **Contexto:** Esta es la planificación granular de la Fase 3 del Visual Editor de Granada. Está diseñada para que un agente de IA iterativo (como Gemini Fast) pueda ejecutarla paso a paso.
> **Principio de esta Fase:** El Canvas es donde el JSON del Store cobra vida. Construiremos el motor de renderizado básico, un envoltorio (`Wrapper`) que le da interactividad a cada bloque en el modo editor, y los componentes visuales nativos.

---

## 📋 Tarea 3.1: Envoltorio Interactivo del Bloque (`src/runtime/components/editor/BlockWrapper.vue`)

**Objetivo**: Crear un componente que envuelva a cualquier bloque del Canvas para darle estados de selección y botones de acción (Toolbar).

**Instrucciones**:
1. Crear `src/runtime/components/editor/BlockWrapper.vue`.
2. El componente debe aceptar la prop `block` (tipo `Block` importado desde `~/types/editor`).
3. Usar el `useEditorStore` para saber si este bloque está activo (`store.selectedBlockId === block.id`).
4. **Renderizado Visual**: 
   - Un borde azul si está activo, transparente si no lo está.
   - Un `<slot />` genérico donde se renderizará el componente real.
   - Al hacer `@click` en la capa del wrapper `store.selectBlock(block.id)` (cuidado con la propagación del evento, sugerencia: usar `.stop`).
5. **Toolbar (solo visible si está activo o en hover)**:
   - Debe flotar arriba a la derecha del componente.
   - Botón ⬆️ subir (emite evento `@moveUp`).
   - Botón ⬇️ bajar (emite evento `@moveDown`).
   - Botón 🗑️ eliminar (emite evento `@delete`).

---

## 📋 Tarea 3.2: Renderizador Base de Bloques (`src/runtime/components/editor/BlockRenderer.vue`)

**Objetivo**: Un componente dinámico que toma un tipo (ej: `'button'`) y renderiza el componente Vue correspondiente, envolviéndolo en `BlockWrapper`.

**Instrucciones**:
1. Crear `src/runtime/components/editor/BlockRenderer.vue`.
2. Propiedad recibida: `block: Block`.
3. Importar dinámicamente o de forma estática los componentes de la carpeta `blocks/` (los construiremos en la Tarea 3.3). Para empezar, crea componentes "Dummy" temporales dentro del mismo archivo o en `src/runtime/components/editor/blocks` para que no de error.
4. Mapeo de componentes usando un objeto o un `computed`:
   - `'heading'` -> `GranadaBlockHeading`
   - `'text'` -> `GranadaBlockText`
   - `'image'` -> `GranadaBlockImage`
   - `'button'` -> `GranadaBlockButton`
   - `'section'` -> `GranadaBlockSection`
5. Renderizar esto usando `<component :is="resolvedComponent" :block="block" />` dentro de un `<GranadaBlockWrapper :block="block">`.

---

## 📋 Tarea 3.3: Construir los Componentes Bloque (`src/runtime/components/editor/blocks/`)

**Objetivo**: Implementar la UI real de los 5 bloques básicos.

**Instrucciones**:
1. Crea la carpeta `src/runtime/components/editor/blocks/`.
2. Crea los siguientes archivos (todos deben aceptar `defineProps<{ block: Block }>()` y alimentarse de `block.props`):
   - `BlockHeading.vue`: Renderiza un `<component :is="block.props.level || 'h2'">{{ block.props.text || 'Nuevo Título' }}</component>`
   - `BlockText.vue`: Renderiza un `<p>` con `block.props.text || 'Escribe tu párrafo...'`.
   - `BlockImage.vue`: Renderiza `<img :src="block.props.url || 'placeholder.jpg'" :alt="block.props.alt" class="max-w-full h-auto">`.
   - `BlockButton.vue`: Renderiza un `<button>` de Tailwind/NuxtUI con el texto de `block.props.text`.
   - `BlockSection.vue`: Renderiza un `<section class="p-8">` y dentro tiene un `v-for` que itera sobre `block.children` e invoca recursivamente a `<GranadaBlockRenderer>`.

---

## 📋 Tarea 3.4: El Canvas Principal (`src/runtime/components/editor/EditorCanvas.vue`)

**Objetivo**: La zona central donde aterrizan todos los componentes del array global de bloques.

**Instrucciones**:
1. Crear `src/runtime/components/editor/EditorCanvas.vue`.
2. Importar `useEditorStore`.
3. Escuchar el modo de viewport: aplicar `max-w-md` para móvil, `max-w-3xl` para tablet, y `max-w-full` para desktop (usar clases Tailwind dinámicas).
4. El fondo del canvas debe ser blanquecino/gris para simular papel.
5. Hacer un `v-for="block in store.blocks" :key="block.id"` sobre el que se iterará llamando al `<GranadaBlockRenderer :block="block" />`.
6. Si `store.blocks.length === 0`, mostrar un _estado vacío_: un contenedor punteado gris que diga "Arrastra componentes aquí para comenzar".
7. Conectar esto al viewport clickando afuera: Si el usuario hace `@click` directo al fondo del Canvas (no a un bloque), se debe limpiar la selección (`store.selectBlock(null)`).

---

## 📋 Tarea 3.5: Inyectar el Canvas en el Layout y Datos Iniciales (`pages/admin/editor/[id].vue`)

**Objetivo**: Integrar visualmente el Canvas en el centro del Layout y probar con un bloque por defecto si la base de datos está vacía.

**Instrucciones**:
1. En `pages/admin/editor/[id].vue`, inyectar `<GranadaEditorCanvas />` en la zona central entre los futuros sidebars.
2. Hacer fetch a `/api/granada/content/:id`. 
3. Al recibir los datos, parsear el `body_json`. Si es un arreglo válido de bloques, usar `store.setBlocks()`.
4. Si `body_json` está vacío (o nulo, o es un documento nuevo), inicializar `store.setBlocks()` con un bloque por defecto:
   ```json
   [{
     "id": "init-heading-1",
     "type": "heading",
     "_version": 1,
     "props": { "text": "¡Empieza a construir tu landing!", "level": "h1" },
     "children": []
   }]
   ```

Asegurarse de que el diseño se vea centrado y scrollable.

---

> **🎉 Al completar la Tarea 3.5:** Habremos conseguido que la base de datos, el Pinia store, el Canvas y el motor dinámico de renderizado interconecten y dibujen una página editable a partir de un JSON puro, cerrando triunfalmente la Fase 3.
