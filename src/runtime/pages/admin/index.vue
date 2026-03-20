<template>
  <NuxtLayout>
    <div class="max-w-6xl mx-auto">
      <!-- Page Title -->
      <div class="mb-10">
        <h1 class="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
          Dashboard
        </h1>
        <p class="text-slate-500 text-sm font-medium">
          Welcome to your Granada CMS workspace.
        </p>
      </div>

      <!-- Cards Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">

        <!-- Card: Total Content -->
        <div class="bg-white rounded-3xl p-8 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] border border-slate-100 flex flex-col justify-between aspect-[4/3] hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.10)] transition-shadow duration-300">
          <h3 class="text-sm font-semibold text-slate-400 tracking-wide">
            Total Content
          </h3>
          <div class="mt-auto">
            <span class="text-6xl font-extrabold text-granada-500 tracking-tighter">
              {{ contentCount }}
            </span>
          </div>
        </div>

        <!-- Card: Active Theme -->
        <div class="bg-white rounded-3xl p-8 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] border border-slate-100 flex flex-col justify-between aspect-[4/3] hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.10)] transition-shadow duration-300">
          <h3 class="text-sm font-semibold text-slate-400 tracking-wide">
            Active Theme
          </h3>
          <div class="mt-auto">
            <span class="text-3xl font-bold text-slate-800 tracking-tight capitalize">
              {{ settings?.active_theme || 'Basic' }}
            </span>
          </div>
        </div>

        <!-- Card: Quick Action -->
        <div class="bg-granada-600 rounded-3xl p-8 shadow-lg shadow-granada-500/20 flex flex-col justify-between aspect-[4/3] relative overflow-hidden group">
          <!-- Subtle background decoration -->
          <div class="absolute -right-8 -top-8 w-32 h-32 bg-white opacity-5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />

          <h3 class="text-sm font-semibold text-white/80 tracking-wide relative z-10">
            Quick Action
          </h3>

          <div class="mt-auto relative z-10">
            <NuxtLink
              to="/admin/editor/new"
              class="w-fit px-5 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-sm font-bold text-white transition-all backdrop-blur-sm flex items-center gap-2"
            >
              <Icon name="ph:plus-bold" />
              Create New Post
            </NuxtLink>
          </div>
        </div>

      </div>
    </div>

    <!-- Floating Metrics Footer -->
    <div class="fixed bottom-6 left-1/2 -translate-x-1/2 z-30">
      <div class="bg-white/80 backdrop-blur-md border border-slate-200 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] rounded-full px-4 py-1.5 flex items-center gap-3 text-[10px] font-bold text-slate-400">
        <Icon name="ph:activity-bold" class="text-sm text-slate-400" />
        <span class="w-px h-3 bg-slate-200" />
        <span class="text-slate-500 tracking-wider">{{ responseTime }} ms</span>
        <span class="w-px h-3 bg-slate-200" />
        <Icon name="ph:crosshair-simple-bold" class="text-sm text-slate-400" />
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup>
definePageMeta({ layout: 'granada-admin' })

const startTime = Date.now()
const { data: content } = await useFetch('/api/granada/content')
const { data: settings } = await useFetch('/api/granada/settings')
const responseTime = Date.now() - startTime

const contentCount = computed(() => content.value?.length || 0)
</script>
