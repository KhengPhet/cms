import { api } from '@/services/api'

export interface User {
  id: number
  name: string
  username: string
  email: string
  role: string
  thumbnail: string | null
  created_at: string
  updated_at: string | null
}

interface UsersResponse {
  success: boolean
  users: User[]
}

interface UserResponse {
  success: boolean
  user: User
}

export const userApi = {
  async getAll(): Promise<User[]> {
    const response = await api.get<UsersResponse>('/api/user')

    return response.users
  },

  async getById(id: number): Promise<User> {
    const response = await api.get<UserResponse>(
      `/api/user/${id}`
    )

    return response.user
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/api/user/${id}`)
  },
}