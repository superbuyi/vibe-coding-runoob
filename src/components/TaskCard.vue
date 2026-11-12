<script setup lang="ts">
import type { Task } from '../types/task'

const props = defineProps<{
  task: Task
}>()

const emit = defineEmits<{
  toggle: []
  delete: []
}>()

const priorityLabels = {
  high: '高优先级',
  medium: '中优先级',
  low: '低优先级',
}

const priorityStyles = {
  high: 'border-l-red-500',
  medium: 'border-l-yellow-400',
  low: 'border-l-green-500',
}

function formatDueDate(date: string | null) {
  if (!date) return '未设置截止日期'

  return new Intl.DateTimeFormat('zh-CN', {
    month: 'short',
    day: 'numeric',
  }).format(new Date(`${date}T00:00:00`))
}
</script>

<template>
  <li class="list-none px-5 py-3 sm:px-7">
    <article
      class="flex gap-4 rounded-xl border border-l-4 border-slate-200 bg-white p-4 shadow-sm transition duration-200 hover:scale-[1.02] hover:shadow-md dark:border-slate-700 dark:bg-slate-800 dark:shadow-black/20 sm:p-5"
      :class="priorityStyles[props.task.priority]"
    >
      <label class="-ml-3 -mt-2 flex min-h-11 min-w-11 shrink-0 cursor-pointer items-center justify-center" :aria-label="`标记任务完成：${props.task.title}`">
        <input
          type="checkbox"
          class="peer sr-only"
          :checked="props.task.status === 'done'"
          @change="emit('toggle')"
        />
        <span class="grid size-5 place-items-center rounded-full border border-slate-300 text-transparent transition peer-checked:border-indigo-600 peer-checked:bg-indigo-600 peer-checked:text-white peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-indigo-600 dark:border-slate-600">
          <svg viewBox="0 0 16 16" fill="none" class="size-3" aria-hidden="true">
            <path d="m3.5 8 3 3 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </span>
      </label>

      <div class="min-w-0 flex-1">
        <div class="flex items-start justify-between gap-3">
          <div class="min-w-0">
            <h3
              class="truncate font-semibold text-slate-800 dark:text-slate-100"
              :class="props.task.status === 'done' && 'text-slate-400 dark:text-slate-500 line-through'"
            >
              {{ props.task.title }}
            </h3>
            <p class="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">{{ props.task.description }}</p>
          </div>
          <button
            type="button"
            class="-mr-2 -mt-2 grid size-9 shrink-0 place-items-center rounded-lg text-xl leading-none text-slate-400 transition hover:bg-red-50 hover:text-red-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500 dark:text-slate-500 dark:hover:bg-red-950/50 dark:hover:text-red-300"
            :aria-label="`删除任务：${props.task.title}`"
            @click="emit('delete')"
          >
            <span aria-hidden="true">×</span>
          </button>
        </div>

        <div class="mt-4 flex flex-wrap items-center gap-2">
          <span
            class="rounded-full px-2.5 py-1 text-xs font-semibold"
            :class="{
              'bg-red-50 text-red-700 dark:bg-red-950/60 dark:text-red-300': props.task.priority === 'high',
              'bg-yellow-50 text-yellow-700 dark:bg-yellow-950/60 dark:text-yellow-300': props.task.priority === 'medium',
              'bg-green-50 text-green-700 dark:bg-green-950/60 dark:text-green-300': props.task.priority === 'low',
            }"
          >
            {{ priorityLabels[props.task.priority] }}
          </span>
          <span class="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
            <svg viewBox="0 0 20 20" fill="none" class="size-4" aria-hidden="true">
              <path d="M6.5 2.5v2m7-2v2m-9 3h11m-9.5-3h8A1.5 1.5 0 0 1 15.5 6v9A1.5 1.5 0 0 1 14 16.5H6A1.5 1.5 0 0 1 4.5 15V6A1.5 1.5 0 0 1 6 4.5Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            {{ formatDueDate(props.task.dueDate) }}
          </span>
        </div>
      </div>
    </article>
  </li>
</template>
