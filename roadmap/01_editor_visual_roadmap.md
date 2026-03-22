# 🏗️ Roadmap: Granada Visual Editor

> **Objetivo**: Construir un constructor web visual estilo Elementor como interfaz de edición de contenido (`/admin/editor/:id`), nativo en el ecosistema Nuxt 4.
>
> **Principio rector**: De lo más simple e independiente → a lo más complejo e interconectado.

---

## Estado Actual (Punto de Partida)

El `editor/[id].vue` actual es un formulario simple con campos Markdown. La transformación hacia el editor visual implicará:

- Reemplazar el layout `content-editor` actual por uno tri-panel (header + sidebar izq + canvas + sidebar der).
- Cambiar el modelo de datos de texto plano Markdown → un árbol de componentes JSON serializable. Siempre debe haber un componente Markdown por defecto, arriba y abajo del resto de componentes, para hacer fluida la escritura del usuario.
- Construir un sistema de componentes arrastrables con estado reactivo.

---

## 📐 Arquitectura de la Solución

```
┌─────────────────────────────────────────────────────┐
│                  EDITOR LAYOUT                      │
│  ┌──────────────────────────────────────────────┐   │
│  │              EDITOR HEADER                   │   │  ← Fase 1
│  └──────────────────────────────────────────────┘   │
│  ┌──────────┬──────────────────┬──────────────┐     │
│  │          │                  │              │     │
│  │ LEFT     │    CANVAS        │  RIGHT       │     │
│  │ SIDEBAR  │    (Central)     │  SIDEBAR     │     │  ← Fases 2,3,4,5,6
│  │          │                  │              │     │
│  │ Comps +  │  Zona editable   │  Capas  +   │     │
│  │ Settings │  Drag & Drop     │  Propiedades │     │
│  │          │                  │  (tabs)      │     │
│  └──────────┴──────────────────┴──────────────┘     │
└─────────────────────────────────────────────────────┘
```

> **🧠 Principio UX — F-Pattern (Nielsen Norman Group):** Los usuarios en culturas occidentales escanean
> pantallas de izquierda a derecha. Esto justifica colocar el canvas (el diseño) a la izquierda del
> inspector de propiedades: el usuario primero ve el resultado visual y luego, de forma natural, mira
> hacia la derecha para modificarlo. Reduce la fricción cognitiva y hace la experiencia más fluida.

**Flujo de datos simplificado:**
```
editorState (Pinia store)
  └── content.blocks: Block[]   ← árbol de componentes
        ├── id, type, version, props, children[]
        └── sincronizado con API (/api/granada/content/:id)
```

---

## 🗺️ Fases de Desarrollo

### FASE 1 — Shell del Editor (Layout & Header)
> *Sin lógica compleja. Solo estructura visual y navegación.*

**Objetivo**: Tener la carcasa del editor funcionando: los 3 paneles y el header, aunque vacíos.

**Tareas:**
1. Crear `layouts/GranadaEditor.vue` — layout tri-panel (reemplaza `ContentEditor.vue`)
2. Crear `components/editor/EditorHeader.vue` con tres zonas:
   - **Izquierda**: botón `←` back, separador, nombre de página + dropdown, botón `⚙` settings
   - **Centro**: selector de viewport (Desktop / Tablet / Móvil)
   - **Derecha**: icono `☰ Layers` (toggle del sidebar derecho), "Vista Previa", "Guardar", "Publicar"
3. Adaptar `pages/admin/editor/[id].vue` para usar el nuevo layout
4. Implementar **responsividad base**: en móvil, los sidebars se ocultan con toggle desde el header

**Resultado esperado**: Abrir `/admin/editor/1` muestra los 3 paneles vacíos pero correctamente distribuidos.

**Nota:** Utilizar alias de importación desde `src/runtime/` para todos los componentes del módulo.

**Canvas adaptable:** Dimensiones optimizadas para Desktop, Tablet (3xl - 768px) y Mobile (sm - 384px).

---

### FASE 2 — Estado Global del Editor (useEditorStore)
> *El sistema nervioso del editor. Sin esto, nada habla con nada.*

**Objetivo**: Definir el modelo de datos y el estado compartido del editor.

**Tareas:**
1. Definir interfaces TypeScript: `Block`, `BlockType`, `EditorState`
   - Cada `Block` incluye campo `_version: number` para migraciones futuras del schema de bloques
2. Crear `stores/useEditorStore.ts` usando **Pinia** (store con `defineStore`)
3. Implementar estado base: `selectedBlockId`, `blocks`, `isDirty`, `viewportMode`, `rightSidebarTab`
4. Crear `composables/useEditorHistory.ts` — undo/redo (stack de estados inmutables)
5. **[DB]** Añadir campo `body_json TEXT` al schema de Drizzle + migración (`pnpm db:generate && pnpm db:push`)
6. Actualizar endpoints GET/PUT de `/api/granada/content/:id` para leer/escribir `body_json`

**Resultado esperado**: El estado del editor existe y se puede inspeccionar en DevTools.

---

### FASE 3 — Canvas Central & Componentes Base
> *El corazón visual del editor.*

**Objetivo**: Renderizar y editar componentes en el canvas.

**Tareas:**
1. Crear `components/editor/EditorCanvas.vue` — zona de renderizado de bloques
2. Crear el primer set de **Block Renderers**:
   - `blocks/BlockHeading.vue` — Título (H1-H6)
   - `blocks/BlockText.vue` — Párrafo con edición inline
   - `blocks/BlockImage.vue` — Imagen con selector de media
   - `blocks/BlockButton.vue` — Botón con link
   - `blocks/BlockSection.vue` — Contenedor/sección (padre de otros bloques)
3. Crear `components/editor/BlockWrapper.vue` — envuelve cualquier bloque con: borde de selección, toolbar de acciones (mover, duplicar, eliminar)
4. Implementar **selección de bloques**: click en el canvas → marca bloque activo en el estado

**Resultado esperado**: Los bloques se renderizan en el canvas y se pueden seleccionar.

---

### FASE 4 — Sidebar Izquierdo (Componentes & Drag)
> *La paleta de herramientas.*

**Objetivo**: Drag & drop de componentes desde el sidebar al canvas.

**Tareas:**
1. Crear `components/editor/LeftSidebar.vue` con tabs:
   - **Componentes**: Grid de bloques arrastrables (Título, Texto, Imagen, Botón, etc.)
   - **Configuración de Página**: Slug URL, indexación SEO, metadatos (título SEO, descripción)
2. Implementar drag & drop (usando `@vueuse/core` o HTML Drag API nativa o `vue-draggable`)
3. Drop zones en el canvas: indicadores visuales de dónde caerá el bloque
4. Al soltar un componente → se agrega al árbol de bloques en el estado Pinia

**Resultado esperado**: Arrastrar un "Título" al canvas lo agrega y se puede ver.

---

### FASE 5 — Panel de Propiedades (Inspector)
> *El inspector vive en el sidebar derecho, aprovechando el F-Pattern: diseño a la izquierda, control a la derecha.*

**Objetivo**: Al seleccionar un bloque en el canvas, el sidebar derecho activa la tab "Propiedades" y muestra un formulario dinámico para editar ese bloque.

**Tareas:**
1. Ampliar `components/editor/RightSidebar.vue` con **dos tabs**:
   - **☰ Capas**: árbol de bloques (Layer Tree, ya construido en Fase 6)
   - **✏ Propiedades**: formulario dinámico según el tipo de bloque seleccionado
2. Al hacer click en un bloque del canvas → activar tab "Propiedades" automáticamente
3. Al hacer **doble click en una capa** del Layer Tree → activar tab "Propiedades" del bloque correspondiente
4. Crear Property Panels por tipo de bloque:
   - `panels/HeadingPanel.vue` — texto, nivel (H1-H6), alineación
   - `panels/TextPanel.vue` — texto, tipografía básica
   - `panels/ImagePanel.vue` — URL/media, alt text, dimensiones
   - `panels/ButtonPanel.vue` — texto, link, variante, color
5. Conexión bidireccional: cambiar propiedad → actualiza el canvas en tiempo real via Pinia

**Resultado esperado**: Click en un bloque → sidebar derecho muestra sus propiedades editables; doble click en capa hace lo mismo.

---

### FASE 6 — Layer Tree (Árbol de Capas)
> *La navegación jerárquica del contenido. Se construye antes que las Propiedades porque ambas viven en el mismo sidebar.*

**Objetivo**: Crear el `RightSidebar.vue` con el árbol de capas como tab principal.

**Tareas:**
1. Crear `components/editor/RightSidebar.vue` con estructura de tabs (preparado para Fase 5):
   - Tab **☰ Capas**: árbol recursivo de bloques (activa en esta fase)
   - Tab **✏ Propiedades**: placeholder vacío (se implementa en Fase 5)
2. Toggle del sidebar derecho desde el icono `☰ Layers` en el header (ya posicionado en Fase 1)
3. Árbol recursivo con `LayerItem.vue` — componente recursivo para bloques con `children`
4. Reordenamiento por drag dentro del árbol
5. Acciones inline por capa: visibilidad (ojo), bloquear (candado), eliminar (papelera)
6. Highlight bidireccional: hover en capa → highlight en canvas, y viceversa

**Resultado esperado**: El sidebar derecho muestra el árbol de capas, es toggleable desde el header, y refleja en tiempo real la estructura del canvas.

---

### FASE 7 — Auto-Save & Experiencia de Persistencia
> *El esquema DB y los endpoints base se crean en Fase 2. Aquí hacemos la experiencia de guardado fluida.*

**Objetivo**: El editor guarda automáticamente y da feedback claro al usuario sobre el estado del guardado.

**Tareas:**
1. Auto-save con debounce (ej: 3 segundos después del último cambio detectado en el store)
2. Guardado manual explícito con botón "Guardar" en el header
3. Indicador de estado en el header: `"✓ Guardado"`, `"Guardando..."`, `"● Cambios sin guardar"`
4. Manejo de errores de red: toast de error + reintento automático
5. **[DB]** Si se requieren campos adicionales para estado de publicación (`published_at`, `draft_body_json`), crear migración incremental en esta fase

**Resultado esperado**: El trabajo se guarda automáticamente; recargar la página restaura el estado exacto.

---

### FASE 8 — Renderizado Frontend (Catch-All)
> *El producto final visible para los visitantes del sitio.*

**Objetivo**: La página publicada renderiza los bloques en el frontend.

**Tareas:**
1. Actualizar `pages/[...slug].vue` para procesar `body_json`
2. Crear `components/renderer/BlockRenderer.vue` — componente recursivo que mapea `type → componente Vue`
3. Los componentes de renderizado NO tienen lógica de edición (solo presentación)
4. SSR-friendly: el renderizado debe funcionar con Nuxt SSR

**Resultado esperado**: La página publicada se ve correctamente en el frontend.

---

### FASE 9 — Edición Inline & UX Avanzada
> *Los detalles que marcan la diferencia.*

**Objetivo**: Experiencia de edición fluida y pro.

**Tareas:**
1. Edición inline de textos en el canvas (contenteditable o Tiptap)
2. Selector de viewport en el header: Desktop/Tablet/Móvil (cambia ancho del canvas)
3. Vista Previa: modo read-only del canvas con la apariencia final
4. Keyboard shortcuts: Delete para eliminar, Ctrl+Z para undo
5. Colaboración (placeholder UI ya presente en el diseño, backend en el futuro)

---

### FASE 10 — Componentes Avanzados & Sistema de Bloques
> *Expandir la biblioteca de componentes.*

**Objetivo**: Añadir más tipos de bloques y Templates.

**Tareas:**
1. Más tipos: `BlockVideo`, `BlockDivider`, `BlockColumns`, `BlockHero`, `BlockCards`
2. Templates: secciones pre-construidas que se insertan completas
3. Global Styles: tipografía y colores del sitio
4. Importar/exportar página como JSON

---

## 🔑 Decisiones de Arquitectura Clave

| Decisión | Elección | Razón |
|---|---|---|
| Estado global | `useState` de Nuxt (o Pinia si se instala) | Reactivo y SSR-safe |
| Drag & Drop | `@vueuse/gesture` o HTML Drag API | Peso mínimo, nativo |
| Edición de texto | `contenteditable` basic → Tiptap en Fase 9 | Progresivo |
| Modelo de datos | Árbol de `Block` serializado como JSON | Flexible y extensible |
| Renderizado frontend | Componente recursivo `BlockRenderer` | Sin duplicar lógica |
| Migración DB | Drizzle `body_json TEXT` en tabla contents | Sin romper lo existente |

---

## 📅 Secuencia Recomendada de Sprints

```
Sprint 1:  Fase 1 (Shell)          → Header + Layout tri-panel vacío
Sprint 2:  Fase 2 (Estado)         → Pinia store + interfaces TS + DB schema inicial
Sprint 3:  Fase 3 (Canvas)         → Renderizado de bloques base
Sprint 4:  Fase 4 (Sidebar Izq.)   → Drag & Drop de componentes al canvas
Sprint 5:  Fase 6 (Layer Tree)     → RightSidebar + árbol de capas
Sprint 6:  Fase 5 (Propiedades)    → Tab de propiedades en RightSidebar + property panels
Sprint 7:  Fase 7 (Auto-Save)      → Guardado automático + indicadores de estado
Sprint 8:  Fase 8 (Frontend SSR)   → Renderizado visitante con BlockRenderer
Sprint 9+: Fases 9 & 10            → UX avanzada + más componentes y templates
```

> **Nota**: Fase 6 (Layer Tree) va antes que Fase 5 (Propiedades) porque ambas viven en `RightSidebar.vue`.
> Construir el contenedor primero y luego añadir funcionalidad es más limpio que al revés.
