# 🌍 Roadmap: Fase 8 - Renderizado Frontend (Catch-All)

> **Contexto:** En nuestra Fase 7, logramos guardar persistentemente en la Base de Datos un arreglo JSON con el árbol de "Blocks" de Granada. Ahora necesitamos consumir ese JSON para los visitantes regulares del sitio (sin inyectarles código pesado de edición, canvas, drag&drop, etc.).

---

## 📋 Tarea 8.1: Lógica de hidratación en `[...slug].vue`

**Objetivo**: Modificar nuestro Catch-All para que parsee el `body_json` servido desde la DB.

**Instrucciones**:
1. Abrir `src/runtime/pages/[...slug].vue`.
2. Extraer `page.body_json` si existe, y hacerle `JSON.parse`.
3. Proveer ese árbol de bloques a la plantilla principal.
4. *(Fallback)*: Si el JSON no existe pero `body_markdown` sí (contenido legacy de versiones crudas), pintar el Markdown. Si el JSON existe, priorizar el árbol visual.

---

## 📋 Tarea 8.2: Componente `GranadaRenderer.vue`

**Objetivo**: Construir un intérprete puro sin estado reactivo pesado, hecho a medida para el público y para optimización de motores de búsqueda (SSR natural).

**Instrucciones**:
1. Crear `src/runtime/components/renderer/GranadaRenderer.vue`.
2. Va a recibir como `prop` el arreglo `blocks: Block[]`.
3. Iterará sobre este arreglo importando dinámicamente o resolviendo los componentes nativos (Headings, Texts, Sections).
4. **Diferencia crítica con el Canvas**: Aquí NO usaremos `<BlockWrapper>` (no queremos bordes azules hover, ni toolbars, ni eventos focus). Renderizaremos los componentes Base que ya armamos en la Fase 3, pasándoles las `props` directamente y asegurando su recursividad en caso de las `BlockSection`.

---

## 📋 Tarea 8.3: Auditoría SEO y Sanitización HTML

**Objetivo**: Asegurar buenas prácticas en la rama SSR.

**Instrucciones**:
1. Revisar los warnings del Linter `v-html directive can lead to XSS attack` saltados en el `BlockText.vue` nativo y en el render del catch-all.
2. Comprobar que todos los headings dinámicos (`<h1>` a `<h6>`) tengan roles sintácticos puros.
3. Testear el renderizado lanzando el proyecto en una ventana de Incógnito apuntando a una página persistida.

---

> **🎉 Al completar la Fase 8:** El CMS estará "cerrado". Habrás creado un constructor (Backend) y un intérprete veloz (Frontend). El módulo podrá inyectarse en los Nuxt 4 del mundo para levantar sitios web a velocidad récord y 100% dinámicos en la nube (Turso).
