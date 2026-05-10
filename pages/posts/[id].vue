<template>
  <div>
    <div v-if="pending" class="flex justify-center py-20">
      <div class="h-8 w-8 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
    </div>

    <div v-else-if="error" class="text-center py-20 text-red-500">
      Post not found.
    </div>

    <article v-else-if="post" class="theme-card p-8 sm:p-12">
      <!-- Back link -->
      <NuxtLink to="/" class="inline-flex items-center gap-1 text-sm theme-link mb-8 font-medium">
        <span aria-hidden="true">&larr;</span> All posts
      </NuxtLink>

      <!-- Hero image -->
      <img
        v-if="heroImageUrl"
        :src="heroImageUrl"
        alt="Post hero"
        class="w-full rounded-2xl mb-8 border theme-border"
      >

      <!-- Meta -->
      <div class="flex flex-wrap items-center gap-2 text-xs theme-muted font-medium uppercase tracking-wide mb-4">
        <time :datetime="date">{{ formattedDate }}</time>
        <template v-if="post.tags?.length">
          <span>&middot;</span>
          <span v-for="tag in post.tags" :key="tag" class="theme-tag rounded px-2 py-0.5 normal-case">
            {{ tag }}
          </span>
        </template>
      </div>

      <!-- Title -->
      <h1 class="text-3xl font-bold theme-text mb-8 leading-snug">
        {{ post.subject || post.title }}
      </h1>

      <!-- Body -->
      <div class="prose max-w-none theme-prose" v-html="sanitizedBody" />
    </article>
  </div>
</template>

<script setup lang="ts">
const config = useRuntimeConfig()
const route = useRoute()
const id = route.params.id as string

const { data: post, pending, error } = await useFetch(`/api/posts/${id}`)

useHead(() => ({
  title: post.value ? (post.value.subject || post.value.title) : 'Post',
}))

const date = computed(() => post.value?.sentAt || post.value?.createdAt || '')

const formattedDate = computed(() =>
  date.value
    ? new Date(date.value).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : ''
)

  const heroImageUrl = computed(() => config.public.heroImageUrl || '')

// The body comes from a trusted source (our own listmonk instance),
// but we still serve it as-is since it is newsletter HTML intentionally.
const sanitizedBody = computed(() => post.value?.body ?? '')
</script>
