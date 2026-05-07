<template>
  <article
    class="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow flex flex-col gap-2"
  >
    <div class="flex items-center gap-2 text-xs text-gray-400 font-medium uppercase tracking-wide">
      <time :datetime="date">{{ formattedDate }}</time>
      <template v-if="post.tags?.length">
        <span>&middot;</span>
        <span v-for="tag in post.tags" :key="tag" class="bg-blue-50 text-blue-600 rounded px-2 py-0.5">
          {{ tag }}
        </span>
      </template>
    </div>

    <NuxtLink :to="`/posts/${post.id}`">
      <h2 class="text-xl font-semibold text-gray-900 hover:text-blue-600 transition-colors line-clamp-2">
        {{ post.subject || post.title }}
      </h2>
    </NuxtLink>

    <NuxtLink
      :to="`/posts/${post.id}`"
      class="mt-2 inline-flex items-center text-sm text-blue-600 hover:text-blue-800 font-medium gap-1"
    >
      Read more <span aria-hidden="true">&rarr;</span>
    </NuxtLink>
  </article>
</template>

<script setup lang="ts">
const props = defineProps<{
  post: {
    id: number
    title: string
    subject: string
    tags: string[]
    createdAt: string
    sentAt: string | null
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
