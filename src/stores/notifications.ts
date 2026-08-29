import { defineStore } from 'pinia'
import { activityLogs as demoLogs, notifications as demoNotifications } from '@/services/data'
import type { ActivityLog, Notification } from '@/types'

interface ToastItem {
  id: number
  type: 'success' | 'error' | 'info' | 'warning'
  message: string
}

export const useNotificationsStore = defineStore('notifications', {
  state: () => ({
    notifications: [...demoNotifications] as Notification[],
    activityLogs: [...demoLogs] as ActivityLog[],
    toasts: [] as ToastItem[]
  }),
  getters: {
    unreadCount: (s) => s.notifications.filter((n) => !n.read).length
  },
  actions: {
    markAllRead() {
      this.notifications.forEach((n) => (n.read = true))
    },
    markRead(id: string) {
      const n = this.notifications.find((x) => x.id === id)
      if (n) n.read = true
    },
    addActivity(log: ActivityLog) {
      this.activityLogs.unshift(log)
    },
    push(type: ToastItem['type'], message: string) {
      const id = Date.now() + Math.random()
      this.toasts.push({ id, type, message })
      setTimeout(() => {
        this.toasts = this.toasts.filter((t) => t.id !== id)
      }, 3800)
    },
    dismiss(id: number) {
      this.toasts = this.toasts.filter((t) => t.id !== id)
    }
  }
})