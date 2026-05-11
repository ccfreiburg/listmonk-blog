export default defineNuxtConfig({
  modules: ['@nuxtjs/tailwindcss'],
  css: ['~/assets/css/main.css'],

  tailwindcss: {
    config: {
      safelist: [{ pattern: /^prose/ }],
      plugins: [require('@tailwindcss/typography')],
      theme: {
        extend: {
          typography: {
            DEFAULT: { css: { maxWidth: '100%' } },
          },
        },
      },
    },
  },
  runtimeConfig: {
    // Server-only – never exposed to the browser
    listmonkUrl: process.env.NUXT_LISTMONK_URL || process.env.LISTMONK_URL || 'http://localhost:9000',
    listmonkApiUser: process.env.NUXT_LISTMONK_API_USER || process.env.LISTMONK_API_USER || process.env.LISTMONK_USER || '',
    listmonkApiToken: process.env.NUXT_LISTMONK_API_TOKEN || process.env.LISTMONK_API_TOKEN || process.env.LISTMONK_PASSWORD || '',
    // Exposed to the browser
    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || process.env.SITE_URL || '',
      siteName: process.env.NUXT_PUBLIC_SITE_NAME || process.env.SITE_NAME || 'Blog',
      siteDescription: process.env.NUXT_PUBLIC_SITE_DESCRIPTION || process.env.SITE_DESCRIPTION || 'News and Updates',
      authorName: process.env.NUXT_PUBLIC_AUTHOR_NAME || process.env.AUTHOR_NAME || 'Team',
      authorRole: process.env.NUXT_PUBLIC_AUTHOR_ROLE || process.env.AUTHOR_ROLE || 'Newsletter Author',
      authorAvatarUrl: process.env.NUXT_PUBLIC_AUTHOR_AVATAR_URL || process.env.AUTHOR_AVATAR_URL || '',
      heroImageUrl: process.env.NUXT_PUBLIC_HERO_IMAGE_URL || process.env.HERO_IMAGE_URL || '',
    },
  },

  nitro: {
    preset: 'node-server',
  },

  compatibilityDate: '2024-07-30',
})
