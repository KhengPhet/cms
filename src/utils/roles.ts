export type DashboardRole = 'admin' | 'editor' | 'author'

export function dashboardPathForRole(role: string | null | undefined): string {
  const r = (role ?? '').toLowerCase()
  if (r === 'admin') return '/admin'
  if (r === 'editor') return '/editor'
  if (r === 'author') return '/author'
  return '/'
}

export function isDashboardRole(role: string | null | undefined): role is DashboardRole {
  return ['admin', 'editor', 'author'].includes((role ?? '').toLowerCase())
}

export function dashboardLabelForRole(role: string | null | undefined): string {
  const r = (role ?? '').toLowerCase()
  if (r === 'admin') return 'Admin Panel'
  if (r === 'editor') return 'Editor Panel'
  if (r === 'author') return 'Author Panel'
  return 'P CMS'
}
