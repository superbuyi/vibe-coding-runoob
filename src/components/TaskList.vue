<script setup lang="ts">
import { computed, ref } from 'vue'
import TaskCard from './TaskCard.vue'
import type { Task, TaskStatus } from '../types/task'

type TaskFilter = 'all' | TaskStatus

const props = defineProps<{
  tasks: Task[]
}>()

const emit = defineEmits<{
  toggle: [taskId: string]
  delete: [taskId: string]
}>()

const activeFilter = ref<TaskFilter>('all')

const filters: { label: string; value: TaskFilter }[] = [
  { label: '全部', value: 'all' },
  { label: '待办', value: 'todo' },
  { label: '进行中', value: 'in-progress' },
  { label: '完成', value: 'done' },
]

const visibleTasks = computed(() => {
  const filteredTasks = activeFilter.value === 'all'
    ? props.tasks
    : props.tasks.filter((task) => task.status === activeFilter.value)

  return [...filteredTasks].sort(
    (first, second) => Date.parse(second.createdAt) - Date.parse(first.createdAt),
  )
})
</script>

<template>
  <div>
    <div class="flex flex-wrap gap-1 border-b border-slate-100 px-5 py-3 dark:border-slate-800 sm:px-7" aria-label="任务状态筛选">
      <button
        v-for="filter in filters"
        :key="filter.value"
        type="button"
        class="rounded-lg px-3 py-2 text-sm font-semibold transition"
        :class="activeFilter === filter.value ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100'"
        :aria-pressed="activeFilter === filter.value"
        @click="activeFilter = filter.value"
      >
        {{ filter.label }}
      </button>
    </div>

    <ul v-if="visibleTasks.length" class="divide-y divide-slate-100 py-2 dark:divide-slate-800">
      <TaskCard
        v-for="task in visibleTasks"
        :key="task.id"
        :task="task"
        @toggle="emit('toggle', task.id)"
        @delete="emit('delete', task.id)"
      />
    </ul>
    <div v-else class="px-6 py-12 text-center">
      <p class="text-sm text-slate-500 dark:text-slate-400">
        {{ props.tasks.length === 0 ? '还没有任务，点击下方按钮创建第一个吧' : '这个状态下暂无任务。' }}
      </p>
    </div>
  </div>
</template>
