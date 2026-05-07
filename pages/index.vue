<template>
  <div>
    <div v-if="pending" class="flex justify-center py-20">
      <div class="h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
    </div>

    <div v-else-if="error" class="text-center py-20 text-red-500">
      Failed to load posts. Please try again later.
    </div>

    <template v-else>
      <!-- Header -->
      <div class="mb-10">
        <h1 class="text-3xl font-bold text-gray-900">{{ config.public.siteName }}</h1>
        <p class="mt-2 text-gray-500">{{ config.public.siteDescription }}</p>
      </div>

      <!-- Posts grid -->
      <div v-if="posts?.length" class="flex flex-col gap-6 mb-14">
        <PostCard v-for="post in posts" :key="post.id" :post="post" />
      </div>
      <div v-else class="text-center py-16 text-gray-400">
        No posts yet — check back soon!
      </div>

      <!-- Subscribe section -->
      <SubscribeForm />
    </template>
  </div>
</template>

<script setup lang="ts">
const config = useRuntimeConfig()

useHead({ title: config.public.siteName })

const { data: posts, pending, error } = await useFetch('/api/posts')
</script>
