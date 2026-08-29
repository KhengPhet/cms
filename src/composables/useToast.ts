import { useNotificationsStore } from '@/stores/notifications'

export function useToast() {
  const store = useNotificationsStore()
  return {
    success: (m: string) => store.push('success', m),
    error: (m: string) => store.push('error', m),
    info: (m: string) => store.push('info', m),
    warning: (m: string) => store.push('warning', m)
  }
}