<script setup lang="ts">
import { ref } from 'vue'
import TaskCard from './TaskCard.vue'
import type { Task, TaskStatus } from '../types/task'

const props = defineProps<{
  tasks: Task[]
}>()

const emit = defineEmits<{
  toggle: [taskId: string]
  delete: [taskId: string]
  statusChange: [taskId: string, status: TaskStatus]
}>()

const columns: { title: string; status: TaskStatus; dotClass: string }[] = [
  { title: '待办', status: 'todo', dotClass: 'bg-slate-400' },
  { title: '进行中', status: 'in-progress', dotClass: 'bg-indigo-500' },
  { title: '已完成', status: 'done', dotClass: 'bg-emerald-500' },
]

const draggedTaskId = ref<string | null>(null)
const activeDropStatus = ref<TaskStatus | null>(null)

function tasksForStatus(status: TaskStatus) {
  return props.tasks
    .filter((task) => task.status === status)
    .sort((first, second) => Date.parse(second.createdAt) - Date.parse(first.createdAt))
}

function handleDragStart(event: DragEvent, taskId: string) {
  draggedTaskId.value = taskId
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move'
    event.dataTransfer.setData('text/plain', taskId)
  }
}

function handleDragOver(status: TaskStatus) {
  activeDropStatus.value = status
}

function handleDrop(event: DragEvent, status: TaskStatus) {
  event.preventDefault()
  const taskId = event.dataTransfer?.getData('text/plain') || draggedTaskId.value

  if (taskId) {
    const task = props.tasks.find((item) => item.id === taskId)
    if (task && task.status !== status) {
      emit('statusChange', taskId, status)
    }
  }

  draggedTaskId.value = null
  activeDropStatus.value = null
}

function handleDragEnd() {
  draggedTaskId.value = null
  activeDropStatus.value = null
}
</script>

<template>
  <div class="grid grid-cols-1 gap-4 p-3 sm:grid-cols-1 sm:p-5 md:grid-cols-2 lg:grid-cols-3">
    <section
      v-for="column in columns"
      :key="column.status"
      class="min-w-0 rounded-xl border p-3 transition-colors dark:border-slate-700 sm:p-4"
      :class="activeDropStatus === column.status ? 'border-indigo-300 bg-indigo-50/70 dark:border-indigo-700 dark:bg-indigo-950/40' : 'border-slate-200 bg-slate-50/70 dark:bg-slate-800/60'"
      :aria-label="`${column.title}任务列`"
      @dragover.prevent="handleDragOver(column.status)"
      @drop="handleDrop($event, column.status)"
    >
      <header class="mb-3 flex items-center justify-between px-1">
        <h3 class="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-200">
          <span class="size-2 rounded-full" :class="column.dotClass" aria-hidden="true"></span>
          {{ column.title }}
        </h3>
        <span class="rounded-full bg-white px-2 py-0.5 text-xs font-semibold text-slate-500 dark:bg-slate-700 dark:text-slate-300">
          {{ tasksForStatus(column.status).length }}
        </span>
      </header>

      <ul class="min-h-28 space-y-2" :aria-label="`${column.title}任务列表`">
        <TaskCard
          v-for="task in tasksForStatus(column.status)"
          :key="task.id"
          :task="task"
          :draggable="true"
          class="!px-0 !py-1 cursor-grab active:cursor-grabbing"
          @dragstart="handleDragStart($event, task.id)"
          @dragend="handleDragEnd"
          @toggle="emit('toggle', task.id)"
          @delete="emit('delete', task.id)"
        />
        <li v-if="tasksForStatus(column.status).length === 0" class="list-none px-2 py-8 text-center text-xs text-slate-400 dark:text-slate-500">
          拖拽任务到此处
        </li>
      </ul>
    </section>
  </div>
</template>
