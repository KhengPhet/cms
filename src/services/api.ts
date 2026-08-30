import { getApiBaseUrl as resolveApiBaseUrl } from '@/utils/apiBaseUrl'

const TOKEN_KEY = 'gcms_token'

export interface ApiErrorOptions {
  status: number
  message: string
  code?: string
  details?: unknown
}

export class ApiError extends Error {
  status: number
  code?: string
  details?: unknown

  constructor(opts: ApiErrorOptions) {
    super(opts.message)
    this.name = 'ApiError'
    this.status = opts.status
    this.code = opts.code
    this.details = opts.details
  }
}

export function getApiBaseUrl(): string {
  return resolveApiBaseUrl()
}

interface FetchOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  headers?: Record<string, string>
  body?: unknown
  auth?: boolean
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function extractErrorMessage(_status: number, payload: unknown, fallback: string): string {
  if (isPlainObject(payload)) {
    const p = payload as Record<string, unknown>
    if (typeof p.message === 'string' && p.message) return p.message
    if (typeof p.error === 'string' && p.error) return p.error
    if (isPlainObject(p.details)) {
      const d = p.details as Record<string, unknown>
      if (typeof d.message === 'string' && d.message) return d.message
    }
  }
  if (Array.isArray(payload) && payload.length && isPlainObject(payload[0])) {
    const first = payload[0] as Record<string, unknown>
    if (typeof first.msg === 'string') return first.msg
  }
  return fallback
}

function extractErrorCode(payload: unknown): string | undefined {
  if (isPlainObject(payload)) {
    const c = (payload as Record<string, unknown>).code
    if (typeof c === 'string' && c) return c
  }
  return undefined
}

export async function request<T = unknown>(path: string, options: FetchOptions = {}): Promise<T> {
  const { method = 'GET', headers = {}, body, auth = true } = options
  const base = getApiBaseUrl()
  const url = /^https?:\/\//.test(path) ? path : `${base}${path}`

  let payload: BodyInit | undefined
  const finalHeaders: Record<string, string> = { ...headers }

  const isFormData = body instanceof FormData
  if (body !== undefined && body !== null) {
    if (isFormData) {
      // Let the browser generate the multipart boundary. Do NOT set
      // Content-Type: multipart/form-data manually.
      payload = body
    } else {
      finalHeaders['Content-Type'] = 'application/json'
      payload = JSON.stringify(body)
    }
  }

  if (auth) {
    const token = localStorage.getItem(TOKEN_KEY)
    if (token) finalHeaders['Authorization'] = `Bearer ${token}`
  }

  let res: Response
  try {
    res = await fetch(url, {
      method,
      headers: finalHeaders,
      body: payload
    })
  } catch (err) {
    throw new ApiError({ status: 0, message: 'Network error. Is the server running?', details: err })
  }

  let data: unknown = null
  const text = await res.text()
  if (text) {
    try {
      data = JSON.parse(text)
    } catch {
      data = text
    }
  }

  if (!res.ok) {
    const fallback = `Request failed (${res.status})`
    throw new ApiError({
      status: res.status,
      message: extractErrorMessage(res.status, data, fallback),
      code: extractErrorCode(data)
    })
  }

  return data as T
}

export const api = {
  get<T = unknown>(path: string, opts: Omit<FetchOptions, 'method' | 'body'> = {}) {
    return request<T>(path, { ...opts, method: 'GET' })
  },
  post<T = unknown>(path: string, body?: unknown, opts: Omit<FetchOptions, 'method' | 'body'> = {}) {
    return request<T>(path, { ...opts, method: 'POST', body })
  },
  put<T = unknown>(path: string, body?: unknown, opts: Omit<FetchOptions, 'method' | 'body'> = {}) {
    return request<T>(path, { ...opts, method: 'PUT', body })
  },
  patch<T = unknown>(path: string, body?: unknown, opts: Omit<FetchOptions, 'method' | 'body'> = {}) {
    return request<T>(path, { ...opts, method: 'PATCH', body })
  },
  delete<T = unknown>(path: string, opts: Omit<FetchOptions, 'method' | 'body'> = {}) {
    return request<T>(path, { ...opts, method: 'DELETE' })
  }
}

export function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem(TOKEN_KEY)
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export function handleUnauthorized(status: number): void {
  if (status === 401) {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem('gcms_user')
  }
}

// Image URL helpers live in src/utils/getImageUrl.ts
export {
  getImageUrl,
  getAuthorImageUrl,
  imageErrorHandler,
  handleImageError
} from '@/utils/getImageUrl'