<script setup lang="ts">
import { onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import type { Task, TaskPriority } from '../types/task'

const isOpen = defineModel<boolean>({ required: true })

const emit = defineEmits<{
  submit: [task: Task]
}>()

const form = reactive<{
  title: string
  description: string
  priority: TaskPriority
}>({
  title: '',
  description: '',
  priority: 'medium',
})

const titleError = ref('')

function resetForm() {
  form.title = ''
  form.description = ''
  form.priority = 'medium'
  titleError.value = ''
}

function closeModal() {
  isOpen.value = false
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && isOpen.value) {
    closeModal()
  }
}

function submitTask() {
  const title = form.title.trim()
  if (!title) {
    titleError.value = '标题不能为空'
    return
  }

  const task: Task = {
    id: `task-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    title,
    description: form.description.trim(),
    status: 'todo',
    priority: form.priority,
    dueDate: null,
    createdAt: new Date().toISOString(),
  }

  emit('submit', task)
  closeModal()
  resetForm()
}

onMounted(() => window.addEventListener('keydown', handleKeydown))
onBeforeUnmount(() => window.removeEventListener('keydown', handleKeydown))
</script>

<template>
  <Teleport to="body">
    <Transition name="task-modal">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/45 p-0 backdrop-blur-[2px] sm:items-center sm:p-4"
        @click.self="closeModal"
      >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="task-modal-title"
        class="max-h-[90dvh] w-full overflow-y-auto rounded-t-3xl bg-white p-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))] shadow-2xl shadow-slate-950/20 dark:bg-slate-900 sm:max-h-[calc(100dvh-2rem)] sm:max-w-lg sm:rounded-2xl sm:pb-8"
      >
        <div class="mb-6 flex items-start justify-between gap-4">
          <div>
            <h2 id="task-modal-title" class="text-xl font-bold text-slate-900 dark:text-slate-100">新建任务</h2>
            <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">填写任务信息，稍后也可以继续编辑。</p>
          </div>
          <button
            type="button"
            class="grid size-9 shrink-0 place-items-center rounded-lg text-2xl leading-none text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-slate-200"
            aria-label="关闭弹窗"
            @click="closeModal"
          >
            <span aria-hidden="true">×</span>
          </button>
        </div>

        <form class="space-y-5" @submit.prevent="submitTask">
          <div>
            <label for="task-title" class="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">标题 <span class="text-red-500">*</span></label>
            <input
              id="task-title"
              v-model="form.title"
              type="text"
              placeholder="例如：完成产品首页设计"
              :aria-invalid="Boolean(titleError)"
              :aria-describedby="titleError ? 'task-title-error' : undefined"
              class="w-full rounded-xl border bg-white px-3.5 py-3 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:ring-indigo-950"
              :class="titleError ? 'border-red-400 dark:border-red-500' : 'border-slate-200 dark:border-slate-700'"
              @input="titleError = ''"
            />
            <p v-if="titleError" id="task-title-error" class="mt-2 text-sm font-medium text-red-600" role="alert">
              {{ titleError }}
            </p>
          </div>

          <div>
            <label for="task-description" class="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">描述 <span class="font-normal text-slate-400 dark:text-slate-500">（选填）</span></label>
            <textarea
              id="task-description"
              v-model="form.description"
              rows="3"
              placeholder="补充任务的相关信息..."
              class="w-full resize-y rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:ring-indigo-950"
            ></textarea>
          </div>

          <div>
            <label for="task-priority" class="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">优先级</label>
            <select
              id="task-priority"
              v-model="form.priority"
              class="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-base text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:ring-indigo-950"
            >
              <option value="low">低优先级</option>
              <option value="medium">中优先级</option>
              <option value="high">高优先级</option>
            </select>
          </div>

          <div class="flex justify-end gap-3 border-t border-slate-100 pt-5 dark:border-slate-800">
            <button
              type="button"
              class="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              @click="closeModal"
            >取消</button>
            <button
              type="submit"
              class="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-indigo-200 transition hover:bg-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >创建任务</button>
          </div>
        </form>
      </section>
      </div>
    </Transition>
  </Teleport>
</template>
