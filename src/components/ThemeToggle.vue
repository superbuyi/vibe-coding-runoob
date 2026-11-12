<script setup lang="ts">
import { onMounted, ref } from 'vue'

const THEME_STORAGE_KEY = 'vibe-coding-runoob-theme'
const isDark = ref(false)

function applyTheme(dark: boolean) {
  isDark.value = dark
  document.documentElement.classList.toggle('dark', dark)
}

function toggleTheme() {
  const nextIsDark = !isDark.value
  applyTheme(nextIsDark)

  try {
    localStorage.setItem(THEME_STORAGE_KEY, nextIsDark ? 'dark' : 'light')
  } catch {
    // Theme still works for the current page if storage is unavailable.
  }
}

onMounted(() => {
  let savedTheme: string | null = null

  try {
    savedTheme = localStorage.getItem(THEME_STORAGE_KEY)
  } catch {
    // Fall back to the system preference when storage is unavailable.
  }

  const followsSystem = savedTheme !== 'dark' && savedTheme !== 'light'
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  applyTheme(followsSystem ? prefersDark : savedTheme === 'dark')
})
</script>

<template>
  <button
    type="button"
    class="grid size-9 place-items-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white"
    :aria-label="isDark ? '切换到亮色模式' : '切换到深色模式'"
    :title="isDark ? '切换到亮色模式' : '切换到深色模式'"
    @click="toggleTheme"
  >
    <svg v-if="isDark" viewBox="0 0 24 24" fill="none" class="size-5" aria-hidden="true">
      <circle cx="12" cy="12" r="3.5" stroke="currentColor" stroke-width="1.7" />
      <path d="M12 2.5v2m0 15v2m9.5-9.5h-2m-15 0h-2m16.22-6.72-1.42 1.42M6.7 17.3l-1.42 1.42m13.44 0-1.42-1.42M6.7 6.7 5.28 5.28" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" />
    </svg>
    <svg v-else viewBox="0 0 24 24" fill="none" class="size-5" aria-hidden="true">
      <path d="M20.2 15.1A8.3 8.3 0 0 1 8.9 3.8 8.5 8.5 0 1 0 20.2 15.1Z" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
  </button>
</template>
