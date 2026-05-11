# ── Build stage ────────────────────────────────────────────────────────────────
FROM node:22-alpine AS build
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

COPY . .
RUN npm run build

# ── Runtime stage ──────────────────────────────────────────────────────────────
FROM node:22-alpine
WORKDIR /app

COPY --from=build /app/.output .

ENV NUXT_HOST=0.0.0.0
ENV NUXT_PORT=3000

EXPOSE 3000
CMD ["sh", "-c", "export NUXT_LISTMONK_URL=\"${NUXT_LISTMONK_URL:-${LISTMONK_URL:-}}\" && export NUXT_LISTMONK_API_USER=\"${NUXT_LISTMONK_API_USER:-${LISTMONK_API_USER:-${LISTMONK_USER:-}}}\" && export NUXT_LISTMONK_API_TOKEN=\"${NUXT_LISTMONK_API_TOKEN:-${LISTMONK_API_TOKEN:-${LISTMONK_PASSWORD:-}}}\" && export NUXT_PUBLIC_SITE_URL=\"${NUXT_PUBLIC_SITE_URL:-${SITE_URL:-}}\" && export NUXT_PUBLIC_SITE_NAME=\"${NUXT_PUBLIC_SITE_NAME:-${SITE_NAME:-}}\" && export NUXT_PUBLIC_SITE_DESCRIPTION=\"${NUXT_PUBLIC_SITE_DESCRIPTION:-${SITE_DESCRIPTION:-}}\" && export NUXT_PUBLIC_AUTHOR_NAME=\"${NUXT_PUBLIC_AUTHOR_NAME:-${AUTHOR_NAME:-}}\" && export NUXT_PUBLIC_AUTHOR_ROLE=\"${NUXT_PUBLIC_AUTHOR_ROLE:-${AUTHOR_ROLE:-}}\" && export NUXT_PUBLIC_AUTHOR_AVATAR_URL=\"${NUXT_PUBLIC_AUTHOR_AVATAR_URL:-${AUTHOR_AVATAR_URL:-}}\" && export NUXT_PUBLIC_HERO_IMAGE_URL=\"${NUXT_PUBLIC_HERO_IMAGE_URL:-${HERO_IMAGE_URL:-}}\" && exec node /app/server/index.mjs"]
