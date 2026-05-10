<template>
  <div
    class="author-avatar-glow flex items-center justify-center overflow-hidden"
    :style="{ width: `${size}px`, height: `${size}px` }"
  >
    <img
      v-if="avatarUrl"
      :src="avatarUrl"
      :alt="`${authorName} avatar`"
      class="author-avatar"
      :style="{ width: `${size}px`, height: `${size}px` }"
      @error="onImageError"
    >
    <div
      v-else
      class="author-avatar flex items-center justify-center font-bold"
      :style="{
        width: `${size}px`,
        height: `${size}px`,
        background: 'linear-gradient(140deg, var(--primary), color-mix(in srgb, var(--primary) 62%, #fff))',
        color: '#fff',
        fontSize: `${Math.max(14, Math.round(size * 0.32))}px`,
      }"
      aria-label="Author avatar initials"
    >
      {{ initials }}
    </div>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  size?: number
}>(), {
  size: 88,
})

const config = useRuntimeConfig()

const authorName = computed(() => config.public.authorName || 'CC Freiburg Team')
const imageFailed = ref(false)
const avatarUrl = computed(() => {
  return imageFailed.value ? '' : (config.public.authorAvatarUrl || '')
})

const initials = computed(() =>
  authorName.value
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part[0]?.toUpperCase() || '')
    .join('')
)

function onImageError() {
  imageFailed.value = true
}
</script>