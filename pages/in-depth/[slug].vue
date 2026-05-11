<template>
  <div>
    <div v-if="pending" class="flex justify-center py-20">
      <div class="h-8 w-8 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin"></div>
    </div>

    <div v-else-if="error" class="text-center py-20 text-red-500">
      Article not found.
    </div>

    <article v-else-if="article" class="theme-card p-8 sm:p-12">
      <NuxtLink to="/" class="inline-flex items-center gap-1 text-sm theme-link mb-8 font-medium">
        <span aria-hidden="true">&larr;</span> All updates
      </NuxtLink>

      <img
        v-if="article.image"
        :src="article.image"
        :alt="article.title"
        class="w-full rounded-2xl mb-8 border theme-border"
      >

      <div class="flex flex-wrap items-center gap-2 text-xs theme-muted font-medium uppercase tracking-wide mb-4">
        <span class="theme-tag rounded-full px-2.5 py-1">In-Depth</span>
        <time :datetime="articleDate">{{ formattedDate }}</time>
        <template v-if="article.tags?.length">
          <span>&middot;</span>
          <span v-for="tag in article.tags" :key="tag" class="theme-tag rounded px-2 py-0.5 normal-case">
            {{ tag }}
          </span>
        </template>
      </div>

      <h1 class="text-3xl sm:text-4xl font-black leading-tight theme-text mb-4">
        {{ article.title }}
      </h1>

      <p v-if="article.summary" class="theme-muted mb-8 text-base sm:text-lg">
        {{ article.summary }}
      </p>

      <div class="prose max-w-none theme-prose" v-html="article.body"></div>
    </article>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const slug = route.params.slug as string

const { data: article, pending, error } = await useFetch(`/api/in-depth/${slug}`)

useHead(() => ({
  title: article.value ? article.value.title : 'In-Depth Article',
}))

const articleDate = computed(() => article.value?.sentAt || article.value?.createdAt || '')

const formattedDate = computed(() =>
  articleDate.value
    ? new Date(articleDate.value).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : ''
)
</script>
