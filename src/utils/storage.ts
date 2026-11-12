import type { Task } from '../types/task'

export const TASKS_STORAGE_KEY = 'vibe-coding-runoob-tasks'

export function saveTasks(tasks: Task[]): void {
  try {
    if (typeof localStorage === 'undefined') return
    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks))
  } catch {
    // Storage can be unavailable in private browsing or restricted environments.
  }
}

export function loadTasks(): Task[] {
  try {
    if (typeof localStorage === 'undefined') return []

    const storedTasks = localStorage.getItem(TASKS_STORAGE_KEY)
    if (!storedTasks) return []

    const parsedTasks: unknown = JSON.parse(storedTasks)
    return Array.isArray(parsedTasks) ? parsedTasks as Task[] : []
  } catch {
    return []
  }
}

export function hasStoredTasks(): boolean {
  try {
    if (typeof localStorage === 'undefined') return false

    const storedTasks = localStorage.getItem(TASKS_STORAGE_KEY)
    if (storedTasks === null) return false

    return Array.isArray(JSON.parse(storedTasks))
  } catch {
    return false
  }
}
