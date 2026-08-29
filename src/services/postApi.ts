import { api } from '@/services/api'
import type { BackendPost } from '@/types'

export interface PostListResponse {
  success: boolean
  posts: BackendPost[]
}

export interface PostResponse {
  success: boolean
  post: BackendPost
}

export interface CreatePostPayload {
  title: string
  body: string
  excerpt?: string
  status?: string
  category_id?: number | string
  type?: string
  tags?: string[] | string
  slug?: string
  thumbnail?: Blob | null
}

export interface UpdatePostPayload extends CreatePostPayload {}

export const postApi = {
  async list(): Promise<BackendPost[]> {
    const res = await api.get<PostListResponse>('/api/posts')
    return res?.posts ?? []
  },

  async getById(id: number | string): Promise<BackendPost> {
    const res = await api.get<PostResponse>(`/api/posts/${id}`)
    return res?.post
  },

  async create(payload: CreatePostPayload): Promise<BackendPost> {
    const form = buildPostForm(payload)
    const res = await api.post<PostResponse>('/api/posts', form, { auth: true })
    return res?.post
  },

  async update(id: number | string, payload: UpdatePostPayload): Promise<BackendPost> {
    const form = buildPostForm(payload)
    const res = await api.put<PostResponse>(`/api/posts/${id}`, form, { auth: true })
    return res?.post
  },

  async remove(id: number | string): Promise<void> {
    await api.delete<{ success: boolean }>(`/api/posts/${id}`, { auth: true })
  },

  async incrementView(id: number | string): Promise<number> {
    const res = await api.post<{ success: boolean; views: number }>(`/api/posts/${id}/view`)
    return res?.views ?? 0
  }
}

function buildPostForm(payload: CreatePostPayload | UpdatePostPayload): FormData {
  const form = new FormData()
  if (payload.title !== undefined) form.append('title', String(payload.title))
  if (payload.slug !== undefined) form.append('slug', String(payload.slug))
  if (payload.body !== undefined) form.append('body', String(payload.body))
  if (payload.excerpt !== undefined) form.append('excerpt', String(payload.excerpt))
  if (payload.status !== undefined) form.append('status', String(payload.status))
  if (payload.category_id !== undefined && payload.category_id !== null && payload.category_id !== '') {
    form.append('category_id', String(payload.category_id))
  }
  if (payload.type !== undefined) form.append('type', String(payload.type))
  if (payload.tags !== undefined) {
    const tags = payload.tags
    form.append('tags', JSON.stringify(Array.isArray(tags) ? tags : [tags]))
  }
  if (payload.thumbnail) {
    form.append('thumbnail', payload.thumbnail)
  }
  return form
}
