<template>
  <section id="subscribe" class="bg-white rounded-xl border border-gray-200 p-8">
    <h2 class="text-2xl font-bold text-gray-900 mb-1">Stay up to date</h2>
    <p class="text-gray-500 mb-6">Get new posts delivered straight to your inbox.</p>

    <form v-if="!submitted" @submit.prevent="submit" class="flex flex-col gap-4">
      <div class="flex flex-col sm:flex-row gap-3">
        <input
          v-model="name"
          type="text"
          placeholder="Your name (optional)"
          class="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          v-model="email"
          type="email"
          placeholder="you@example.com"
          required
          class="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <!-- List selection (shown only when there are multiple lists) -->
      <div v-if="availableLists.length > 1" class="flex flex-col gap-2">
        <p class="text-sm font-medium text-gray-700">Subscribe to:</p>
        <label
          v-for="list in availableLists"
          :key="list.id"
          class="flex items-center gap-2 text-sm text-gray-600 cursor-pointer"
        >
          <input
            type="checkbox"
            :value="list.id"
            v-model="selectedLists"
            class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          {{ list.name }}
        </label>
      </div>

      <p v-if="availableLists.length === 0" class="text-sm text-amber-700">
        No lists available yet. Ask the admin to create at least one list in listmonk.
      </p>
      <p v-if="error" class="text-sm text-red-600">{{ error }}</p>

      <button
        type="submit"
        :disabled="loading || availableLists.length === 0"
        class="self-start rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold px-6 py-2.5 text-sm transition-colors"
      >
        <span v-if="loading">Subscribing…</span>
        <span v-else>Subscribe</span>
      </button>
    </form>

    <div v-else class="flex items-center gap-3 text-green-700 bg-green-50 rounded-lg px-5 py-4">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
      </svg>
      <span class="font-medium">Thanks! You are subscribed.</span>
    </div>
  </section>
</template>

<script setup lang="ts">
const name = ref('')
const email = ref('')
const loading = ref(false)
const submitted = ref(false)
const error = ref('')
const selectedLists = ref<number[]>([])

const { data: lists } = await useFetch<Array<{ id: number; uuid: string; name: string }>>('/api/lists')
const availableLists = computed(() => lists.value ?? [])

// Pre-select all lists
watchEffect(() => {
  if (availableLists.value.length > 0 && selectedLists.value.length === 0) {
    selectedLists.value = availableLists.value.map((l) => l.id)
  }
})

async function submit() {
  error.value = ''
  if (selectedLists.value.length === 0 && availableLists.value.length > 0) {
    // Fallback in case list preselection hasn't run yet.
    selectedLists.value = availableLists.value.map((l) => l.id)
  }

  loading.value = true
  try {
    await $fetch('/api/subscribe', {
      method: 'POST',
      body: {
        email: email.value,
        name: name.value,
        list_ids: selectedLists.value,
      },
    })
    submitted.value = true
  } catch (e: any) {
    error.value = e?.data?.message ?? 'Something went wrong. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>
