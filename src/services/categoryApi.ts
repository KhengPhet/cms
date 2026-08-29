import { api } from '@/services/api'
import type { BackendCategory } from '@/types'

export interface CategoryPayload {
  name: string
  slug?: string
  description?: string
}

export const categoryApi = {
  async list(): Promise<BackendCategory[]> {
    return api.get<BackendCategory[]>('/api/categories')
  },

  async getById(id: number | string): Promise<BackendCategory> {
    return api.get<BackendCategory>(`/api/categories/${id}`)
  },

  async create(payload: CategoryPayload): Promise<BackendCategory> {
    return api.post<BackendCategory>('/api/categories', payload, { auth: true })
  },

  async update(id: number | string, payload: CategoryPayload): Promise<BackendCategory> {
    return api.put<BackendCategory>(`/api/categories/${id}`, payload, { auth: true })
  },

  async remove(id: number | string): Promise<void> {
    await api.delete<{ message: string }>(`/api/categories/${id}`, { auth: true })
  }
}
