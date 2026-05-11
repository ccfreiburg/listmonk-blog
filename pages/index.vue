<template>
  <div>
    <div v-if="pending" class="flex justify-center py-20">
      <div class="h-8 w-8 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin"></div>
    </div>

    <div v-else-if="error" class="text-center py-20 text-red-500">
      Failed to load posts. Please try again later.
    </div>

    <template v-else>
      <!-- Hero -->
      <section class="theme-card relative overflow-hidden mb-10 p-8 sm:p-10">
        <div class="hero-orb w-72 h-72 -top-24 -left-20"></div>
        <div class="hero-orb w-60 h-60 -bottom-24 -right-16"></div>

        <div class="relative grid grid-cols-1 md:grid-cols-[1.35fr_0.65fr] gap-8 items-center">
          <div>
            <p class="uppercase tracking-[0.18em] text-xs font-semibold theme-muted mb-3">Newsletter</p>
            <h1 class="text-4xl sm:text-5xl font-black leading-tight theme-text">
              Gods Work in Freiburg Germany
            </h1>
            <p class="mt-4 text-base sm:text-lg theme-muted max-w-2xl">
              Encouragements, updates, prayer requests and more from Calvary Chapel Freiburg, Germany. Stay informed about what God is doing in our church and our country. Be encouraged to pray, give, go.
            </p>

            <div class="mt-7 flex flex-wrap gap-3">
              <NuxtLink to="/#subscribe" class="theme-button rounded-lg px-5 py-2.5 font-semibold text-sm">
                Subscribe
              </NuxtLink>
              <NuxtLink
                :to="latestPostLink"
                class="theme-input rounded-lg px-5 py-2.5 font-semibold text-sm theme-link"
              >
                Read latest post
              </NuxtLink>
              <a
                href="/rss.xml"
                class="theme-input inline-flex h-11 w-11 items-center justify-center rounded-lg theme-link"
                type="application/rss+xml"
                aria-label="RSS Feed"
                title="RSS Feed"
              >
                <svg aria-hidden="true" viewBox="0 0 24 24" class="h-5 w-5 fill-current">
                  <circle cx="6" cy="18" r="2.2" />
                  <path d="M4 10.5a9.5 9.5 0 0 1 9.5 9.5h-3A6.5 6.5 0 0 0 4 13.5v-3Z" />
                  <path d="M4 4a16 16 0 0 1 16 16h-3A13 13 0 0 0 4 7V4Z" />
                </svg>
              </a>
            </div>


          </div>

          <div class="flex flex-col items-center gap-2 md:items-end">
            <AuthorAvatar :size="160" />
            <p class="font-semibold theme-text text-sm">{{ config.public.authorName }}</p>
            <p class="text-xs theme-muted text-right">{{ config.public.authorRole }}</p>
          </div>
          </div>
        </section>

      <!-- Posts grid -->
      <div v-if="postsSorted?.length" class="flex flex-col gap-6 mb-14">
        <PostCard v-for="post in postsSorted" :key="post.id" :post="post" />
      </div>
      <div v-else class="text-center py-16 theme-muted">
        No posts yet — check back soon!
      </div>

      <!-- Subscribe section -->
      <SubscribeForm />
    </template>
  </div>
</template>

<script setup lang="ts">
const config = useRuntimeConfig()

useHead(() => ({
  title: config.public.siteName,
  link: [
    {
      rel: 'alternate',
      type: 'application/rss+xml',
      title: `${config.public.siteName} RSS Feed`,
      href: '/rss.xml',
    },
  ],
}))

const { data: feedItems, pending, error } = await useFetch('/api/feed')

const postsSorted = computed(() => {
  if (!feedItems.value) return []
  return [...feedItems.value].sort((a, b) => {
    const dateA = new Date(a.sentAt || a.createdAt).getTime()
    const dateB = new Date(b.sentAt || b.createdAt).getTime()
    return dateB - dateA
  })
})

const latestPostLink = computed(() => postsSorted.value?.[0]?.url || '/#subscribe')
</script>
