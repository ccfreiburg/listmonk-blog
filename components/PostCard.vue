<template>
  <article
    class="theme-card rounded-2xl p-6 sm:p-7 hover:-translate-y-0.5 hover:shadow-lg transition duration-200 flex flex-col gap-4"
  >
    <div class="relative flex items-center gap-2 flex-wrap">
      <time
        :datetime="date"
        class="inline-flex items-center rounded-full py-1.5 text-sm font-bold tracking-wide"
      >
        {{ formattedDate }}
      </time>
      <template v-if="post.tags?.length">
        <span class="theme-muted text-sm font-medium">&middot;</span>
        <span v-for="tag in post.tags" :key="tag" class="theme-tag rounded-full px-2.5 py-1 text-xs font-semibold uppercase tracking-wide">
          {{ tag }}
        </span>
      </template>
    </div>

    <NuxtLink :to="`/posts/${post.id}`" class="group block">
      <h2 class="text-2xl font-extrabold leading-tight theme-text transition-colors line-clamp-2 group-hover:text-[var(--primary)]">
        {{ post.subject || post.title }}
      </h2>
    </NuxtLink>

    <p class="theme-muted text-sm leading-6 line-clamp-3">
      {{ post.excerpt || post.summary || 'Read the full update to see the latest encouragements, prayer requests, and ministry news.' }}
    </p>

    <NuxtLink
      :to="`/posts/${post.id}`"
      class="mt-auto inline-flex items-center text-sm font-semibold theme-link gap-1"
    >
      Read more <span aria-hidden="true">&rarr;</span>
    </NuxtLink>
  </article>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  post: {
    id: number
    title: string
    subject: string
    tags: string[]
    createdAt: string
    sentAt: string | null
    excerpt?: string | null
    summary?: string | null
  }
}>()

const date = computed(() => props.post.sentAt || props.post.createdAt)
const formattedDate = computed(() =>
  new Date(date.value).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
)
</script>
