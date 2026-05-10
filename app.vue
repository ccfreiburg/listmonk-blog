<template>
  <div class="min-h-screen theme-bg theme-text flex flex-col">
    <!-- Navigation -->
    <header class="theme-card sticky top-0 z-10" style="border-radius: 0; box-shadow: none; border-left: 0; border-right: 0; border-top: 0;">
      <div class="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
        <NuxtLink to="/" class="text-xl font-bold theme-text theme-link transition-colors">
          {{ config.public.siteName }}
        </NuxtLink>
        <div class="flex items-center gap-4">
          <NuxtLink
            to="/#subscribe"
            class="text-sm font-medium theme-link transition-colors"
          >
            Subscribe
          </NuxtLink>
          <button
            type="button"
            class="p-2 rounded-lg theme-input hover:bg-opacity-75 transition-colors"
            @click="toggleTheme"
            :aria-label="themeLabel"
          >
            <!-- Sun icon (shown in dark mode) -->
            <svg
              v-if="theme === 'dark'"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="w-5 h-5"
            >
              <circle cx="12" cy="12" r="5"></circle>
              <line x1="12" y1="1" x2="12" y2="3"></line>
              <line x1="12" y1="21" x2="12" y2="23"></line>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
              <line x1="1" y1="12" x2="3" y2="12"></line>
              <line x1="21" y1="12" x2="23" y2="12"></line>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
            </svg>

            <!-- Moon icon (shown in light mode) -->
            <svg
              v-else
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="w-5 h-5"
            >
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </svg>
          </button>
        </div>
      </div>
    </header>

    <!-- Page content -->
    <main class="flex-1 max-w-3xl mx-auto w-full px-4 py-10">
      <NuxtPage />
    </main>

    <!-- Footer -->
    <footer class="border-t theme-border theme-card mt-10" style="border-radius: 0; box-shadow: none; border-left: 0; border-right: 0; border-bottom: 0;">
      <div class="max-w-3xl mx-auto px-4 py-7 text-sm theme-muted">
        <div class="flex items-center gap-3 mb-4">
          <AuthorAvatar :size="44" />
          <div>
            <p class="font-semibold theme-text text-sm">{{ config.public.authorName }}</p>
            <p class="text-xs theme-muted">{{ config.public.authorRole }}</p>
          </div>
        </div>
        {{ config.public.siteName }} &mdash; Powered by
        <a href="https://listmonk.app" class="underline theme-link" target="_blank" rel="noopener">listmonk</a>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
const config = useRuntimeConfig()
const theme = useState<'light' | 'dark'>('theme', () => 'light')

const themeLabel = computed(() => theme.value === 'dark' ? 'Light mode' : 'Dark mode')

function applyTheme(value: 'light' | 'dark') {
  if (process.client) {
    document.documentElement.setAttribute('data-theme', value)
  }
}

function toggleTheme() {
  theme.value = theme.value === 'dark' ? 'light' : 'dark'
}

onMounted(() => {
  const saved = localStorage.getItem('theme') as 'light' | 'dark' | null
  if (saved === 'dark' || saved === 'light') {
    theme.value = saved
  } else {
    theme.value = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }
  applyTheme(theme.value)
})

watch(theme, (value) => {
  applyTheme(value)
  if (process.client) {
    localStorage.setItem('theme', value)
  }
})

useHead({
  titleTemplate: (title) => title ? `${title} | ${config.public.siteName}` : config.public.siteName,
  meta: [
    { name: 'description', content: config.public.siteDescription },
  ],
})
</script>
