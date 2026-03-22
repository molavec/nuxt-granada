# 🏗️ Roadmap: Fase 2 - Estado Global del Editor (useEditorStore)

> **Contexto:** Esta es la planificación granular de la Fase 2 del Visual Editor de Granada. Está diseñada para que un agente de IA pueda tomar una tarea a la vez, ejecutarla, y verificarla sin perder contexto.
> **Instrucción para el LLM**: Si te han asignado esta planificación, ejecuta **SOLO UNA TAREA a la vez** en el orden establecido, avisando al usuario cuando termines cada una antes de pasar a la siguiente.

---

## 📋 Tarea 2.1: Definir tipos e interfaces (`src/runtime/types/editor.ts`)

**Objetivo**: Crear el modelo de datos estricto en TypeScript para los bloques y el estado del editor.

**Instrucciones**:
1. Crea el archivo `src/runtime/types/editor.ts` (si no existe crea la carpeta `types` primero).
2. Exporta el tipo `BlockType`: `'heading' | 'text' | 'image' | 'button' | 'section'`.
3. Exporta la interfaz `Block`:
   - `id: string` (UUID u ID único)
   - `type: BlockType`
   - `_version: number` (para migraciones futuras)
   - `props: Record<string, any>` (para almacenar contenido como texto, urls, estilos)
   - `children: Block[]` (para bloques anidados dentro de secciones)
4. Exporta la interfaz `EditorState`:
   - `blocks: Block[]`
   - `selectedBlockId: string | null`
   - `isDirty: boolean`
   - `viewportMode: 'desktop' | 'tablet' | 'mobile'`
   - `rightSidebarTab: 'layers' | 'properties'`

**Criterios de aceptación**: El archivo de tipos tiene sintaxis TypeScript correcta sin errores de linting.

---

## 📋 Tarea 2.2: Crear Store Global en Pinia (`src/runtime/stores/useEditorStore.ts`)

**Objetivo**: Establecer el estado global (el "cerebro" del editor) utilizando Pinia de Nuxt.

**Instrucciones**:
1. Instala `@pinia/nuxt` e inclúyelo en la configuración de módulos en `playground/nuxt.config.ts` o `src/module.ts` si no está configurado ya. *(Verifica esto primero probando una inicialización simple, aunque Nuxt 4 podría ya tenerlo preconfigurado en tu entorno).*
2. Crea el archivo `src/runtime/stores/useEditorStore.ts` (crea la carpeta `stores` si no existe).
3. Escribe un Pinia Store (usando Composition API / `defineStore` nativo):
   - Importa los tipos desde `~/types/editor` o con ruta relativa si hay problemas con el alias (ej. `../types/editor`).
   - Define el estado reactivo inicial (`blocks: []`, `selectedBlockId: null`, etc.).
   - Crea *actions* simples: `setBlocks(bloques)`, `addBlock(bloque)`, `updateBlock(id, nuevosDatos)`, `selectBlock(id)`, `setViewportMode(modo)`.
4. Añade un alias de importación directa a `src/module.ts` o asegúrate de que Nuxt de autocompletado en los componentes.

**Criterios de aceptación**: El store puede ser importado desde un componente (`const editorStore = useEditorStore()`) y no lanza errores.

---

## 📋 Tarea 2.3: Historial de Cambios / Undo-Redo (`src/runtime/composables/useEditorHistory.ts`)

**Objetivo**: Añadir soporte para deshacer y rehacer cambios en el estado de los bloques utilizando VueUse.

**Instrucciones**:
1. Asegúrate de que `@vueuse/nuxt` y `@vueuse/core` están instalados.
2. Crea el archivo `src/runtime/composables/useEditorHistory.ts`.
3. Implementa un composable que observe los cambios profundos en `editorStore.blocks`. 
   - Recomendación: usar la utilidad `useManualRefHistory` o `useRefHistory` de `@vueuse/core` apuntando a `storeToRefs(editorStore).blocks`.
4. Exporta las funciones `undo`, `redo`, y variables reactivas `canUndo`, `canRedo`.

**Criterios de aceptación**: Se pueden apilar cambios en el array de bloques y llamar a `undo()` revierte el estado.

---

## 📋 Tarea 2.4: Esquema de Base de Datos y Migración (`src/runtime/db/schema.ts`)

**Objetivo**: Preparar la tabla de contenidos para soportar el JSON serializado de los bloques.

**Instrucciones**:
1. Abre `src/runtime/db/schema.ts`.
2. En la tabla `content` (`sqliteTable('content', { ... })`), añade un nuevo campo:
   - `body_json: text('body_json')` (este contendrá en string JSON el array de bloques).
3. Ejecuta el generador de esquema: `pnpm db:generate`.
4. (Importante) Verifica el archivo SQL nuevo que se genera dentro de `drizzle/` para asegurar que está creando la nueva columna correctamente.
5. Ejecuta la migración contra la BD local: `pnpm db:push` o `pnpm db:migrate`.

**Criterios de aceptación**: La base de datos local SQLite incluye la columna `body_json` sin borrar los datos existentes.

---

## 📋 Tarea 2.5: Adaptar Endpoints de API al nuevo esquema

**Objetivo**: Permitir que el frontend guarde y recupere el arreglo de bloques interactuando con `/api/granada/content/:id`.

**Instrucciones**:
1. Edita `src/runtime/server/api/granada/content/[id].get.ts`:
   - Asegúrate de que retorne todos los campos incluyendo `body_json`. 
   - Si se retorna como texto, el frontend se encargará del `JSON.parse`.
2. Edita `src/runtime/server/api/granada/content/[id].put.ts`:
   - El endpoint debe aceptar el nuevo campo `body_json` en el body del request.
   - En la actualización (el `db.update(content)...`), asegúrate de que el campo `body_json` se está insertando.

**Criterios de aceptación**: Un GET request devuelve la nueva columna y un PUT request puede actualizar exitosamente el campo de texto JSON en la DB.

---

> **🎉 Al completar la Tarea 2.5:** La anatomía lógica del editor visual estará completamente definida y persistida, marcando el final definitivo de la Fase 2 y permitiéndonos en la Fase 3 empezar a renderizar visualmente los bloques en el Canvas.
