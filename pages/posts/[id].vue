<template>
  <div>
    <div v-if="pending" class="flex justify-center py-20">
      <div class="h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
    </div>

    <div v-else-if="error" class="text-center py-20 text-red-500">
      Post not found.
    </div>

    <article v-else-if="post" class="bg-white rounded-xl border border-gray-200 p-8 sm:p-12">
      <!-- Back link -->
      <NuxtLink to="/" class="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 mb-8 font-medium">
        <span aria-hidden="true">&larr;</span> All posts
      </NuxtLink>

      <!-- Meta -->
      <div class="flex flex-wrap items-center gap-2 text-xs text-gray-400 font-medium uppercase tracking-wide mb-4">
        <time :datetime="date">{{ formattedDate }}</time>
        <template v-if="post.tags?.length">
          <span>&middot;</span>
          <span v-for="tag in post.tags" :key="tag" class="bg-blue-50 text-blue-600 rounded px-2 py-0.5 normal-case">
            {{ tag }}
          </span>
        </template>
      </div>

      <!-- Title -->
      <h1 class="text-3xl font-bold text-gray-900 mb-8 leading-snug">
        {{ post.subject || post.title }}
      </h1>

      <!-- Body -->
      <div class="prose prose-gray max-w-none" v-html="sanitizedBody" />
    </article>
  </div>
</template>

<script setup lang="ts">
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

// The body comes from a trusted source (our own listmonk instance),
// but we still serve it as-is since it is newsletter HTML intentionally.
const sanitizedBody = computed(() => post.value?.body ?? '')
</script>
