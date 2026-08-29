import { api, ApiError, getImageUrl } from '@/services/api'
import type { BackendUser } from '@/types'

export interface AuthUser {
  id: number | string
  name: string
  email: string
  role: string
  thumbnail: string | null
  createdAt: string
  username?: string
  avatar?: string
  bio?: string
}

export interface LoginPayload {
  email: string
  password: string
}

export interface LoginResponse {
  success: boolean
  message: string
  token: string
  user: BackendUser
}

export interface RegisterPayload {
  name: string
  email: string
  password: string
  thumbnail?: Blob | File | string | null
}

export interface RegisterResponse {
  success: boolean
  message: string
  user: BackendUser
}

function mapUser(u: BackendUser): AuthUser {
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    thumbnail: u.thumbnail ?? null,
    createdAt: u.created_at,
    username: u.name.toLowerCase().replace(/\s+/g, ''),
    avatar: u.thumbnail ? avatarUrl(u.thumbnail) : '',
    bio: ''
  }
}

function avatarUrl(thumbnail: string): string {
  if (/^https?:\/\//.test(thumbnail) || thumbnail.startsWith('data:')) return thumbnail
  return getImageUrl(thumbnail)
}

export const authApi = {
  async login(identifier: string, password: string): Promise<AuthUser> {
    const email = identifier.trim().toLowerCase()
    const res = await api.post<LoginResponse>('/api/auth/login', {
      email,
      password
    })
    if (res.token) localStorage.setItem('gcms_token', res.token)
    return mapUser(res.user)
  },

  async register(payload: RegisterPayload): Promise<AuthUser> {
    const form = new FormData()
    form.append('name', payload.name)
    form.append('email', payload.email.toLowerCase())
    form.append('password', payload.password)
    if (payload.thumbnail) {
      form.append('thumbnail', payload.thumbnail)
    }
    const res = await api.post<RegisterResponse>('/api/auth/register', form, { auth: false })
    return mapUser(res.user)
  },

  async me(token: string): Promise<BackendUser> {
    return api.get<BackendUser>('/api/user/profile', {
      headers: { Authorization: `Bearer ${token}` }
    })
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
      code: err.status === 401 ? 'INVALID' : undefined
    })
  }
  return new AuthError({ status: 0, message: 'Network error. Please try again.' })
}
