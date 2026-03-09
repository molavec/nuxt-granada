<template>
  <GranadaAdminLayout>
    <div class="max-w-3xl space-y-8">
      <div>
        <h1 class="text-3xl font-bold tracking-tight">
          Settings
        </h1>
        <p class="text-slate-500 mt-2">
          Manage global settings for Granada CMS.
        </p>
      </div>

      <div class="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-8 space-y-6">
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-semibold text-slate-700">Active Theme</label>
            <p class="text-slate-500 text-sm mt-1 mb-3">
              This determines the layout component that wraps your content dynamically.
            </p>
            <select
              v-model="form.active_theme"
              class="w-full md:w-1/2 px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 outline-none transition-all"
            >
              <option value="basic">
                Basic (Default)
              </option>
              <option value="saas">
                SaaS Gradient
              </option>
              <option value="minimal">
                Minimal Black & White
              </option>
            </select>
          </div>
        </div>

        <div class="pt-6 border-t border-slate-100 flex justify-end">
          <button
            :disabled="saving"
            class="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-8 py-2.5 rounded-2xl font-semibold shadow-sm transition-colors"
            @click="handleSave"
          >
            {{ saving ? 'Saving...' : 'Save Settings' }}
          </button>
        </div>
      </div>
    </div>
  </GranadaAdminLayout>
</template>

<script setup>
import { ref } from 'vue'
import { useFetch } from '#imports'
import GranadaAdminLayout from '../../components/GranadaAdminLayout.vue'

const form = ref({
  active_theme: 'basic',
})

const saving = ref(false)

const { data } = await useFetch('/api/granada/settings')
if (data.value) {
  form.value.active_theme = data.value.active_theme
}

async function handleSave() {
  saving.value = true
  try {
    await $fetch('/api/granada/settings', {
      method: 'PUT',
      body: form.value,
    })
    alert('Settings saved!')
  }
  catch (err) {
    console.error('Failed to save settings', err)
    alert('Failed to save')
  }
  finally {
    saving.value = false
  }
}
</script>
