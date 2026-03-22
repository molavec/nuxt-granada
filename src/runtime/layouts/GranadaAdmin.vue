<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="min-h-screen bg-slate-50 text-slate-800 font-sans flex">
    <Head>
      <Link
        href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap"
        rel="stylesheet"
      />
      <Style>
        body { font-family: 'Plus Jakarta Sans', sans-serif; background-color: #f8fafc; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
      </Style>
    </Head>

    <!-- Sidebar -->
    <aside class="fixed top-0 left-0 h-screen w-64 bg-white border-r border-slate-200 z-20 flex flex-col shrink-0">
      <!-- Logo Header -->
      <div class="h-20 flex items-center px-6">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-lg bg-granada-500 flex items-center justify-center text-white font-bold text-sm shadow-sm">
            G
          </div>
          <span class="font-bold text-lg tracking-tight text-slate-500">Granada</span>
        </div>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        <NuxtLink
          v-for="item in menuItems"
          :key="item.to"
          :to="item.to"
          class="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-all duration-200"
          active-class="bg-slate-100 font-semibold text-slate-900"
          :exact="item.exact"
        >
          <Icon
            :name="item.icon"
            class="text-lg shrink-0 text-slate-400"
            :class="{ 'text-granada-500': $route.path === item.to || (!item.exact && $route.path.startsWith(item.to) && item.to !== '/admin') }"
          />
          {{ item.label }}
        </NuxtLink>
      </nav>

      <!-- Footer Sidebar -->
      <div class="p-6 border-t border-slate-100">
        <span class="text-[11px] font-semibold text-slate-400 tracking-wider">
          Granada Core v0.0.1
        </span>
      </div>
    </aside>

    <!-- Main Content Area -->
    <div class="flex-1 ml-64 flex flex-col min-h-screen">
      <!-- Top Header -->
      <header class="h-20 px-10 flex items-center justify-between shrink-0">
        <div class="flex-1" />
        <div class="flex items-center gap-4">
          <a
            href="/"
            target="_blank"
            class="px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all shadow-sm flex items-center gap-2 group"
          >
            View Site
            <Icon
              name="ph:arrow-up-right-bold"
              class="text-slate-400 group-hover:text-slate-600 transition-colors"
            />
          </a>
        </div>
      </header>

      <!-- Page Content Slot -->
      <main class="flex-1 overflow-y-auto p-10 pt-4 pb-24">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
const menuItems = [
  { to: '/admin', label: 'Dashboard', icon: 'ph:chart-pie-slice-duotone', exact: true },
  { to: '/admin/content', label: 'Content', icon: 'ph:files-duotone', exact: false },
  { to: '/admin/modules', label: 'Modules', icon: 'ph:cube-focus-duotone', exact: false },
  { to: '/admin/settings', label: 'Settings', icon: 'ph:gear-six-duotone', exact: false },
]
</script>
