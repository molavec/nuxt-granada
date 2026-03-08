<template>
  <GranadaAdminLayout>
    <div class="space-y-8">
      <div>
        <h1 class="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p class="text-slate-500 mt-2">Welcome to your Granada CMS workspace.</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-white p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex flex-col justify-between h-40">
          <h3 class="text-slate-500 font-medium">Total Content</h3>
          <div class="text-4xl font-bold tracking-tight text-indigo-600">{{ contentCount }}</div>
        </div>
        
        <div class="bg-white p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex flex-col justify-between h-40">
          <h3 class="text-slate-500 font-medium">Active Theme</h3>
          <div class="text-2xl font-bold tracking-tight capitalize">{{ settings?.active_theme || 'Loading...' }}</div>
        </div>

        <div class="bg-gradient-to-br from-indigo-600 to-purple-600 p-6 rounded-3xl shadow-[0_8px_30px_rgb(99,102,241,0.2)] text-white flex flex-col justify-between h-40">
          <h3 class="text-white/80 font-medium">Quick Action</h3>
          <NuxtLink to="/admin/editor/new" class="inline-flex items-center text-lg font-semibold bg-white/20 hover:bg-white/30 backdrop-blur-sm w-fit px-4 py-2 rounded-2xl transition-colors">
            + Create New Post
          </NuxtLink>
        </div>
      </div>
    </div>
  </GranadaAdminLayout>
</template>

<script setup>
import { useFetch } from '#imports';
import GranadaAdminLayout from '../../components/GranadaAdminLayout.vue';

const { data: content } = await useFetch('/api/granada/content');
const { data: settings } = await useFetch('/api/granada/settings');

const contentCount = computed(() => content.value?.length || 0);
</script>
