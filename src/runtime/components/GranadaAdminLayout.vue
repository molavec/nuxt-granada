<template>
  <div class="min-h-screen bg-slate-50 text-slate-800 font-sans flex">
    <Head>
      <Link
        href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />
      <Style>
        body { font-family: 'Plus Jakarta Sans', sans-serif; }
      </Style>
    </Head>

    <!-- Sidebar -->
    <aside class="fixed top-0 left-0 h-screen w-48 bg-white border-r border-slate-200 shadow-sm z-20 flex flex-col">
      <div class="p-4 pb-2">
        <!-- Logo Area -->
        <div class="flex items-center gap-3 px-1 mt-1">
          <div class="w-8 h-8 rounded-lg bg-granada-600 text-white flex items-center justify-center font-bold text-base shadow-sm shadow-granada-200">
            G
          </div>
          <span class="font-bold text-lg tracking-tight text-slate-900">Granada</span>
        </div>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 px-3 py-4 space-y-1 relative mt-1">
        <NuxtLink
          to="/admin"
          class="flex items-center gap-3 px-3 py-1.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
          active-class="bg-slate-100 text-slate-900 shadow-sm font-semibold"
        >
          <div class="w-4 h-4 i-lucide-layout-dashboard opacity-75" />
          Dashboard
        </NuxtLink>
        <NuxtLink
          to="/admin/content"
          class="flex items-center gap-3 px-3 py-1.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
          active-class="bg-slate-100 text-slate-900 shadow-sm font-semibold"
        >
          <div class="w-4 h-4 i-lucide-file-text opacity-75" />
          Content
        </NuxtLink>
        <NuxtLink
          to="/admin/modules"
          class="flex items-center gap-3 px-3 py-1.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
          active-class="bg-slate-100 text-slate-900 shadow-sm font-semibold"
        >
          <div class="w-4 h-4 i-lucide-package opacity-75" />
          Modules
        </NuxtLink>
        <NuxtLink
          to="/admin/settings"
          class="flex items-center gap-3 px-3 py-1.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
          active-class="bg-slate-100 text-slate-900 shadow-sm font-semibold"
        >
          <div class="w-4 h-4 i-lucide-settings opacity-75" />
          Settings
        </NuxtLink>
      </nav>

      <div class="p-4 border-t border-slate-100">
        <div class="text-xs text-slate-400 font-medium px-2 py-1">
          Granada Core v0.0.1
        </div>
      </div>
    </aside>

    <!-- Main Content Area -->
    <div class="flex-1 ml-56 flex flex-col min-h-screen">
      <!-- Top Header -->
      <header class="bg-white/80 backdrop-blur-md border-b border-slate-200/60 sticky top-0 z-10 w-full h-16 flex items-center px-8 justify-end">
        <a
          href="/"
          target="_blank"
          class="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors text-sm font-semibold"
        >
          View Site <span class="i-lucide-external-link w-4 h-4 ml-1" />
        </a>
      </header>

      <!-- Page Content Slot -->
      <main class="flex-1 p-8 max-w-5xl mx-auto w-full pb-24">
        <slot />
      </main>
    </div>
  </div>
</template>
