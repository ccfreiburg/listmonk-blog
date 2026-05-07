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
    listmonkUrl: process.env.LISTMONK_URL || 'http://ccfreiburg.lists.app:9000',
    listmonkApiUser: process.env.LISTMONK_API_USER || '',
    listmonkApiToken: process.env.LISTMONK_API_TOKEN || '',
    // Exposed to the browser
    public: {
      siteName: process.env.SITE_NAME || 'CCFreiburg Blog',
      siteDescription: process.env.SITE_DESCRIPTION || 'News and updates from CCFreiburg.',
    },
  },

  nitro: {
    preset: 'node-server',
  },

  compatibilityDate: '2024-07-30',
})
