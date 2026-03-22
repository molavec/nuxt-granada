<!-- eslint-disable vue/multi-word-component-names -->
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

    <!-- Main Content Area -->
    <div class="flex-1 flex flex-col min-h-screen">
      <header class="bg-white/80 backdrop-blur-md border-b border-slate-200/60 sticky top-0 z-10 w-full h-16 flex items-center px-8 justify-end">
        <a
          href="/admin"
          class="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors text-sm font-semibold"
        >
          Back to Admin <span class="i-lucide-arrow-left w-4 h-4 ml-1" />
        </a>
      </header>
      <!-- Page Content Slot -->
      <main class="flex-1 p-8 max-w-5xl mx-auto w-full pb-24">
        <slot />
      </main>
    </div>
  </div>
</template>
