# 💾 Roadmap: Fase 7 - Auto-Save y Experiencia de Persistencia

> **Contexto:** Hasta ahora, el Granada Visual Editor funciona 100% en memoria del cliente a través del estado reactivo de Pinia. En esta fase convertiremos este prototipo de frontend en una aplicación de Grado de Producción real integrando el guardado bidireccional contra la base de datos SQLite (Drizzle) alojada en el backend `server/api/...`.

---

## 📋 Tarea 7.1: Botón de Guardado Manual y Emisión de Carga

**Objetivo**: Darle funcionalidad a los botones "Guardar" y "Publicar" ubicados en el `EditorHeader.vue` y enlazar la mutación PUT a nuestro backend.

**Instrucciones**:
1. Abrir `pages/admin/editor/[id].vue` (El controlador maestro).
2. Interceptar el evento `@save` que viene desde el layout/header.
3. Crear la función `saveContent()` que tome `store.blocks` y lo empaquete usando un `$fetch` (PUT) hacia `/api/granada/content/` enviándolo en el array asociado a `body_json`.
4. Manejar el estado del Loading prop para pasar un flag `isSaving` al `<GranadaEditorHeader>`.
5. Al volver un status `200 OK`, invocar `store.markSaved()` (que bajará la bandera `isDirty = false`).

---

## 📋 Tarea 7.2: Guardado Automático (Auto-Save) con Debounce

**Objetivo**: Reducir el estrés psicológico del usuario al asegurarse de que su trabajo se está guardando solo cada cierto tiempo.

**Instrucciones**:
1. Usando `@vueuse/core` (específicamente `watchDebounced` o configurando un debounce clásico con `setTimeout`).
2. Vigilar reactivamente en el controlador `[id].vue` cuando `store.isDirty` cambie a `true`.
3. Tras un silencio del usuario de **2000ms a 3000ms**, invocar automáticamente la función `saveContent()` desarrollada en la Tarea 7.1.

---

## 📋 Tarea 7.3: UX de Error de Red y Feedback (Toasts)

**Objetivo**: Si la conexión a internet cae o LibSQL (Turso) falla y el JSON no se puede escribir, hay que avisar de manera explícita sin destruir el progreso en memoria local.

**Instrucciones**:
1. Refinar de manera elegante la captura de errores `try...catch` en la llamada `$fetch`.
2. Como se ha integrado `@nuxt/ui` / Toast nativos de Nuxt si existe, despachar un mensaje visible al usuario (por ejemplo: "No se pudieron guardar los cambios. Reintentando...") o utilizar un pequeño popup.
3. Actualizar la variable reactiva temporal `lastSaved` para inyectarla en el `EditorHeader.vue` (que ya tiene la prop lista esperando un objeto Date) para que pinte `"Guardado hace 1 minuto"`.

---

## 📋 Tarea 7.4 (Bonus Opcional): Prevención de Pérdida de Datos (Unload Listener)

**Objetivo**: Prevenir que el usuario cierre la pestaña por error si `isDirty === true` y aún no se ejecutó el Auto-Guardado.

**Instrucciones**:
1. Registrar un listener global al evento `beforeunload`.
2. Si `store.isDirty` es verdadero, llamar a `event.preventDefault()` y `event.returnValue = ''` para que el navegador lance su cuadro de diálogo de advertencia estándar: ("Es posible que los cambios no se guarden").

---

> **🎉 Al completar la Fase 7:** El Visor podrá arrastrarse con el conocimiento de que nada se pierde. Nuxt 4, Pinia, VueUse y Drizzle ORM sincronizarán el JSON del DOM visual y la Base de Datos SQLite en perfecta armonía bidireccional.
