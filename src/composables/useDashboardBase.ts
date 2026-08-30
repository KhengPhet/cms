import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { dashboardPathForRole } from '@/utils/roles'

/**
 * Returns the dashboard base path for the current user's role
 * ('/admin', '/editor' or '/author'). Used to build role-scoped
 * navigation links so each role stays inside its own panel.
 */
export function useDashboardBase() {
  const auth = useAuthStore()
  const base = computed(() => dashboardPathForRole(auth.user?.role))
  return { base }
}
