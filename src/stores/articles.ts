import { defineStore } from 'pinia'
import { postApi } from '@/services/postApi'
import { categoryApi } from '@/services/categoryApi'
import { mapCategories, mapCategory, mapPostToArticle } from '@/services/mappers'
import type { Article, ArticleStatus, Category } from '@/types'

export const useArticlesStore = defineStore('articles', {
  state: () => ({
    articles: [] as Article[],
    categories: [] as Category[],
    loading: false,
    error: ''
  }),
  getters: {
    published: (s): Article[] => s.articles.filter((a) => a.status === 'published'),
    drafts: (s): Article[] => s.articles.filter((a) => a.status === 'draft' || a.status === 'review'),
    featured(): Article[] {
      return this.published.slice(0, 4)
    },
    breaking(): Article[] {
      return this.published.slice(0, 3)
    },
    video(): Article[] {
      return this.published.filter((a) => a.isVideo)
    },
    national(): Article[] {
      return this.published.filter((a) => a.scope === 'national')
    },
    international(): Article[] {
      return this.published.filter((a) => a.scope === 'international')
    },
    byId: (s) => (id: string) => s.articles.find((a) => a.id === id) ?? (null as Article | null),
    totalViews: (s) => s.articles.reduce((sum, a) => sum + a.views, 0),
    categoryCounts: (s) => {
      const counts: Record<string, number> = {}
      s.categories.forEach((c) => {
        counts[c.id] = s.articles.filter((a) => a.categoryId === c.id).length
      })
      return counts
    },
    byCategoryId(): (id: string) => Article[] {
      return (id: string) => this.published.filter((a) => a.categoryId === id)
    },
    byScope(): (scope: 'national' | 'international') => Article[] {
      return (scope) => this.published.filter((a) => a.scope === scope)
    }
  },
  actions: {
    async loadCategories() {
      try {
        const list = await categoryApi.list()
        this.categories = mapCategories(list)
      } catch {
        this.categories = []
      }
    },

    async fetchAll(force = false) {
      if (this.loading) return
      if (!force && (this.articles.length || this.error)) return
      this.loading = true
      this.error = ''
      try {
        const posts = await postApi.list()
        this.articles = posts.map(mapPostToArticle)
        if (!this.categories.length) await this.loadCategories()
        this.syncCategories()
      } catch (err) {
        this.error = err instanceof Error ? err.message : 'Failed to load articles'
      } finally {
        this.loading = false
      }
    },

    async setStatus(id: string, status: ArticleStatus) {
      const a = this.articles.find((x) => x.id === id)
      if (!a) return
      try {
        await postApi.update(id, {
          title: a.title,
          slug: a.slug,
          body: a.content,
          excerpt: a.excerpt,
          status: toBackendStatus(status),
          category_id: a.categoryId !== 'uncategorized' ? a.categoryId : undefined,
          type: a.scope,
          tags: a.tags
        })
        a.status = status
      } catch (err) {
        this.error = err instanceof Error ? err.message : 'Failed to update status'
      }
    },

    async deleteArticle(id: string) {
      await postApi.remove(id)
      this.articles = this.articles.filter((a) => a.id !== id)
      this.syncCategories()
    },

    async saveArticle(article: Article) {
      const existing = this.articles.find((a) => a.id === article.id)
      const isNew = !existing
      const thumbnailFile = article.thumbnail?.startsWith('data:') ? dataUrlToFile(article.thumbnail) : null

      const payload = {
        title: article.title,
        slug: article.slug,
        body: article.content,
        excerpt: article.excerpt,
        status: toBackendStatus(article.status),
        category_id: article.categoryId !== 'uncategorized' ? article.categoryId : undefined,
        type: article.scope,
        tags: article.tags,
        thumbnail: thumbnailFile
      }

      const saved = isNew
        ? await postApi.create(payload)
        : await postApi.update(article.id, payload)

      const mapped = mapPostToArticle(saved)
      const i = this.articles.findIndex((a) => a.id === String(saved.id))
      if (i >= 0) this.articles[i] = mapped
      else this.articles.unshift(mapped)
      this.syncCategories()
      return mapped
    },

    async upsertCategory(category: Category) {
      const existing = this.categories.find((c) => c.id === category.id)
      if (existing) {
        await categoryApi.update(category.id, {
          name: category.name,
          slug: category.slug,
          description: category.description
        })
        this.categories[this.categories.indexOf(existing)] = category
      } else {
        const created = await categoryApi.create({
          name: category.name,
          slug: category.slug,
          description: category.description
        })
        this.categories.unshift(mapCategory(created))
      }
    },

    async deleteCategory(id: string) {
      await categoryApi.remove(id)
      this.categories = this.categories.filter((c) => c.id !== id)
    },

    syncCategories() {
      this.categories.forEach((c) => {
        c.articleCount = this.articles.filter((a) => a.categoryId === c.id && a.status === 'published').length
      })
    },

    async incrementViews(id: string) {
      const a = this.articles.find((x) => x.id === id)
      if (!a) return
      try {
        const views = await postApi.incrementView(id)
        a.views = views
      } catch {
        a.views += 1
      }
    }
  }
})

function toBackendStatus(status: ArticleStatus): string {
  if (status === 'published') return 'Published'
  if (status === 'review') return 'Pending'
  return 'Draft'
}

function dataUrlToFile(dataUrl: string): File | null {
  const m = dataUrl.match(/^data:([^;]+);base64,(.*)$/s)
  if (!m) return null
  const mime = m[1]
  const binary = atob(m[2])
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  const ext = mime.split('/')[1]?.replace('+xml', '') || 'png'
  return new File([bytes], `post-${Date.now()}.${ext}`, { type: mime })
}
