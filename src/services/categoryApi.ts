import { api } from '@/services/api'
import type { BackendCategory } from '@/types'

export interface CategoryPayload {
  name: string
  slug?: string
  description?: string
}

export interface CategoryListResponse {
  success: boolean
  categories: BackendCategory[]
}

export interface CategoryResponse {
  success: boolean
  category: BackendCategory
}

export const categoryApi = {
  async list(): Promise<BackendCategory[]> {
    const res = await api.get<BackendCategory[] | CategoryListResponse>(
      '/api/categories'
    )

    // The backend returns a raw array: [ { id, name, slug, description, count, ... } ]
    if (Array.isArray(res)) return res

    // Fallback for a wrapped shape: { success, categories: [...] }
    if (res && Array.isArray((res as CategoryListResponse).categories)) {
      return (res as CategoryListResponse).categories
    }

    console.warn('Unexpected categories API response:', res)
    return []
  },

  async getById(
    id: number | string
  ): Promise<BackendCategory> {
    const res = await api.get<CategoryResponse>(
      `/api/categories/${id}`
    )

    return res.category
  },

  async create(
    payload: CategoryPayload
  ): Promise<BackendCategory> {
    const res = await api.post<CategoryResponse>(
      '/api/categories',
      payload,
      { auth: true }
    )

    return res.category
  },

  async update(
    id: number | string,
    payload: CategoryPayload
  ): Promise<BackendCategory> {
    const res = await api.put<CategoryResponse>(
      `/api/categories/${id}`,
      payload,
      { auth: true }
    )

    return res.category
  },

  async remove(
    id: number | string
  ): Promise<void> {
    await api.delete<{ success: boolean }>(
      `/api/categories/${id}`,
      { auth: true }
    )
  },
}