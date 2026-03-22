# 🎛️ Roadmap: Fase 5 - Sidebar Derecho (Propiedades Dinámicas)

> **Contexto:** Esta fase implementa el panel lateral derecho (`RightSidebar.vue`), el cual es crucial para modificar atributos específicos (props) del bloque que el usuario acaba de seleccionar en el Canvas. Además, incluirá una vista de "Capas" para ver el árbol del DOM.

---

## 📋 Tarea 5.1: Estructura base del Sidebar Derecho y Pestañas

**Objetivo**: Reactivar las pestañas "Capas" (Layers) y "Propiedades" en `RightSidebar.vue` usando el estado global de Pinia.

**Instrucciones**:
1. Abrir `src/runtime/components/editor/RightSidebar.vue`.
2. Leer desde `useEditorStore` las propiedades `rightSidebarTab` y cambiar dinámicamente el contenido principal basado en si es `'layers'` o `'properties'`.
3. Actualizar los botones de las pestañas en la cabecera para que disparen `store.setRightSidebarTab('layers' | 'properties')`.
4. Mostrar un "Empty State" (ej: "Selecciona un bloque en el canvas para ver sus propiedades") si el tab activo es 'properties' pero `store.selectedBlockId` es nulo.

---

## 📋 Tarea 5.2: Visor de Árbol de Capas (Layers Tab)

**Objetivo**: Crear una representación vertical jerárquica de todos los bloques en el Store, útil para navegación profunda.

**Instrucciones**:
1. Dentro del tab de 'layers', iterar recursivamente sobre `store.blocks`. (Sugerencia: crear un componente recursivo miniatura `BlockLayerItem.vue` si es muy complejo, o usar recursividad simple).
2. Cada nodo en el árbol de capas debe mostrar el icono del tipo de bloque y un label (ej: "Título", "Sección").
3. Al hacer clic en un nodo del árbol, debe llamar a `store.selectBlock(id)`.
4. El nodo activo debe resaltar visualmente si su `id === store.selectedBlockId`.
5. *(Opcional/Fase futura)*: Añadir botones de reordenamiento aquí. En esta tarea bastará con que sea de solo lectura y selección.

---

## 📋 Tarea 5.3: El Motor Dinámico de Formularios (Properties Tab)

**Objetivo**: Construir el sistema que renderiza campos de formulario distintos según el tipo de componente seleccionado.

**Instrucciones**:
1. Crear un controlador en el tab de 'properties' que reaccione al tipo de bloque seleccionado.
2. Basado en el `store.selectedBlockId`, obtener el bloque completo (`activeBlock`).
3. Renderizar campos de input vinculados bidireccionalmente (`v-model` o event listeners) a las `props` del bloque correspondiente usando `store.updateBlock(activeBlock.id, { props: nuevasProps })`.

### Mapeo de Campos por Defecto:
- **Heading**:
  - `text` (Input)
  - `level` (Select: h1, h2, h3, h4, h5, h6)
  - `align` (Botones de alineación: left, center, right)
- **Text**:
  - `text` (Textarea enriquecido o simple)
  - `align` (Botones de alineación)
- **Button**:
  - `text` (Input)
  - `url` (Input de texto/link)
  - `variant` (Select: solid, outline)
  - `align` (Botones de alineación)
- **Image**:
  - `url` (Input de texto para la URL, placeholder para un futuro Media Manager)
  - `alt` (Input de texto)
  - `align` (Botones de alineación)
- **Section**:
  - (En esta fase puede quedar vacío, o añadir ajustes de padding futuro).

---

> **🎉 Al completar la Tarea 5.3:** Tendremos un editor visual 100% interactivo. Podremos arrastrar un botón desde la izquierda, hacerle clic en el canvas, e ir a la derecha y escribir "Comprar Ahora" en un input, viendo cómo el canvas se actualiza en tiempo real de manera reactiva y persistiendo los datos con Pinia.
