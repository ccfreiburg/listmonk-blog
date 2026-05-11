<template>
  <div style="background-color: #f7f4ef; min-height: 100vh; padding: 16px;">
    <div style="max-width: 650px; margin: 0 auto;">
      <!-- Controls -->
      <div style="margin-bottom: 24px; display: flex; flex-direction: column; gap: 12px;">
        <div style="display: flex; gap: 12px; flex-wrap: wrap;">
          <select
            v-model="selectedFile"
            @change="loadPreview"
            style="flex: 1; min-width: 200px; padding: 10px; border-radius: 8px; border: 1px solid rgba(0,0,0,0.08); font-size: 14px; font-family: Inter, sans-serif;"
          >
            <option value="">Select a newsletter...</option>
            <option v-for="file in files" :key="file" :value="file">
              {{ file }}
            </option>
          </select>
          <button
            @click="toggleTheme"
            style="padding: 10px 20px; border-radius: 8px; background: #c47a3a; color: white; border: none; font-weight: 600; cursor: pointer; font-size: 14px; font-family: Inter, sans-serif;"
          >
            {{ previewTheme === 'light' ? '🌙 Dark' : '☀️ Light' }}
          </button>
        </div>
        
        <!-- Loading state -->
        <div v-if="loading" style="text-align: center; padding: 24px;">
          <div class="spinner"></div>
        </div>

        <!-- Error state -->
        <div v-else-if="error && files.length === 0" style="background: #fee; color: #c33; padding: 12px; border-radius: 8px; font-size: 14px;">
          {{ error }}
        </div>
      </div>

      <!-- Preview -->
      <div v-if="selectedFile && htmlContent">
        <!-- Error for this file -->
        <div v-if="error && selectedFile" style="background: #fee; color: #c33; padding: 12px; border-radius: 8px; font-size: 14px; margin-bottom: 12px;">
          {{ error }}
        </div>

        <!-- Email template wrapper -->
        <div :style="templateStyle">
          <!-- Hero section -->
          <div style="text-align: center; padding-bottom: 20px;">
            <img
              src="https://lists.ccfreiburg.de/uploads/hero.jpg"
              alt="CC Freiburg newsletter hero image"
              style="width: 100%; display: block; border-radius: 14px; margin: 0 0 16px 0; border: 1px solid rgba(0,0,0,0.08); max-width: 100%; height: auto;"
            />

            <img
              src="https://lists.ccfreiburg.de/uploads/aravatar.png"
              alt="Author"
              style="width: 72px; height: 72px; border-radius: 50%; margin: 0 auto 14px auto; border: 2px solid rgba(0,0,0,0.08); display: block;"
            />

            <h1 :style="h1Style">Prayer Update from CC Freiburg</h1>

            <div :style="subtitleStyle">
              CC Freiburg Newsletter · Faith · Leadership · Mission
            </div>
          </div>

          <!-- Content (rendered markdown) -->
          <div
            :style="contentStyle"
            v-html="htmlContent"
          ></div>
        </div>
      </div>

      <!-- Empty state -->
      <div v-else style="text-align: center; padding: 48px 20px; color: #5d646b; font-family: Inter, sans-serif;">
        <p>Select a newsletter file to preview it in the email template.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface PreviewListResponse {
  files: string[]
}

interface PreviewFileResponse {
  filename: string
  content: string
  html: string
}

const selectedFile = ref('')
const files = ref<string[]>([])
const htmlContent = ref('')
const loading = ref(false)
const error = ref('')
const previewTheme = ref<'light' | 'dark'>('light')

useHead({ title: 'Newsletter Preview' })

const templateStyle = computed(() => ({
  backgroundColor: previewTheme.value === 'light' ? '#ffffff' : '#171a1d',
  color: previewTheme.value === 'light' ? '#1c1f22' : '#f4eee6',
  padding: '32px',
  maxWidth: '560px',
  margin: '0 auto',
  borderRadius: '18px',
  border: previewTheme.value === 'light' ? '1px solid rgba(0,0,0,0.08)' : '1px solid rgba(255,255,255,0.08)',
  boxShadow: previewTheme.value === 'light' ? '0 10px 30px rgba(0,0,0,0.08)' : '0 10px 30px rgba(0,0,0,0.35)',
  fontFamily: "Inter, 'Helvetica Neue', Helvetica, Arial, sans-serif",
  fontSize: '15px',
  lineHeight: '26px',
}))

const h1Style = computed(() => ({
  fontSize: '26px',
  margin: '10px 0',
  lineHeight: '1.2',
  color: previewTheme.value === 'light' ? '#1c1f22' : '#f4eee6',
}))

const subtitleStyle = computed(() => ({
  color: previewTheme.value === 'light' ? '#5d646b' : '#b5babf',
  fontSize: '14px',
}))

const contentStyle = computed(() => ({
  marginTop: '20px',
  color: previewTheme.value === 'light' ? '#1c1f22' : '#f4eee6',
}))

// Load available files on mount
onMounted(async () => {
  try {
    const data = await $fetch<PreviewListResponse>('/api/preview-markdown')

    if (Array.isArray(data.files) && data.files.length > 0) {
      files.value = data.files
      error.value = ''
    } else {
      error.value = 'No markdown files found'
    }
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Unknown error'
    error.value = `Failed to load files: ${message}`
  }
})

// Load and render selected file
const loadPreview = async () => {
  if (!selectedFile.value) {
    htmlContent.value = ''
    return
  }

  loading.value = true
  error.value = ''

  try {
    const previewData = await $fetch<PreviewFileResponse>(
      `/api/preview-markdown?file=${encodeURIComponent(selectedFile.value)}`
    )

    htmlContent.value = previewData.html ?? ''
    
    if (!htmlContent.value) {
      error.value = 'No content found in file'
    }
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Unknown error'
    error.value = `Error loading file: ${message}`
    htmlContent.value = ''
  } finally {
    loading.value = false
  }
}

const toggleTheme = () => {
  previewTheme.value = previewTheme.value === 'light' ? 'dark' : 'light'
}
</script>

<style scoped>
  .spinner {
    display: inline-block;
    width: 32px;
    height: 32px;
    border: 4px solid #c47a3a;
    border-top-color: transparent;
    border-radius: 50%;
    animation: spin 0.6s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  
  :deep(h1) {
    font-size: 26px;
    margin: 10px 0;
    line-height: 1.2;
  }

  :deep(h2) {
    font-size: 20px;
    margin: 16px 0 12px 0;
    font-weight: 600;
  }

  :deep(h3) {
    font-size: 16px;
    margin: 14px 0 10px 0;
    font-weight: 600;
  }

  :deep(p) {
    margin: 12px 0;
    line-height: 1.73;
  }

  :deep(ul), :deep(ol) {
    margin: 12px 0;
    padding-left: 20px;
  }

  :deep(li) {
    margin: 8px 0;
  }

  :deep(blockquote) {
    border-left: 3px solid #c47a3a;
    padding: 14px 16px;
    margin: 20px 0;
    font-style: italic;
    background: rgba(196,122,58,0.06);
  }

  :deep(a) {
    color: #c47a3a;
    text-decoration: none;
  }

  :deep(a:hover) {
    text-decoration: underline;
  }

  :deep(code) {
    background: rgba(196,122,58,0.1);
    padding: 2px 6px;
    border-radius: 4px;
    font-family: monospace;
    font-size: 14px;
  }

  :deep(pre) {
    background: rgba(0,0,0,0.05);
    padding: 12px;
    border-radius: 8px;
    overflow-x: auto;
    font-family: monospace;
    font-size: 13px;
  }
</style>
