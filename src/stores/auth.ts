import { defineStore } from 'pinia'
import { authApi, type AuthUser, type UpdateProfilePayload } from '@/services/authApi'
import { getImageUrl } from '@/utils/getImageUrl'
import type { BackendUser } from '@/types'

export const TOKEN_KEY = 'gcms_token'
export const USER_KEY = 'gcms_user'

interface AuthState {
  user: AuthUser | null
  token: string | null
  loading: boolean
}

function persist(token: string, user?: AuthUser | null) {
  localStorage.setItem(TOKEN_KEY, token)
  if (user) localStorage.setItem(USER_KEY, JSON.stringify(user))
  else localStorage.removeItem(USER_KEY)
}

function clearAuth() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}

// On startup we only trust the TOKEN. The actual user is ALWAYS restored
// from PostgreSQL via GET /api/user/profile — localStorage user data is
// never treated as the source of truth.
function restore(): AuthState {
  const token = localStorage.getItem(TOKEN_KEY)
  if (!token) {
    localStorage.removeItem(USER_KEY)
    return { user: null, token: null, loading: false }
  }
  return { user: null, token, loading: true }
}

function mapBackendUser(profile: BackendUser): AuthUser {
  return {
    id: Number(profile.id),
    name: profile.name,
    username: profile.username ?? profile.name.toLowerCase().replace(/\s+/g, ''),
    email: profile.email,
    role: profile.role,
    thumbnail: profile.thumbnail ?? null,
    createdAt: profile.created_at,
    updatedAt: profile.updated_at ?? null,
    avatar: profile.thumbnail ? getImageUrl(profile.thumbnail) : '',
    bio: profile.bio ?? null
  }
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => restore(),
  getters: {
    isAuthenticated: (s) => !!s.token,
    isLoggedIn: (s) => !!s.token
  },
  actions: {
    async login(email: string, password: string) {
      this.loading = true
      try {
        const { token, user } = await authApi.login(email, password)
        this.user = user
        this.token = token
        persist(token, user)
      } finally {
        this.loading = false
      }
    },

    async register(payload: {
      name: string
      username: string
      email: string
      password: string
      role?: string
      thumbnail?: Blob | File | null
    }): Promise<void> {
      this.loading = true
      try {
        // The backend performs the real INSERT and returns the token + user.
        // Store ONLY what the backend returned — never a frontend-generated user.
        const { token, user } = await authApi.register(payload)
        this.user = user
        this.token = token
        persist(token, user)
      } finally {
        this.loading = false
      }
    },

    /**
     * Restore the authenticated user from PostgreSQL.
     *
     * Reads gcms_token, calls GET /api/user/profile, and replaces the local
     * user with the real database row. If the token is invalid/expired (or the
     * user no longer exists in the DB), both gcms_token and gcms_user are
     * removed. Safe to call on every app start.
     */
    async loadUser(): Promise<boolean> {
      const token = this.token ?? localStorage.getItem(TOKEN_KEY)
      if (!token) {
        this.user = null
        this.token = null
        return false
      }
      this.token = token
      this.loading = true
      try {
        const profile = await authApi.me(token)
        this.user = mapBackendUser(profile)
        persist(token, this.user)
        return true
      } catch {
        this.user = null
        this.token = null
        clearAuth()
        return false
      } finally {
        this.loading = false
      }
    },

    /**
     * Validate the stored token against the backend. If it is invalid or the
     * user no longer exists in PostgreSQL, clear local storage and report false.
     * Used by the router guard so localStorage alone can never grant access.
     */
    async validate(): Promise<boolean> {
      return this.loadUser()
    },

    async updateProfile(payload: UpdateProfilePayload): Promise<void> {
      if (!this.token) throw new Error('Not authenticated')
      this.loading = true
      try {
        const user = await authApi.updateProfile(payload)
        this.user = user
        persist(this.token, user)
      } finally {
        this.loading = false
      }
    },

    async logout() {
      this.user = null
      this.token = null
      clearAuth()
    }
  }
})