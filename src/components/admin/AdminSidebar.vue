<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAppStore } from '@/stores/app'
import { useAuthStore } from '@/stores/auth'
import { useSettingsStore } from '@/stores/settings'
import { dashboardLabelForRole } from '@/utils/roles'
import { useDashboardBase } from '@/composables/useDashboardBase'
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
const auth = useAuthStore()
const settings = useSettingsStore()
const { base } = useDashboardBase()
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

const p = (path: string) => `${base.value}${path}`

const groups = computed<NavGroup[]>(() => {
  const role = (auth.user?.role ?? '').toLowerCase()

  // Common dashboard entry, always first.
  const overview: NavGroup = {
    title: 'Overview',
    items: [{ label: 'Dashboard', to: base.value, icon: LayoutDashboard }]
  }

  // Content items available to staff roles.
  const content: NavGroup = {
    title: 'Content',
    items: [
      { label: 'Articles', to: p('/articles'), icon: FileText },
      ...(role === 'admin' || role === 'editor' ? [{ label: 'Categories', to: p('/categories'), icon: FolderOpen }] : []),
      { label: 'Media Library', to: p('/media'), icon: ImageIcon }
    ]
  }

  if (role === 'author') {
    return [
      overview,
      content,
      {
        title: 'System',
        items: [{ label: 'Notifications', to: p('/notifications'), icon: Activity }]
      }
    ]
  }

  if (role === 'editor') {
    return [
      overview,
      content,
      {
        title: 'Community',
        items: [{ label: 'Comments', to: p('/comments'), icon: MessageSquare }]
      },
      {
        title: 'System',
        items: [{ label: 'Activity Logs', to: p('/activity'), icon: Activity }]
      }
    ]
  }

  return [
    overview,
    content,
    {
      title: 'Community',
      items: [
        { label: 'Users', to: p('/users'), icon: Users },
        { label: 'Comments', to: p('/comments'), icon: MessageSquare }
      ]
    },
    {
      title: 'System',
      items: [
        { label: 'Activity Logs', to: p('/activity'), icon: Activity },
        { label: 'Settings', to: p('/settings'), icon: Settings }
      ]
    }
  ]
})

function isCurrent(to: string): boolean {
  return to === base.value ? route.path === base.value : route.path.startsWith(to)
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
    <div class="flex items-center justify-between h-16 px-4 border-b border-gray-100 dark:border-gray-700">
      <div v-if="!collapsed || app.mobileSidebarOpen" class="flex items-center gap-2">
        <img src="/p-new.png" alt="logo" class="object-cover w-8 h-8 rounded-lg" />
        <div class="leading-tight">
          <span class="block text-sm font-extrabold text-gray-900 dark:text-white">{{ settings.appName2 }}</span>
          <span class="block text-[9px] font-semibold uppercase tracking-widest text-primary-600 dark:text-primary-400">{{ dashboardLabelForRole(auth.user?.role) }}</span>
        </div>
      </div>
      <div v-else :class="['flex', collapsed && !app.mobileSidebarOpen ? 'justify-center' : '']">
        <img src="/p-new.png" alt="logo" class="object-cover w-8 h-8 rounded-lg" />
      </div>
      <button
        class="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 lg:hidden dark:hover:bg-gray-800"
        @click="app.closeMobileSidebar()"
      >
        <X class="w-5 h-5" />
      </button>
    </div>

    <nav class="flex-1 px-3 py-4 space-y-5 overflow-y-auto">
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
            <component :is="item.icon" class="w-5 h-5 shrink-0" />
            <span v-if="!collapsed" class="truncate">{{ item.label }}</span>
          </router-link>
        </div>
      </div>
    </nav>

    <div class="p-3 border-t border-gray-100 dark:border-gray-700">
      <router-link
        to="/"
        class="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-800 dark:text-gray-400 dark:hover:bg-gray-800"
        :class="collapsed ? 'justify-center' : ''"
      >
        <Newspaper class="w-5 h-5 shrink-0" />
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