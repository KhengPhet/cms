import { defineStore } from 'pinia'
import { authApi, type AuthUser } from '@/services/authApi'
import { ApiError } from '@/services/api'

export const TOKEN_KEY = 'gcms_token'
export const USER_KEY = 'gcms_user'

interface AuthState {
  user: AuthUser | null
  token: string | null
  loading: boolean
}

function persist(user: AuthUser, token: string) {
  localStorage.setItem(TOKEN_KEY, token)
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

function restore(): AuthState {
  try {
    const user = localStorage.getItem(USER_KEY)
    const token = localStorage.getItem(TOKEN_KEY)
    return { user: user ? (JSON.parse(user) as AuthUser) : null, token, loading: false }
  } catch {
    return { user: null, token: null, loading: false }
  }
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => restore(),
  getters: {
    isAuthenticated: (s) => !!s.user && !!s.token,
    isLoggedIn: (s) => !!s.user && !!s.token
  },
  actions: {
    async login(identifier: string, password: string) {
      this.loading = true
      try {
        const user = await authApi.login(identifier, password)
        const token = localStorage.getItem(TOKEN_KEY) ?? ''
        this.user = user
        this.token = token
        persist(user, token)
      } finally {
        this.loading = false
      }
    },

    async register(payload: {
      name: string
      email: string
      password: string
      thumbnail?: Blob | File | string | null
    }): Promise<void> {
      this.loading = true
      try {
        const user = await authApi.register(payload)
        // Register does not return a token; automatically log in after creation.
        const loggedIn = await authApi.login(payload.email, payload.password)
        const token = localStorage.getItem(TOKEN_KEY) ?? ''
        this.user = {
          ...loggedIn,
          thumbnail: loggedIn.thumbnail ?? user.thumbnail ?? null
        }
        this.token = token
        persist(this.user, token)
      } finally {
        this.loading = false
      }
    },

    async refreshProfile() {
      if (!this.token) return
      try {
        const profile = await authApi.me(this.token)
        const mapped: AuthUser = {
          id: profile.id,
          name: profile.name,
          email: profile.email,
          role: profile.role,
          thumbnail: profile.thumbnail ?? null,
          createdAt: profile.created_at,
          username: profile.name.toLowerCase().replace(/\s+/g, ''),
          avatar: profile.thumbnail || '',
          bio: ''
        }
        this.user = mapped
        persist(mapped, this.token)
      } catch {
        if (this.token) localStorage.removeItem(TOKEN_KEY)
        this.user = null
        this.token = null
      }
    },

    async logout() {
      this.user = null
      this.token = null
      localStorage.removeItem(TOKEN_KEY)
      localStorage.removeItem(USER_KEY)
    }
  }
})

export function isApiError(err: unknown): err is ApiError {
  return err instanceof ApiError
}
