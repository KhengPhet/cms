import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { dashboardPathForRole, isDashboardRole } from '@/utils/roles'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, _from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.hash) return { el: to.hash, behavior: 'smooth' }
    return { top: 0 }
  },
  routes: [
    {
      path: '/',
      component: () => import('@/layouts/PublicLayout.vue'),
      children: [
        { path: '', name: 'home', component: () => import('@/pages/public/HomePage.vue') },
        { path: 'national', name: 'national', component: () => import('@/pages/public/NationalNewsPage.vue') },
        { path: 'international', name: 'international', component: () => import('@/pages/public/InternationalNewsPage.vue') },
        { path: 'category/:slug', name: 'category', component: () => import('@/pages/public/CategoryPage.vue') },
        { path: 'article/:id', name: 'article-detail', component: () => import('@/pages/public/ArticleDetailPage.vue') },
        { path: 'search', name: 'search', component: () => import('@/pages/public/SearchPage.vue') },
        { path: 'profile', name: 'profile', component: () => import('@/pages/public/ProfilePage.vue') },
        { path: 'contact', name: 'contact', component: () => import('@/pages/public/ContactPage.vue') }
      ]
    },
    {
      path: '/admin',
      component: () => import('@/layouts/AdminLayout.vue'),
      meta: { requiresAuth: true, requiresRole: 'admin' },
      children: [
        { path: '', name: 'admin-dashboard', component: () => import('@/pages/admin/AdminDashboardPage.vue') },
        { path: 'articles', name: 'admin-articles', component: () => import('@/pages/admin/AdminArticlesPage.vue') },
        { path: 'articles/new', name: 'admin-article-new', component: () => import('@/pages/admin/AdminArticleEditorPage.vue') },
        { path: 'articles/:id/edit', name: 'admin-article-edit', component: () => import('@/pages/admin/AdminArticleEditorPage.vue') },
        { path: 'categories', name: 'admin-categories', component: () => import('@/pages/admin/AdminCategoriesPage.vue') },
        { path: 'media', name: 'admin-media', component: () => import('@/pages/admin/AdminMediaPage.vue') },
        { path: 'users', name: 'admin-users', component: () => import('@/pages/admin/AdminUsersPage.vue') },
        { path: 'comments', name: 'admin-comments', component: () => import('@/pages/admin/AdminCommentsPage.vue') },
        { path: 'notifications', name: 'admin-notifications', component: () => import('@/pages/admin/AdminNotificationsPage.vue') },
        { path: 'activity', name: 'admin-activity', component: () => import('@/pages/admin/AdminActivityLogsPage.vue') },
        { path: 'settings', name: 'admin-settings', component: () => import('@/pages/admin/AdminSettingsPage.vue') }
      ]
    },
    {
      path: '/editor',
      component: () => import('@/layouts/AdminLayout.vue'),
      meta: { requiresAuth: true, requiresRole: 'editor' },
      children: [
        { path: '', name: 'editor-dashboard', component: () => import('@/pages/admin/AdminDashboardPage.vue') },
        { path: 'articles', name: 'editor-articles', component: () => import('@/pages/admin/AdminArticlesPage.vue') },
        { path: 'articles/new', name: 'editor-article-new', component: () => import('@/pages/admin/AdminArticleEditorPage.vue') },
        { path: 'articles/:id/edit', name: 'editor-article-edit', component: () => import('@/pages/admin/AdminArticleEditorPage.vue') },
        { path: 'categories', name: 'editor-categories', component: () => import('@/pages/admin/AdminCategoriesPage.vue') },
        { path: 'media', name: 'editor-media', component: () => import('@/pages/admin/AdminMediaPage.vue') },
        { path: 'comments', name: 'editor-comments', component: () => import('@/pages/admin/AdminCommentsPage.vue') },
        { path: 'notifications', name: 'editor-notifications', component: () => import('@/pages/admin/AdminNotificationsPage.vue') },
        { path: 'activity', name: 'editor-activity', component: () => import('@/pages/admin/AdminActivityLogsPage.vue') }
      ]
    },
    {
      path: '/author',
      component: () => import('@/layouts/AdminLayout.vue'),
      meta: { requiresAuth: true, requiresRole: 'author' },
      children: [
        { path: '', name: 'author-dashboard', component: () => import('@/pages/admin/AdminDashboardPage.vue') },
        { path: 'articles', name: 'author-articles', component: () => import('@/pages/admin/AdminArticlesPage.vue') },
        { path: 'articles/new', name: 'author-article-new', component: () => import('@/pages/admin/AdminArticleEditorPage.vue') },
        { path: 'articles/:id/edit', name: 'author-article-edit', component: () => import('@/pages/admin/AdminArticleEditorPage.vue') },
        { path: 'media', name: 'author-media', component: () => import('@/pages/admin/AdminMediaPage.vue') },
        { path: 'notifications', name: 'author-notifications', component: () => import('@/pages/admin/AdminNotificationsPage.vue') }
      ]
    },
    {
      path: '/',
      component: () => import('@/layouts/AuthLayout.vue'),
      children: [
        { path: 'login', name: 'login', component: () => import('@/pages/auth/LoginPage.vue'), meta: { guestOnly: true } },
        { path: 'register', name: 'register', component: () => import('@/pages/auth/RegisterPage.vue'), meta: { guestOnly: true } },
        { path: 'forgot-password', name: 'forgot-password', component: () => import('@/pages/auth/ForgotPasswordPage.vue'), meta: { guestOnly: true } },
        { path: 'reset-password', name: 'reset-password', component: () => import('@/pages/auth/ResetPasswordPage.vue'), meta: { guestOnly: true } }
      ]
    },
    { path: '/:pathMatch(.*)*', redirect: '/' }
  ]
})

router.beforeEach(async (to) => {
  const auth = useAuthStore()

  if (to.meta.requiresAuth) {
    const ok = await auth.validate()
    if (!ok) return { name: 'login', query: { redirect: to.fullPath } }
    const required = to.meta.requiresRole as string | undefined
    if (required && isDashboardRole(auth.user?.role) && auth.user && (auth.user.role ?? '').toLowerCase() !== required) {
      return dashboardPathForRole(auth.user.role)
    }
    return true
  }

  if (to.meta.guestOnly && auth.token) {
    const ok = await auth.validate()
    if (ok) return dashboardPathForRole(auth.user?.role)
    return true
  }

  return true
})

export default router