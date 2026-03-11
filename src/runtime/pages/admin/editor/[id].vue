<template>
  <GranadaAdminLayout>
    <div class="max-w-4xl mx-auto space-y-6">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <NuxtLink
            to="/admin/content"
            class="w-10 h-10 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:border-slate-300 hover:text-slate-900 transition-colors shadow-sm"
          >
            &larr;
          </NuxtLink>
          <h1 class="text-3xl font-bold tracking-tight">
            {{ isNew ? 'Create Content' : 'Edit Content' }}
          </h1>
        </div>
        <div class="flex gap-3">
          <button
            v-if="!isNew"
            class="px-5 py-2.5 rounded-2xl font-semibold text-red-600 hover:bg-red-50 transition-colors"
            @click="handleDelete"
          >
            Delete
          </button>
          <button
            :disabled="saving"
            class="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-6 py-2.5 rounded-2xl font-semibold shadow-sm transition-colors"
            @click="handleSave"
          >
            {{ saving ? 'Saving...' : 'Save Changes' }}
          </button>
        </div>
      </div>

      <div class="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-8 space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="space-y-2">
            <label class="block text-sm font-semibold text-slate-700">Title</label>
            <input
              v-model="form.title"
              type="text"
              class="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 outline-none transition-all placeholder:text-slate-400"
              placeholder="e.g. My Awesome Post"
            >
          </div>
          <div class="space-y-2">
            <label class="block text-sm font-semibold text-slate-700">Slug</label>
            <input
              v-model="form.slug"
              type="text"
              class="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 outline-none transition-all placeholder:text-slate-400"
              placeholder="e.g. my-awesome-post"
            >
          </div>
          <div class="space-y-2">
            <label class="block text-sm font-semibold text-slate-700">Content Type</label>
            <select
              v-model="form.content_type"
              class="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 outline-none transition-all"
            >
              <option value="page">
                Page
              </option>
              <option value="blog">
                Blog
              </option>
            </select>
          </div>
          <div class="space-y-2">
            <label class="block text-sm font-semibold text-slate-700">Status</label>
            <select
              v-model="form.status"
              class="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 outline-none transition-all"
            >
              <option value="draft">
                Draft
              </option>
              <option value="published">
                Published
              </option>
            </select>
          </div>
        </div>

        <div class="space-y-2 pt-4">
          <label class="block text-sm font-semibold text-slate-700">Body (Markdown)</label>
          <textarea
            v-model="form.body_markdown"
            rows="12"
            class="w-full px-4 py-4 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 outline-none transition-all font-mono text-sm resize-y"
            placeholder="# Write your markdown here..."
          />
        </div>
      </div>
    </div>
  </GranadaAdminLayout>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter, useFetch } from '#imports'
import GranadaAdminLayout from '../../../components/GranadaAdminLayout.vue'

const route = useRoute()
const router = useRouter()

const id = route.params.id
const isNew = computed(() => id === 'new')

const form = ref({
  title: '',
  slug: '',
  content_type: 'page',
  status: 'draft',
  body_markdown: '',
})

const saving = ref(false)

if (!isNew.value) {
  const { data } = await useFetch(`/api/granada/content/${id}`)
  if (data.value) {
    form.value = { ...data.value }
  }
}

// Auto slug generation
watch(() => form.value.title, (newTitle) => {
  if (isNew.value && !form.value.slug) {
    form.value.slug = newTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
  }
})

async function handleSave() {
  saving.value = true
  try {
    const url = isNew.value ? '/api/granada/content' : `/api/granada/content/${id}`
    const method = isNew.value ? 'POST' : 'PUT'

    await $fetch(url, {
      method,
      body: form.value,
    })

    router.push('/admin/content')
  }
  catch (err) {
    console.error('Failed to save', err)
    alert('Failed to save')
  }
  finally {
    saving.value = false
  }
}

async function handleDelete() {
  if (!confirm('Are you sure you want to delete this?')) return
  try {
    await $fetch(`/api/granada/content/${id}`, { method: 'DELETE' })
    router.push('/admin/content')
  }
  catch (err) {
    console.error('Failed to delete', err)
    alert('Failed to delete')
  }
}
</script>
