<script setup lang="ts">
import { computed, ref } from 'vue'
import KanbanBoard from './components/KanbanBoard.vue'
import TaskModal from './components/TaskModal.vue'
import TaskList from './components/TaskList.vue'
import ThemeToggle from './components/ThemeToggle.vue'
import { addTask, deleteTask, taskStore, updateTask } from './stores/taskStore'
import type { TaskStatus } from './types/task'

const isTaskModalOpen = ref(false)
const isMobileMenuOpen = ref(false)
const activeView = ref<'list' | 'kanban'>('list')

const completedCount = computed(() => taskStore.tasks.filter((task) => task.status === 'done').length)

function toggleTask(taskId: string) {
  const task = taskStore.tasks.find((item) => item.id === taskId)
  if (!task) return

  updateTask(taskId, { status: task.status === 'done' ? 'todo' : 'done' })
}

function moveTask(taskId: string, status: TaskStatus) {
  updateTask(taskId, { status })
}
</script>

<template>
  <div class="min-h-screen bg-slate-50 text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100">
    <header class="border-b border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900">
      <nav class="relative mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8" aria-label="主导航">
        <a href="#home" class="flex items-center gap-3 text-slate-900 no-underline">
          <span class="grid size-9 place-items-center rounded-xl bg-indigo-600 text-white shadow-sm shadow-indigo-200">
            <svg viewBox="0 0 24 24" fill="none" class="size-5" aria-hidden="true">
              <path d="m5 12.5 4.2 4.2L19 7" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </span>
          <span class="text-sm font-bold tracking-tight sm:text-base">Vibe Coding Runoob</span>
        </a>
        <div class="flex items-center gap-2 sm:gap-3">
          <span class="hidden text-sm text-slate-500 dark:text-slate-400 sm:inline">专注当下，一步一步完成</span>
          <ThemeToggle />
          <span class="hidden size-9 place-items-center rounded-full bg-indigo-50 text-sm font-semibold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 sm:grid" aria-label="用户头像">V</span>
          <button
            type="button"
            class="grid size-11 place-items-center rounded-lg text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 sm:hidden"
            :aria-expanded="isMobileMenuOpen"
            aria-controls="mobile-navigation-menu"
            :aria-label="isMobileMenuOpen ? '关闭导航菜单' : '打开导航菜单'"
            @click="isMobileMenuOpen = !isMobileMenuOpen"
          >
            <svg v-if="!isMobileMenuOpen" viewBox="0 0 24 24" fill="none" class="size-6" aria-hidden="true">
              <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
            </svg>
            <svg v-else viewBox="0 0 24 24" fill="none" class="size-6" aria-hidden="true">
              <path d="m6 6 12 12M18 6 6 18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
            </svg>
          </button>
        </div>
        <div
          v-if="isMobileMenuOpen"
          id="mobile-navigation-menu"
          class="absolute left-5 right-5 top-full z-40 rounded-xl border border-slate-200 bg-white p-2 shadow-lg dark:border-slate-700 dark:bg-slate-900 sm:hidden"
        >
          <p class="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">任务视图</p>
          <button
            type="button"
            class="flex min-h-11 w-full items-center rounded-lg px-3 text-left text-sm font-semibold transition"
            :class="activeView === 'list' ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300' : 'text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800'"
            @click="activeView = 'list'; isMobileMenuOpen = false"
          >列表视图</button>
          <button
            type="button"
            class="flex min-h-11 w-full items-center rounded-lg px-3 text-left text-sm font-semibold transition"
            :class="activeView === 'kanban' ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300' : 'text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800'"
            @click="activeView = 'kanban'; isMobileMenuOpen = false"
          >看板视图</button>
        </div>
      </nav>
    </header>

    <main id="home" class="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-14">
      <section class="mb-9 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
        <div>
          <p class="mb-2 text-sm font-semibold text-indigo-600">你的工作空间</p>
          <h1 class="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">任务管理</h1>
          <p class="mt-2 text-sm text-slate-500 sm:text-base">把想法变成行动，让每一步都清晰可见。</p>
        </div>
        <div class="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <span class="grid size-10 place-items-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-300">
            <svg viewBox="0 0 24 24" fill="none" class="size-5" aria-hidden="true">
              <path d="M8 3v3m8-3v3M4.5 9.5h15M6 5.5h12a1.5 1.5 0 0 1 1.5 1.5v11A1.5 1.5 0 0 1 18 19.5H6A1.5 1.5 0 0 1 4.5 18V7A1.5 1.5 0 0 1 6 5.5Z" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </span>
          <div>
            <p class="text-xs font-medium text-slate-500 dark:text-slate-400">已完成任务</p>
            <p class="text-lg font-bold text-slate-900 dark:text-slate-100">{{ completedCount }} <span class="text-sm font-medium text-slate-400 dark:text-slate-500">/ {{ taskStore.tasks.length }}</span></p>
          </div>
        </div>
      </section>

      <section aria-labelledby="task-list-heading" class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm shadow-slate-200/50 dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/20">
        <div class="flex flex-col gap-4 border-b border-slate-100 px-5 py-5 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between sm:px-7">
          <div>
            <h2 id="task-list-heading" class="text-lg font-bold text-slate-900 dark:text-slate-100">我的任务</h2>
            <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">查看并整理你正在推进的事项</p>
          </div>
          <div class="flex flex-wrap items-center gap-3">
            <div class="flex rounded-xl bg-slate-100 p-1 dark:bg-slate-800" role="tablist" aria-label="任务视图">
              <button
                type="button"
                role="tab"
                class="min-h-11 rounded-lg px-3 py-2 text-sm font-semibold transition"
                :class="activeView === 'list' ? 'bg-white text-indigo-700 shadow-sm dark:bg-slate-700 dark:text-indigo-300' : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100'"
                :aria-selected="activeView === 'list'"
                @click="activeView = 'list'"
              >列表</button>
              <button
                type="button"
                role="tab"
                class="min-h-11 rounded-lg px-3 py-2 text-sm font-semibold transition"
                :class="activeView === 'kanban' ? 'bg-white text-indigo-700 shadow-sm dark:bg-slate-700 dark:text-indigo-300' : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100'"
                :aria-selected="activeView === 'kanban'"
                @click="activeView = 'kanban'"
              >看板</button>
            </div>
            <button
              type="button"
              class="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-indigo-200 transition hover:bg-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              @click="isTaskModalOpen = true"
            >
              <span class="text-lg leading-none" aria-hidden="true">+</span>
              新建任务
            </button>
          </div>
        </div>

        <TaskList
          v-if="activeView === 'list'"
          :tasks="taskStore.tasks"
          @toggle="toggleTask"
          @delete="deleteTask"
        />
        <KanbanBoard
          v-else
          :tasks="taskStore.tasks"
          @toggle="toggleTask"
          @delete="deleteTask"
          @status-change="moveTask"
        />
      </section>

      <p class="mt-5 text-center text-xs text-slate-400 dark:text-slate-500">当前展示示例任务数据，后续可接入真实数据。</p>
    </main>

    <TaskModal v-model="isTaskModalOpen" @submit="addTask" />
  </div>
</template>
