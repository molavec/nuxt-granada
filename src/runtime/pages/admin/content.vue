<template>
  <GranadaAdminLayout>
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold tracking-tight">Content</h1>
          <p class="text-slate-500 mt-2">Manage your pages and blog posts.</p>
        </div>
        <NuxtLink to="/admin/editor/new" class="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-2xl font-semibold shadow-sm transition-colors">
          Create New
        </NuxtLink>
      </div>

      <div class="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-50 border-b border-slate-100">
              <th class="py-4 px-6 font-semibold text-slate-600">Title</th>
              <th class="py-4 px-6 font-semibold text-slate-600">Type</th>
              <th class="py-4 px-6 font-semibold text-slate-600">Status</th>
              <th class="py-4 px-6 font-semibold text-slate-600 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="!content?.length" class="border-b border-slate-50 last:border-none">
              <td colspan="4" class="py-12 text-center text-slate-500">No content found. Create your first post!</td>
            </tr>
            <tr v-for="item in content" :key="item.id" class="border-b border-slate-50 last:border-none hover:bg-slate-50/50 transition-colors">
              <td class="py-4 px-6">
                <div class="font-medium text-slate-900">{{ item.title }}</div>
                <div class="text-sm text-slate-500">/{{ item.slug }}</div>
              </td>
              <td class="py-4 px-6 capitalize text-slate-600">{{ item.content_type }}</td>
              <td class="py-4 px-6">
                <span :class="[
                  'px-3 py-1 rounded-full text-xs font-medium capitalize',
                  item.status === 'published' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                ]">
                  {{ item.status }}
                </span>
              </td>
              <td class="py-4 px-6 text-right">
                <NuxtLink :to="`/admin/editor/${item.id}`" class="text-indigo-600 hover:text-indigo-800 font-medium px-4 py-2 hover:bg-indigo-50 rounded-xl transition-colors">
                  Edit
                </NuxtLink>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </GranadaAdminLayout>
</template>

<script setup>
import { useFetch } from '#imports';
import GranadaAdminLayout from '../../components/GranadaAdminLayout.vue';

const { data: content } = await useFetch('/api/granada/content');
</script>
