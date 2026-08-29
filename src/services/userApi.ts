import { api } from '@/services/api'
import type { BackendUser } from '@/types'

export const userApi = {
  async profile(): Promise<BackendUser> {
    return api.get<BackendUser>('/api/user/profile', { auth: true })
  }
}
