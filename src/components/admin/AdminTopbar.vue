<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  Menu,
  Search,
  Bell,
  Sun,
  Moon,
  ChevronDown,
  Settings,
  LogOut,
  LayoutDashboard,
  CheckCheck,
  User as UserIcon
} from '@lucide/vue'
import { useAppStore } from '@/stores/app'
import { useNotificationsStore } from '@/stores/notifications'
import { useAuthStore } from '@/stores/auth'
import { useToast } from '@/composables/useToast'
import { timeAgo } from '@/services/format'
import { useClickOutside } from '@/composables/useClickOutside'
import { LANGUAGES } from '@/services/i18n'
import { imageErrorHandler, PLACEHOLDER_IMAGE } from '@/utils/getImageUrl'
import { useDashboardBase } from '@/composables/useDashboardBase'
import type { LanguageCode } from '@/types'

const app = useAppStore()
const notif = useNotificationsStore()
const auth = useAuthStore()
const route = useRoute()
const { base } = useDashboardBase()
const roleKey = computed(() => (auth.user?.role ?? '').toLowerCase())
const showSettings = computed(() => roleKey.value === 'admin' || roleKey.value === 'editor')
const router = useRouter()
const toast = useToast()

const searchOpen = ref(false)
const notifOpen = ref(false)
const userOpen = ref(false)
const langOpen = ref(false)

const notifRoot = ref<HTMLElement | null>(null)
const userRoot = ref<HTMLElement | null>(null)
const langRoot = ref<HTMLElement | null>(null)
useClickOutside(notifRoot, () => (notifOpen.value = false))
useClickOutside(userRoot, () => (userOpen.value = false))
useClickOutside(langRoot, () => (langOpen.value = false))

const pageTitle = computed(() => {
  const parts = route.path.split('/').filter(Boolean)
  if (parts.length < 2) return 'Dashboard'
  const map: Record<string, string> = {
    articles: 'Article Management',
    categories: 'Categories',
    media: 'Media Library',
    users: 'User Management',
    comments: 'Comment Management',
    notifications: 'Notification Center',
    activity: 'Activity Logs',
    settings: 'Website Settings',
    'articles/new': 'Create Article',
    'articles/edit': 'Edit Article'
  }
  return map[parts.slice(1).join('/')] ?? map[parts[1]] ?? 'Dashboard'
})

const notifTone = {
  info: 'bg-sky-500',
  success: 'bg-emerald-500',
  warning: 'bg-amber-500',
  danger: 'bg-red-500'
}

function logout() {
  auth.logout()
  toast.success('Signed out successfully')
  router.push('/login')
}
</script>

<template>
  <header class="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-gray-100 bg-white/95 px-4 backdrop-blur dark:border-gray-700 dark:bg-gray-900/95 lg:px-6">
    <button
      class="rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100 lg:hidden dark:text-gray-300 dark:hover:bg-gray-800"
      @click="app.openMobileSidebar()"
    >
      <Menu class="h-5 w-5" />
    </button>
    <button
      class="hidden rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100 lg:block dark:text-gray-300 dark:hover:bg-gray-800"
      @click="app.toggleSidebar()"
    >
      <Menu class="h-5 w-5" />
    </button>

    <div class="min-w-0 flex-1">
      <h1 class="truncate text-lg font-extrabold text-gray-900 dark:text-white">{{ pageTitle }}</h1>
      <p class="hidden text-xs text-gray-400 sm:block">
        {{ new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }) }}
      </p>
    </div>

    <div class="flex items-center gap-1.5">
      <div v-if="searchOpen" class="relative">
        <input
          autofocus
          placeholder="Search admin…"
          class="w-40 rounded-lg border border-gray-200 bg-gray-50 py-2 pl-8 pr-3 text-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 sm:w-56 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          @keydown.enter="searchOpen = false"
          @blur="searchOpen = false"
        />
        <Search class="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
      </div>
      <button
        v-else
        class="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-800 dark:text-gray-400 dark:hover:bg-gray-800"
        @click="searchOpen = true"
      >
        <Search class="h-5 w-5" />
      </button>

      <button
        class="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-800 dark:text-gray-400 dark:hover:bg-gray-800"
        title="Toggle dark mode"
        @click="app.toggleDark()"
      >
        <Sun v-if="app.darkMode" class="h-5 w-5" />
        <Moon v-else class="h-5 w-5" />
      </button>

      <div ref="langRoot" class="relative hidden md:block">
        <button
          class="flex items-center gap-1 rounded-lg border border-gray-200 px-2 py-1.5 text-xs font-bold text-gray-600 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
          @click="langOpen = !langOpen"
        >
          {{ app.language.toUpperCase() }}
          <ChevronDown class="h-3 w-3" />
        </button>
        <Transition name="dd">
          <div
            v-if="langOpen"
            class="absolute right-0 z-50 mt-2 w-40 rounded-xl border border-gray-100 bg-white p-1.5 shadow-card dark:border-gray-700 dark:bg-gray-800"
          >
            <button
              v-for="l in LANGUAGES"
              :key="l.code"
              class="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-gray-50 dark:hover:bg-gray-700"
              @click="app.setLanguage(l.code as LanguageCode); langOpen = false"
            >
              {{ l.native }}
              <span class="text-xs text-gray-400">{{ l.label }}</span>
            </button>
          </div>
        </Transition>
      </div>

      <div ref="notifRoot" class="relative">
        <button
          class="relative rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-800 dark:text-gray-400 dark:hover:bg-gray-800"
          @click="notifOpen = !notifOpen"
        >
          <Bell class="h-5 w-5" />
          <span
            v-if="notif.unreadCount > 0"
            class="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white"
          >
            {{ notif.unreadCount }}
          </span>
        </button>
        <Transition name="dd">
          <div
            v-if="notifOpen"
            class="absolute right-0 z-50 mt-2 w-80 origin-top-right rounded-2xl border border-gray-100 bg-white shadow-card dark:border-gray-700 dark:bg-gray-800"
          >
            <div class="flex items-center justify-between border-b border-gray-100 px-4 py-3 dark:border-gray-700">
              <span class="text-sm font-bold text-gray-900 dark:text-white">Notifications</span>
              <div class="flex items-center gap-2">
                <button
                  class="flex items-center gap-1 text-[11px] font-semibold text-primary-600 hover:underline dark:text-primary-400"
                  @click="notif.markAllRead(); toast.success('All notifications marked as read')"
                >
                  <CheckCheck class="h-3.5 w-3.5" /> Mark all read
                </button>
              </div>
            </div>
            <div class="max-h-80 divide-y divide-gray-50 overflow-y-auto dark:divide-gray-700">
              <button
                v-for="n in notif.notifications"
                :key="n.id"
                class="flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/40"
                @click="notif.markRead(n.id)"
              >
                <span :class="['mt-1 flex h-2.5 w-2.5 shrink-0 rounded-full', n.read ? 'bg-gray-200 dark:bg-gray-600' : notifTone[n.type]]" />
                <span class="flex-1">
                  <span class="flex items-center justify-between gap-2">
                    <span :class="['text-[13px] font-semibold', n.read ? 'text-gray-500 dark:text-gray-400' : 'text-gray-900 dark:text-white']">
                      {{ n.title }}
                    </span>
                    <span class="shrink-0 text-[10px] text-gray-400">{{ timeAgo(n.date) }}</span>
                  </span>
                  <span class="mt-0.5 block text-xs leading-relaxed text-gray-500 dark:text-gray-400">{{ n.message }}</span>
                </span>
              </button>
            </div>
            <div class="border-t border-gray-100 p-2 dark:border-gray-700">
              <router-link
                :to="`${base}/notifications`"
                class="block rounded-lg py-2 text-center text-sm font-bold text-primary-600 transition-colors hover:bg-primary-50 dark:text-primary-400 dark:hover:bg-primary-900/30"
                @click="notifOpen = false"
              >
                View all notifications
              </router-link>
            </div>
          </div>
        </Transition>
      </div>

      <div ref="userRoot" class="relative">
        <button
          class="flex items-center gap-2 rounded-full py-1 pl-1 pr-2 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800"
          @click="userOpen = !userOpen"
        >
          <img v-if="auth.user" :src="auth.user.avatar || PLACEHOLDER_IMAGE" alt="avatar" class="h-9 w-9 rounded-full ring-2 ring-primary-500/60" @error="imageErrorHandler" />
          <div v-else class="flex h-9 w-9 items-center justify-center rounded-full bg-primary-600 text-sm font-bold text-white">
            G
          </div>
          <div class="hidden text-left sm:block">
            <p class="text-xs font-bold text-gray-900 dark:text-white">{{ auth.user?.name ?? 'Guest' }}</p>
            <p class="text-[10px] font-medium text-gray-400">{{ auth.user?.role ?? '—' }}</p>
          </div>
          <ChevronDown class="hidden h-4 w-4 text-gray-400 sm:block" />
        </button>
        <Transition name="dd">
          <div
            v-if="userOpen"
            class="absolute right-0 z-50 mt-2 w-52 origin-top-right rounded-2xl border border-gray-100 bg-white p-1.5 shadow-card dark:border-gray-700 dark:bg-gray-800"
          >
            <div class="border-b border-gray-100 px-3 py-3 dark:border-gray-700">
              <p class="text-sm font-bold text-gray-900 dark:text-white">{{ auth.user?.name }}</p>
              <p class="truncate text-xs text-gray-400">{{ auth.user?.email }}</p>
            </div>
            <div class="py-1">
              <router-link to="/profile" class="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-700">
                <UserIcon class="h-4 w-4 text-gray-400" /> My profile
              </router-link>
              <router-link :to="base" class="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-700">
                <LayoutDashboard class="h-4 w-4 text-gray-400" /> Dashboard
              </router-link>
              <router-link v-if="showSettings" :to="`${base}/settings`" class="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-700">
                <Settings class="h-4 w-4 text-gray-400" /> Settings
              </router-link>
            </div>
            <div class="border-t border-gray-100 py-1 dark:border-gray-700">
              <button class="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:hover:bg-red-900/30" @click="logout">
                <LogOut class="h-4 w-4" /> Sign out
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </div>
  </header>
</template>

<style scoped>
.dd-enter-active,
.dd-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.dd-enter-from,
.dd-leave-to {
  opacity: 0;
  transform: translateY(-6px) scale(0.98);
}
</style>