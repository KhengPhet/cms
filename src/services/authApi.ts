import { api, ApiError } from '@/services/api'
import { getImageUrl } from '@/utils/getImageUrl'
import type { BackendUser } from '@/types'

export interface AuthUser {
  id: number
  name: string
  username: string
  email: string
  role: string
  thumbnail: string | null
  createdAt: string
  updatedAt: string | null
  avatar: string
  bio?: string | null
}

export interface LoginResponse {
  success: boolean
  message: string
  token: string
  user: BackendUser
}

export interface RegisterResponse {
  success: boolean
  message: string
  token: string
  user: BackendUser
}

export interface RegisterPayload {
  name: string
  username: string
  email: string
  password: string
  role?: string
  thumbnail?: Blob | File | null
}

export interface UpdateProfileResponse {
  success: boolean
  message: string
  user: BackendUser
}

export interface UpdateProfilePayload {
  name?: string
  username?: string
  email?: string
  bio?: string | null
  password?: string
  thumbnail?: Blob | File | null
}

function mapUser(u: BackendUser): AuthUser {
  return {
    id: Number(u.id),
    name: u.name,
    username: u.username ?? u.name.toLowerCase().replace(/\s+/g, ''),
    email: u.email,
    role: u.role,
    thumbnail: u.thumbnail ?? null,
    createdAt: u.created_at,
    updatedAt: u.updated_at ?? null,
    avatar: u.thumbnail ? avatarUrl(u.thumbnail) : '',
    bio: u.bio ?? null
  }
}

function avatarUrl(thumbnail: string): string {
  if (/^https?:\/\//.test(thumbnail) || thumbnail.startsWith('data:')) return thumbnail
  return getImageUrl(thumbnail)
}

export const authApi = {
  async login(email: string, password: string): Promise<{ token: string; user: AuthUser }> {
    try {
      // Field name MUST match the backend: POST /api/auth/login expects { email, password }.
      const res = await api.post<LoginResponse>('/api/auth/login', {
        email,
        password
      })
      if (!res.success || !res.token) {
        throw new AuthError({ status: 401, message: res.message || 'Invalid credentials' })
      }
      return { token: res.token, user: mapUser(res.user) }
    } catch (err) {
      if (err instanceof AuthError) throw err
      throw await toAuthError(err)
    }
  },

  async register(payload: RegisterPayload): Promise<{ token: string; user: AuthUser }> {
    try {
      const form = new FormData()
      form.append('name', payload.name)
      form.append('username', payload.username)
      form.append('email', payload.email.toLowerCase())
      form.append('password', payload.password)
      form.append('role', payload.role || 'user')
      if (payload.thumbnail instanceof File || payload.thumbnail instanceof Blob) {
        form.append('thumbnail', payload.thumbnail)
      }
      // Never set Content-Type manually — the browser generates the multipart boundary.
      const res = await api.post<RegisterResponse>('/api/auth/register', form, { auth: false })
      if (!res.success || !res.token) {
        throw new AuthError({ status: 400, message: res.message || 'Registration failed' })
      }
      return { token: res.token, user: mapUser(res.user) }
    } catch (err) {
      if (err instanceof AuthError) throw err
      throw await toAuthError(err)
    }
  },

  async me(token: string): Promise<BackendUser> {
    const res = await api.get<{ success: boolean; user: BackendUser }>('/api/user/profile', {
      headers: { Authorization: `Bearer ${token}` }
    })
    return res.user
  },

  async updateProfile(payload: UpdateProfilePayload): Promise<AuthUser> {
    try {
      const form = new FormData()
      if (payload.name !== undefined) form.append('name', payload.name)
      if (payload.username !== undefined) form.append('username', payload.username)
      if (payload.email !== undefined) form.append('email', payload.email.toLowerCase())
      if (payload.bio !== undefined && payload.bio !== null) form.append('bio', payload.bio)
      if (payload.password) form.append('password', payload.password)
      if (payload.thumbnail instanceof File || payload.thumbnail instanceof Blob) {
        form.append('thumbnail', payload.thumbnail)
      }
      const res = await api.put<UpdateProfileResponse>('/api/auth/me', form)
      if (!res.success || !res.user) {
        throw new AuthError({ status: 400, message: res.message || 'Profile update failed' })
      }
      return mapUser(res.user)
    } catch (err) {
      if (err instanceof AuthError) throw err
      throw await toAuthError(err)
    }
  }
}

export class AuthError extends Error {
  status: number
  code?: string
  constructor(options: { status: number; message: string; code?: string }) {
    super(options.message)
    this.name = 'AuthError'
    this.status = options.status
    this.code = options.code
  }
}

export async function toAuthError(err: unknown): Promise<AuthError> {
  if (err instanceof ApiError) {
    return new AuthError({
      status: err.status,
      message: err.message,
      code: err.code || (err.status === 401 ? 'INVALID' : undefined)
    })
  }
  return new AuthError({ status: 0, message: 'Network error. Please try again.' })
}
