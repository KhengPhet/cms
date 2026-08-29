import { api } from '@/services/api'
import type { BackendComment, BackendCommentStats, BackendCommentReply } from '@/types'

export interface CommentListResponse {
  success: boolean
  data: BackendComment[]
  message?: string
}

export interface CommentByPostResponse {
  success: boolean
  data: BackendComment[]
}

export interface CommentStatsResponse {
  success: boolean
  data: BackendCommentStats
  message?: string
}

export interface CreateCommentPayload {
  comment: string
  post_id?: number | string
  parent_id?: number | string
}

export const commentApi = {
  async list(): Promise<BackendComment[]> {
    const res = await api.get<CommentListResponse>('/api/comments')
    return res?.data ?? []
  },

  async listByPost(postId: number | string): Promise<BackendComment[]> {
    const res = await api.get<CommentByPostResponse>(`/api/comments/post/${postId}`)
    return res?.data ?? []
  },

  async stats(): Promise<BackendCommentStats> {
    const res = await api.get<CommentStatsResponse>('/api/comments/stats')
    return res?.data
  },

  async create(payload: CreateCommentPayload): Promise<BackendComment | BackendCommentReply> {
    const res = await api.post<{ success: boolean; data: BackendComment | BackendCommentReply }>(
      '/api/comments',
      payload,
      { auth: true }
    )
    return res?.data
  },

  async updateStatus(id: number | string, status: string): Promise<BackendComment> {
    const res = await api.put<{ success: boolean; data: BackendComment }>(
      `/api/comments/${id}/status`,
      { status },
      { auth: true }
    )
    return res?.data
  },

  async remove(id: number | string, type: 'comment' | 'reply' = 'comment'): Promise<void> {
    await api.delete<{ success: boolean }>(`/api/comments/${id}?type=${type}`, { auth: true })
  },

  async approveAll(): Promise<number> {
    const res = await api.post<{ success: boolean; data: unknown[]; message?: string }>(
      '/api/comments/approve-all',
      {},
      { auth: true }
    )
    return res?.data?.length ?? 0
  }
}
