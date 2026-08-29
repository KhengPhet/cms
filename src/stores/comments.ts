import { defineStore } from 'pinia'
import { commentApi } from '@/services/commentApi'
import { mapComment } from '@/services/mappers'
import type { Comment } from '@/types'

export const useCommentsStore = defineStore('comments', {
  state: () => ({
    comments: [] as Comment[],
    loading: false,
    error: ''
  }),
  getters: {
    pending: (s) => s.comments.filter((c) => c.status === 'pending' || c.status === 'reported'),
    approved: (s) => s.comments.filter((c) => c.status === 'visible'),
    byCount:
      (s) =>
      (articleId: string): number =>
        s.comments.filter((c) => c.articleId === articleId && c.status === 'visible').length
  },
  actions: {
    async fetchAll(force = false) {
      if (this.loading) return
      if (!force && this.comments.length) return
      this.loading = true
      try {
        const list = await commentApi.list()
        this.comments = list.map(mapComment)
      } catch (err) {
        this.error = err instanceof Error ? err.message : 'Failed to load comments'
      } finally {
        this.loading = false
      }
    },

    async fetchByPost(postId: string, force = false) {
      if (!force && this.comments.some((c) => c.articleId === postId)) return
      this.loading = true
      try {
        const list = await commentApi.listByPost(postId)
        const existing = this.comments.filter((c) => c.articleId !== postId)
        this.comments = [...existing, ...list.map(mapComment)]
      } catch (err) {
        this.error = err instanceof Error ? err.message : 'Failed to load comments'
      } finally {
        this.loading = false
      }
    },

    async addComment(input: { comment: string; articleId: string; parentId?: string | null }) {
      try {
        await commentApi.create({
          comment: input.comment,
          post_id: input.articleId,
          parent_id: input.parentId ?? undefined
        })
        await this.fetchByPost(input.articleId, true)
      } catch (err) {
        this.error = err instanceof Error ? err.message : 'Failed to post comment'
        throw err
      }
    },

    async setStatus(id: string, status: Comment['status']) {
      const c = this.comments.find((x) => x.id === id)
      if (!c) return
      const backendStatus = toBackendCommentStatus(status)
      try {
        await commentApi.updateStatus(id, backendStatus)
        c.status = status
      } catch (err) {
        this.error = err instanceof Error ? err.message : 'Failed to update comment'
      }
    },

    async deleteComment(id: string, type: 'comment' | 'reply' = 'comment') {
      await commentApi.remove(id, type)
      this.comments = this.comments.filter((c) => c.id !== id)
    },

    async approveAll() {
      await commentApi.approveAll()
      this.comments.forEach((c) => {
        if (c.status === 'pending') c.status = 'visible'
      })
    }
  }
})

function toBackendCommentStatus(status: Comment['status']): string {
  if (status === 'visible') return 'Approved'
  if (status === 'reported') return 'Spam'
  return 'Pending'
}
