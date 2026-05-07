<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <!-- Navigation -->
    <header class="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
      <div class="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
        <NuxtLink to="/" class="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors">
          {{ config.public.siteName }}
        </NuxtLink>
        <NuxtLink
          to="/#subscribe"
          class="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
        >
          Subscribe
        </NuxtLink>
      </div>
    </header>

    <!-- Page content -->
    <main class="flex-1 max-w-3xl mx-auto w-full px-4 py-10">
      <NuxtPage />
    </main>

    <!-- Footer -->
    <footer class="border-t border-gray-200 bg-white mt-10">
      <div class="max-w-3xl mx-auto px-4 py-6 text-center text-sm text-gray-500">
        {{ config.public.siteName }} &mdash; Powered by
        <a href="https://listmonk.app" class="underline hover:text-gray-700" target="_blank" rel="noopener">listmonk</a>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
const config = useRuntimeConfig()

useHead({
  titleTemplate: (title) => title ? `${title} | ${config.public.siteName}` : config.public.siteName,
  meta: [
    { name: 'description', content: config.public.siteDescription },
  ],
})
</script>
