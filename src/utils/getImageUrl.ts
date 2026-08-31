export type ImageValue = string | null | undefined

import { getApiBaseUrl } from '@/utils/apiBaseUrl'

function baseUrl(): string {
  return getApiBaseUrl()
}

function isAbsolute(image: string): boolean {
  return (
    image.startsWith('http://') ||
    image.startsWith('https://') ||
    image.startsWith('data:') ||
    image.startsWith('blob:') ||
    image.startsWith('//')
  )
}

export const PLACEHOLDER_IMAGE = '/placeholder-image.png'

/**
 * Convert any thumbnail value the API may return into a full URL the
 * <img> tag can load. Handles:
 *   "/uploads/posts/example.png"
 *   "uploads/posts/example.png"
 *   "posts/example.png"
 *   "example.png"
 *   "http://localhost:8080/uploads/posts/example.png"
 *   "https://example.com/image.png"
 *   "data:image/..."
 *   "blob:..."
 * Returns '' for null/undefined/empty so callers can fall back cleanly.
 */
export function getImageUrl(value: ImageValue): string {
  if (value === null || value === undefined) return ''
  const image = String(value).trim()
  if (!image) return ''

  if (isAbsolute(image)) return image

  if (image.startsWith('/uploads/')) {
    const url = `${baseUrl()}${image}`
    console.log('IMAGE URL:', url)
    return url
  }
  if (image.startsWith('uploads/')) {
    const url = `${baseUrl()}/${image}`
    console.log('IMAGE URL:', url)
    return url
  }
  if (image.startsWith('posts/')) {
    const url = `${baseUrl()}/uploads/${image}`
    console.log('IMAGE URL:', url)
    return url
  }

  // Bare filename (e.g. "example.png") -> assume posts folder.
  const url = `${baseUrl()}/uploads/posts/${image}`
  console.log('IMAGE URL:', url)
  return url
}

/**
 * Same as getImageUrl but for author/user avatars. Avatars are stored under
 * /uploads/users/, so bare filenames resolve there (not posts).
 */
export function getAuthorImageUrl(value: ImageValue): string {
  if (value === null || value === undefined) return ''
  const image = String(value).trim()
  if (!image) return ''

  if (isAbsolute(image)) return image

  if (image.startsWith('/uploads/')) return `${baseUrl()}${image}`
  if (image.startsWith('../uploads/')) return `${baseUrl()}${image.slice(2)}`
  if (image.startsWith('uploads/')) return `${baseUrl()}/${image}`
  if (image.startsWith('users/')) return `${baseUrl()}/uploads/${image}`
  if (image.startsWith('posts/')) return `${baseUrl()}/uploads/${image}`

  // Bare filename for an avatar -> assume the users folder.
  return `${baseUrl()}/uploads/users/${image}`
}

/**
 * Normalize any user-provided thumbnail into a full URL.
 * Works with both relative paths ("/uploads/users/x.jpg", "uploads/posts/y.png")
 * and absolute URLs.
 */
export function getUserThumbnailUrl(value: ImageValue): string {
  return getAuthorImageUrl(value)
}

/**
 * Vue <img> @error handler. Shows the placeholder once and never loops.
 *
 *   <img :src="getImageUrl(post.thumbnail)" @error="imageErrorHandler" />
 */
export function imageErrorHandler(event: Event): void {
  const img = event.target as HTMLImageElement | null
  if (!img || typeof img.dataset === 'undefined') return
  if (img.dataset.fallback === 'true') return
  img.dataset.fallback = 'true'
  img.src = PLACEHOLDER_IMAGE
  img.onerror = null
}

export const handleImageError = imageErrorHandler