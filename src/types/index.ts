export type ArticleScope = 'national' | 'international'

export type ArticleStatus = 'published' | 'draft' | 'review' | 'archived'

export type UserRole = 'Super Admin' | 'Admin' | 'Editor' | 'Author' | 'User'

export type UserStatus = 'active' | 'suspended' | 'pending'

export type LanguageCode = 'en' | 'km' | 'zh'

export interface Author {
  id: string
  name: string
  username: string
  avatar: string
  role: UserRole
  bio?: string
}

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  color?: string
  articleCount: number
}

export interface Comment {
  id: string
  articleId: string
  articleTitle: string
  author: string
  avatar: string
  content: string
  date: string
  status: 'visible' | 'pending' | 'hidden' | 'reported'
  likes: number
  parentId?: string | null
  userRole?: string
}

export interface MediaItem {
  id: string
  name: string
  url: string
  type: 'image' | 'video' | 'audio' | 'document'
  size: string
  mime: string
  uploadedBy: string
  date: string
  downloads?: number
  width?: number
  height?: number
  duration?: string
}

export interface Article {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  thumbnail: string
  category: string
  categoryId: string
  scope: ArticleScope
  country?: string
  province?: string
  tags: string[]
  author: Author
  status: ArticleStatus
  publishedAt: string
  views: number
  likes: number
  commentsCount: number
  readTime: number
  isFeatured?: boolean
  isBreaking?: boolean
  isVideo?: boolean
}

export interface User {
  id: string
  name: string
  username: string
  email: string
  avatar: string
  role: UserRole
  status: UserStatus
  createdAt: string
  savedArticles: string[]
  comments: string[]
}

export interface Notification {
  id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'danger'
  date: string
  read: boolean
}

export interface ActivityLog {
  id: string
  user: string
  avatar: string
  action: string
  entity: string
  ip: string
  date: string
}

export interface Country {
  code: string
  name: string
  flag: string
}

export interface Stats {
  totalArticles: number
  nationalArticles: number
  internationalArticles: number
  users: number
  views: number
  comments: number
  drafts: number
}

export interface VisitorPoint {
  label: string
  visitors: number
  pageViews: number
  bounce?: number
}

// ============================================================================
// Backend types (Express CMS API)
// These mirror the actual JSON returned by the backend source code.
// ============================================================================

export type BackendPostStatus = 'Published' | 'Draft' | 'Pending'

export interface BackendPost {
  id: number
  title: string
  slug: string
  body: string
  excerpt: string | null
  status: string
  category_id: number | null
  type: string
  category: string
  author: string
  author_thumbnail: string | null
  thumbnail: string | null
  tags: string[]
  views: number
  comment_count: number
  created_at: string
  updated_at: string | null
  // Extra fields the backend may include / the app uses:
  user_id?: number
  author_name?: string | null
  category_name?: string | null
  scope?: string | null
  province?: string | null
  country?: string | null
}

export interface BackendCategory {
  id: number
  name: string
  slug: string
  description: string | null
  created_at: string
  count?: number
}

export interface BackendUser {
  id: number
  name: string
  username: string
  email: string
  role: string
  thumbnail: string | null
  created_at: string
  updated_at?: string | null
  bio?: string | null
}

export interface BackendCommentReply {
  id: number
  reply: string
  created_at: string
  user_id: number
  parent_id: number
  type?: string
}

export interface BackendComment {
  id: number
  comment: string
  status?: string
  created_at: string
  user_id?: number
  author?: string | null
  avatar?: string | null
  user_role?: string | null
  post_id?: number
  post_title?: string | null
  parent_id?: number | null
  type?: string
  replies?: BackendCommentReply[]
}

export interface BackendCommentStats {
  approved: number
  pending: number
  spam: number
  total: number
  replies: number
}
