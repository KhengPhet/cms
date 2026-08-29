import type {
  Article,
  ArticleStatus,
  Author,
  BackendCategory,
  BackendComment,
  BackendPost,
  BackendUser,
  Category,
  Comment
} from '@/types'
import { getAuthorImageUrl, getImageUrl } from '@/services/api'
import { readingTime } from '@/services/format'

const CATEGORY_COLORS: Record<string, string> = {
  National: '#4f46e5',
  International: '#0891b2',
  Politics: '#7c3aed',
  Technology: '#2563eb',
  Business: '#059669',
  Sports: '#ea580c',
  Education: '#0d9488',
  Entertainment: '#db2777',
  World: '#0ea5e9'
}

const SCOPE_BY_CATEGORY = new Set([
  'international',
  'world',
  'global',
  'asia',
  'europe',
  'america',
  'climate'
])

function normalizeStatus(status?: string): ArticleStatus {
  const s = (status ?? '').toLowerCase()
  if (s === 'published') return 'published'
  if (s === 'pending') return 'review'
  return 'draft'
}

function inferScope(post: BackendPost): 'national' | 'international' {
  if (post.scope) return post.scope === 'international' ? 'international' : 'national'
  const cat = (post.category ?? post.category_name ?? '').toLowerCase()
  if (SCOPE_BY_CATEGORY.has(cat)) return 'international'
  const type = (post.type ?? '').toLowerCase()
  if (type === 'national' || type === 'international') return type as 'national' | 'international'
  return 'national'
}

export function mapAuthorFromPost(post: BackendPost): Author {
  const name = post.author ?? post.author_name ?? 'Unknown'
  return {
    id: String(post.user_id ?? post.id),
    name,
    username: name.toLowerCase().replace(/\s+/g, ''),
    avatar: getAuthorImageUrl(post.author_thumbnail),
    role: 'Author',
    bio: ''
  }
}

export function mapPostToArticle(post: BackendPost): Article {
  const content = post.body ?? ''
  const categoryId = post.category_id != null ? String(post.category_id) : 'uncategorized'
  const category = post.category ?? post.category_name ?? 'Uncategorized'
  const commentCount = typeof post.comment_count === 'number' ? post.comment_count : 0

  return {
    id: String(post.id),
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt ?? '',
    content,
    thumbnail: getImageUrl(post.thumbnail),
    category,
    categoryId,
    scope: inferScope(post),
    tags: Array.isArray(post.tags) ? post.tags : [],
    author: mapAuthorFromPost(post),
    status: normalizeStatus(post.status),
    publishedAt: post.created_at,
    views: post.views ?? 0,
    likes: 0,
    commentsCount: commentCount,
    readTime: readingTime(content),
    isFeatured: false,
    isBreaking: false,
    isVideo: (post.type ?? '') === 'video'
  }
}

const COLOR_STYLES: string[] = ['#4f46e5', '#0891b2', '#7c3aed', '#2563eb', '#059669', '#ea580c', '#0d9488', '#db2777']

export function mapCategory(c: BackendCategory, index = 0): Category {
  return {
    id: String(c.id),
    name: c.name,
    slug: c.slug,
    description: c.description ?? '',
    color: CATEGORY_COLORS[c.name] ?? COLOR_STYLES[index % COLOR_STYLES.length],
    articleCount: c.count ?? 0
  }
}

export function mapCategories(list: BackendCategory[]): Category[] {
  return list.map((c, i) => mapCategory(c, i))
}

export function mapUserToAuthor(u: BackendUser): Author {
  return {
    id: String(u.id),
    name: u.name,
    username: u.name.toLowerCase().replace(/\s+/g, ''),
    avatar: getAuthorImageUrl(u.thumbnail),
    role: (u.role.charAt(0).toUpperCase() + u.role.slice(1)) as Author['role'],
    bio: ''
  }
}

export function mapComment(c: BackendComment): Comment {
  return {
    id: String(c.id),
    articleId: c.post_id != null ? String(c.post_id) : '',
    articleTitle: c.post_title ?? '',
    author: c.author ?? 'Anonymous',
    avatar: getAuthorImageUrl(c.avatar),
    content: c.comment,
    date: c.created_at,
    status: normalizeCommentStatus(c.status),
    likes: 0,
    parentId: c.parent_id != null ? String(c.parent_id) : null
  }
}

function normalizeCommentStatus(status?: string): Comment['status'] {
  const s = (status ?? '').toLowerCase()
  if (s === 'approved' || s === 'visible') return 'visible'
  if (s === 'spam') return 'reported'
  return 'pending'
}

export const colorForCategory = (name: string): string => CATEGORY_COLORS[name] ?? '#4f46e5'
