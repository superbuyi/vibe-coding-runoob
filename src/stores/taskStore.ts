import { reactive, watch } from 'vue'
import type { Task } from '../types/task'
import { hasStoredTasks, loadTasks, saveTasks } from '../utils/storage'

function createExampleTasks(): Task[] {
  const now = Date.now()

  return [
    {
      id: 'example-task-1',
      title: '梳理产品需求与用户流程',
      description: '整理核心使用场景，明确首个版本的功能边界。',
      status: 'in-progress',
      priority: 'high',
      dueDate: '2026-11-14',
      createdAt: new Date(now - 2 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'example-task-2',
      title: '完成首页视觉稿',
      description: '确定页面布局、颜色系统和基础组件样式。',
      status: 'todo',
      priority: 'medium',
      dueDate: '2026-11-16',
      createdAt: new Date(now - 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'example-task-3',
      title: '检查任务管理页面交互',
      description: '验证任务筛选、完成状态和删除操作。',
      status: 'todo',
      priority: 'low',
      dueDate: null,
      createdAt: new Date(now).toISOString(),
    },
  ]
}

const initialTasks = hasStoredTasks() ? loadTasks() : createExampleTasks()

export const taskStore = reactive({
  tasks: initialTasks,
})

watch(
  () => taskStore.tasks,
  (tasks) => saveTasks(tasks),
  { deep: true, immediate: true },
)

export function addTask(task: Task): void {
  taskStore.tasks.push(task)
}

export function updateTask(taskId: string, updates: Partial<Omit<Task, 'id'>>): void {
  const task = taskStore.tasks.find((item) => item.id === taskId)
  if (!task) return

  Object.assign(task, updates)
}

export function deleteTask(taskId: string): void {
  const taskIndex = taskStore.tasks.findIndex((task) => task.id === taskId)
  if (taskIndex !== -1) taskStore.tasks.splice(taskIndex, 1)
}
