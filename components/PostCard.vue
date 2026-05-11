<template>
  <article
    :class="[
      'theme-card rounded-2xl p-6 sm:p-7 hover:-translate-y-0.5 hover:shadow-lg transition duration-200',
      hasImage ? 'grid md:grid-cols-3 gap-6 items-stretch' : 'flex flex-col gap-4'
    ]"
  >
    <div v-if="hasImage" class="post-card-media md:col-span-1">
      <img
        :src="post.image"
        :alt="post.title"
        class="post-card-media-image w-full h-48 md:h-full object-cover rounded-xl"
      >
    </div>

    <div :class="hasImage ? 'md:col-span-2 flex flex-col gap-4' : ''">
      <div class="relative flex items-center gap-2 flex-wrap">
        <span class="theme-tag rounded-full px-2.5 py-1 text-xs font-semibold uppercase tracking-wide">
          {{ post.kind === 'in-depth' ? 'In-Depth' : 'Newsletter' }}
        </span>
        <time
          :datetime="date"
          class="inline-flex items-center rounded-full py-1.5 text-sm font-bold tracking-wide theme-muted"
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

      <NuxtLink :to="post.url" class="group block">
        <h2 class="text-2xl font-extrabold leading-tight theme-text transition-colors line-clamp-2 group-hover:text-[var(--primary)]">
          {{ post.subject || post.title }}
        </h2>
      </NuxtLink>

      <p class="theme-muted text-sm leading-6 line-clamp-3">
        {{ post.excerpt || post.summary || 'Read the full update to see the latest encouragements, prayer requests, and ministry news.' }}
      </p>

      <NuxtLink
        :to="post.url"
        class="mt-auto inline-flex items-center text-sm font-semibold theme-link gap-1"
      >
        {{ post.kind === 'in-depth' ? 'More info' : 'Read more' }} <span aria-hidden="true">&rarr;</span>
      </NuxtLink>
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  post: {
    id: string | number
    kind?: 'newsletter' | 'in-depth'
    url: string
    title: string
    subject: string
    image?: string
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
const hasImage = computed(() => !!props.post.image)
</script>
