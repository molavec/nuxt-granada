<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="h-screen overflow-hidden flex flex-col text-slate-800 font-sans bg-slate-50">
    <Head>
      <Link
        href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap"
        rel="stylesheet"
      />
      <Style>
        body { font-family: 'Plus Jakarta Sans', sans-serif; background-color: #f8fafc; overflow: hidden; }
        ::-webkit-scrollbar { width: 5px; height: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
      </Style>
    </Head>

    <!-- HEADER — zona fija superior -->
    <slot name="header" />

    <!-- CUERPO: 3 columnas -->
    <div class="flex flex-1 overflow-hidden">
      <!-- SIDEBAR IZQUIERDO -->
      <aside
        class="bg-white flex flex-col shrink-0 transition-all duration-300 overflow-hidden"
        :class="[
          showLeftSidebar ? 'w-72 border-r border-slate-200 opacity-100' : 'w-0 border-r-0 opacity-0',
          isMobile ? 'fixed inset-0 z-40 h-full shadow-2xl' : '',
        ]"
      >
        <div class="w-72 flex flex-col h-full shrink-0">
          <slot name="left-sidebar" />
        </div>
      </aside>

      <!-- CANVAS CENTRAL -->
      <main class="flex-1 bg-slate-100 overflow-y-auto scroll-smooth relative transition-all duration-300">
        <!-- Overlay oscuro en móvil cuando un sidebar está abierto -->
        <Transition name="fade">
          <div
            v-if="isMobile && (showLeftSidebar || showRightSidebar)"
            class="absolute inset-0 bg-black/40 z-30"
            @click="closeAllSidebars"
          />
        </Transition>

        <slot />
      </main>

      <!-- SIDEBAR DERECHO (Layers + Properties) -->
      <aside
        class="bg-white flex flex-col shrink-0 transition-all duration-300 overflow-hidden"
        :class="[
          showRightSidebar ? 'w-72 border-l border-slate-200 opacity-100' : 'w-0 border-l-0 opacity-0',
          isMobile ? 'fixed inset-y-0 right-0 z-40 h-full shadow-2xl' : '',
        ]"
      >
        <div class="w-72 flex flex-col h-full shrink-0">
          <slot name="right-sidebar" />
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, provide } from 'vue'

// ─── Estado de visibilidad de los sidebars ────────────────────
const showLeftSidebar = ref(true)
const showRightSidebar = ref(true)

// ─── Detección de viewport móvil ─────────────────────────────
const windowWidth = ref(typeof window !== 'undefined' ? window.innerWidth : 1280)
const isMobile = computed(() => windowWidth.value < 768)

function onResize() {
  windowWidth.value = window.innerWidth
}

onMounted(() => window.addEventListener('resize', onResize))
onUnmounted(() => window.removeEventListener('resize', onResize))

// En móvil, empezamos con sidebars ocultos
onMounted(() => {
  if (isMobile.value) {
    showLeftSidebar.value = false
    showRightSidebar.value = false
  }
})

function closeAllSidebars() {
  showLeftSidebar.value = false
  showRightSidebar.value = false
}

// ─── Provide al árbol de componentes ─────────────────────────
// Cualquier componente hijo (EditorHeader, sidebars) puede inyectar estos
provide('editorLayout', {
  showLeftSidebar,
  showRightSidebar,
  isMobile,
  toggleLeftSidebar: () => (showLeftSidebar.value = !showLeftSidebar.value),
  toggleRightSidebar: () => (showRightSidebar.value = !showRightSidebar.value),
  closeAllSidebars,
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
