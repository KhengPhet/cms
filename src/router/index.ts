import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

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
      meta: { requiresAuth: true },
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

router.beforeEach((to) => {
  const auth = useAuthStore()
  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }
  if (to.meta.guestOnly && auth.isAuthenticated) {
    return { name: 'admin-dashboard' }
  }
  return true
})

export default router