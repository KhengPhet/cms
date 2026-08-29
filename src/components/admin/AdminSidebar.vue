<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAppStore } from '@/stores/app'
import {
  LayoutDashboard,
  FileText,
  FolderOpen,
  Image as ImageIcon,
  Users,
  MessageSquare,
  Settings,
  Activity,
  ChevronLeft,
  X,
  Newspaper
} from '@lucide/vue'

const app = useAppStore()
const route = useRoute()
const collapsed = computed(() => app.sidebarCollapsed)

interface NavItem {
  label: string
  to: string
  icon: typeof LayoutDashboard
}

interface NavGroup {
  title: string
  items: NavItem[]
}

const groups: NavGroup[] = [
  {
    title: 'Overview',
    items: [{ label: 'Dashboard', to: '/admin', icon: LayoutDashboard }]
  },
  {
    title: 'Content',
    items: [
      { label: 'Articles', to: '/admin/articles', icon: FileText },
      { label: 'Categories', to: '/admin/categories', icon: FolderOpen },
      { label: 'Media Library', to: '/admin/media', icon: ImageIcon }
    ]
  },
  {
    title: 'Community',
    items: [
      { label: 'Users', to: '/admin/users', icon: Users },
      { label: 'Comments', to: '/admin/comments', icon: MessageSquare }
    ]
  },
  {
    title: 'System',
    items: [
      { label: 'Activity Logs', to: '/admin/activity', icon: Activity },
      { label: 'Settings', to: '/admin/settings', icon: Settings }
    ]
  }
]

function isCurrent(to: string): boolean {
  return to === '/admin' ? route.path === '/admin' : route.path.startsWith(to)
}
</script>

<template>
  <aside
    :class="[
      'fixed inset-y-0 left-0 z-40 flex flex-col border-r border-gray-100 bg-white transition-all duration-300 dark:border-gray-700 dark:bg-gray-900',
      collapsed ? 'w-[72px] lg:w-[72px]' : 'w-[260px]',
      app.mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
    ]"
  >
    <div class="flex h-16 items-center justify-between border-b border-gray-100 px-4 dark:border-gray-700">
      <div v-if="!collapsed || app.mobileSidebarOpen" class="flex items-center gap-2">
        <svg width="32" height="32" viewBox="0 0 48 48" class="rounded-lg">
          <rect width="48" height="48" rx="12" fill="#4f46e5" />
          <path d="M13 14h22v6H13z" fill="#fff" />
          <path d="M18 24h12v4H18z" fill="#c7d2fe" />
          <path d="M18 31h12v4H18z" fill="#c7d2fe" />
        </svg>
        <div class="leading-tight">
          <span class="block text-sm font-extrabold text-gray-900 dark:text-white">Global CMS</span>
          <span class="block text-[9px] font-semibold uppercase tracking-widest text-primary-600 dark:text-primary-400">Admin Panel</span>
        </div>
      </div>
      <div v-else :class="['flex', collapsed && !app.mobileSidebarOpen ? 'justify-center' : '']">
        <svg width="32" height="32" viewBox="0 0 48 48" class="rounded-lg">
          <rect width="48" height="48" rx="12" fill="#4f46e5" />
          <path d="M13 14h22v6H13z" fill="#fff" />
          <path d="M18 24h12v4H18z" fill="#c7d2fe" />
          <path d="M18 31h12v4H18z" fill="#c7d2fe" />
        </svg>
      </div>
      <button
        class="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 lg:hidden dark:hover:bg-gray-800"
        @click="app.closeMobileSidebar()"
      >
        <X class="h-5 w-5" />
      </button>
    </div>

    <nav class="flex-1 space-y-5 overflow-y-auto px-3 py-4">
      <div v-for="group in groups" :key="group.title">
        <p v-if="!collapsed" class="mb-1.5 px-3 text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
          {{ group.title }}
        </p>
        <div class="space-y-0.5">
          <router-link
            v-for="item in group.items"
            :key="item.label"
            :to="item.to"
            class="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all"
            :class="[
              isCurrent(item.to)
                ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100',
              collapsed ? 'justify-center px-2' : ''
            ]"
            :title="item.label"
            @click="app.closeMobileSidebar()"
          >
            <component :is="item.icon" class="h-5 w-5 shrink-0" />
            <span v-if="!collapsed" class="truncate">{{ item.label }}</span>
          </router-link>
        </div>
      </div>
    </nav>

    <div class="border-t border-gray-100 p-3 dark:border-gray-700">
      <router-link
        to="/"
        class="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-800 dark:text-gray-400 dark:hover:bg-gray-800"
        :class="collapsed ? 'justify-center' : ''"
      >
        <Newspaper class="h-5 w-5 shrink-0" />
        <span v-if="!collapsed">View public site</span>
      </router-link>
      <button
        class="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-800 dark:text-gray-400 dark:hover:bg-gray-800"
        :class="collapsed ? 'justify-center' : ''"
        @click="app.toggleSidebar()"
      >
        <ChevronLeft :class="['h-5 w-5 shrink-0 transition-transform', collapsed ? 'rotate-180' : '']" />
        <span v-if="!collapsed">Collapse</span>
      </button>
    </div>
  </aside>

  <div
    v-if="app.mobileSidebarOpen"
    class="fixed inset-0 z-30 bg-gray-900/50 backdrop-blur-sm lg:hidden"
    @click="app.closeMobileSidebar()"
  />
</template>