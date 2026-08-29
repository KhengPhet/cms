<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from '@/composables/useI18n'
import { useAppStore } from '@/stores/app'
import { useArticlesStore } from '@/stores/articles'
import { LANGUAGES } from '@/services/i18n'
import { useClickOutside } from '@/composables/useClickOutside'
import { useAuthStore } from '@/stores/auth'
import {
  Search,
  Menu,
  X,
  ChevronDown,
  Flame,
  Phone
} from '@lucide/vue'
import router from '@/router'

const { t } = useI18n()
const app = useAppStore()
const articlesStore = useArticlesStore()
const auth = useAuthStore()

const mobileOpen = ref(false)
const langOpen = ref(false)
const langRoot = ref<HTMLElement | null>(null)
useClickOutside(langRoot, () => (langOpen.value = false))

const breaking = articlesStore.breaking[0]

const navItems = [
  { label: 'nav.home', to: '/' },
  { label: 'nav.national', to: '/national' },
  { label: 'nav.international', to: '/international' },
  { label: 'nav.politics', to: '/category/politics' },
  { label: 'nav.technology', to: '/category/technology' },
  { label: 'nav.business', to: '/category/business' },
  { label: 'nav.sports', to: '/category/sports' },
  { label: 'nav.entertainment', to: '/category/entertainment' },
  { label: 'nav.education', to: '/category/education' },
  { label: 'nav.contact', to: '/contact' }
]

function goSearch() {
  router.push({ path: '/search' })
}
</script>

<template>
  <header class="sticky top-0 z-50">
    <div class="bg-gradient-to-r from-red-600 via-red-500 to-primary-600 text-white">
      <div class="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-1.5 text-xs">
        <div class="flex min-w-0 items-center gap-2">
          <span class="inline-flex shrink-0 items-center gap-1.5 rounded bg-white/15 px-2 py-0.5 font-bold uppercase tracking-widest">
            <Flame class="h-3 w-3" /> {{ t('common.breaking') }}
          </span>
          <span v-if="breaking" class="hidden truncate font-medium sm:block">
            {{ breaking.title }}
          </span>
        </div>
        <div class="hidden shrink-0 items-center gap-4 md:flex">
          <span class="flex items-center gap-1.5 text-white/80"><Phone class="h-3 w-3" /> +855 23 000 000</span>
          <span class="text-white/40">|</span>
          <a href="/contact">Contact Us</a>
        </div>
      </div>
    </div>

    <div class="border-b border-gray-100 bg-white/95 backdrop-blur dark:border-gray-700 dark:bg-gray-900/95">
      <div class="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3">
        <button
          class="rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100 lg:hidden dark:text-gray-300 dark:hover:bg-gray-800"
          @click="mobileOpen = !mobileOpen"
        >
          <Menu v-if="!mobileOpen" class="h-6 w-6" />
          <X v-else class="h-6 w-6" />
        </button>

        <a href="/" class="flex shrink-0 items-center gap-2.5" @click.prevent="router.push('/')">
          <svg width="40" height="40" viewBox="0 0 48 48" class="rounded-xl">
            <rect width="48" height="48" rx="12" fill="#4f46e5" />
            <path d="M13 14h22v6H13z" fill="#fff" />
            <path d="M18 24h12v4H18z" fill="#c7d2fe" />
            <path d="M18 31h12v4H18z" fill="#c7d2fe" />
          </svg>
          <div class="leading-tight">
            <span class="block text-lg font-extrabold tracking-tight text-gray-900 dark:text-white">Global CMS</span>
            <span class="block text-[10px] font-semibold uppercase tracking-widest text-primary-600 dark:text-primary-400">
              {{ t('app.tagline') }}
            </span>
          </div>
        </a>

        <div class="ml-auto flex items-center gap-2">
          <div class="relative hidden md:block">
            <input
              placeholder="Search…"
              class="w-48 rounded-full border border-gray-200 bg-gray-50 py-2 pl-9 pr-4 text-sm transition-all focus:w-64 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
              @keydown.enter="goSearch"
            />
            <Search class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          </div>

          <button
            class="rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100 md:hidden dark:text-gray-300 dark:hover:bg-gray-800"
            @click="goSearch"
          >
            <Search class="h-5 w-5" />
          </button>

          <div ref="langRoot" class="relative hidden sm:block">
            <button
              class="flex items-center gap-1.5 rounded-lg border border-gray-200 px-2.5 py-2 text-xs font-bold text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800"
              @click="langOpen = !langOpen"
            >
              {{ LANGUAGES.find((l) => l.code === app.language)?.code.toUpperCase() }}
              <ChevronDown :class="['h-3 w-3 transition-transform', langOpen ? 'rotate-180' : '']" />
            </button>
            <Transition name="dropdown">
              <div
                v-if="langOpen"
                class="absolute right-0 z-50 mt-2 w-44 origin-top-right rounded-xl border border-gray-100 bg-white p-1.5 shadow-card dark:border-gray-700 dark:bg-gray-800"
              >
                <button
                  v-for="l in LANGUAGES"
                  :key="l.code"
                  class="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-gray-50 dark:hover:bg-gray-700"
                  :class="app.language === l.code ? 'text-primary-600 dark:text-primary-400' : 'text-gray-700 dark:text-gray-200'"
                  @click="app.setLanguage(l.code); langOpen = false"
                >
                  <span>{{ l.native }}</span>
                  <span class="text-xs text-gray-400">{{ l.label }}</span>
                </button>
              </div>
            </Transition>
          </div>

          <router-link
            v-if="!auth.isAuthenticated"
            to="/login"
            class="hidden rounded-lg bg-primary-600 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-primary-700 sm:block"
          >
            {{ t('auth.login') }}
          </router-link>
          <router-link
            v-else
            to="/profile"
            class="hidden items-center gap-2 rounded-full border border-gray-200 py-1 pl-1 pr-3 transition-colors hover:bg-gray-50 sm:flex dark:border-gray-600 dark:hover:bg-gray-800"
          >
            <img v-if="auth.user" :src="auth.user.avatar" class="h-8 w-8 rounded-full" alt="avatar" />
            <span v-if="auth.user" class="text-sm font-semibold text-gray-700 dark:text-gray-200">
              {{ auth.user.name.split(' ')[0] }}
            </span>
          </router-link>
        </div>
      </div>

      <nav class="mx-auto hidden max-w-7xl items-center gap-1 px-4 lg:flex">
        <router-link
          v-for="item in navItems"
          :key="item.label"
          :to="item.to"
          class="border-b-2 px-3 py-2.5 text-sm font-semibold transition-colors"
          :class="
            $route.path === item.to
              ? 'border-primary-600 text-primary-700 dark:border-primary-400 dark:text-primary-400'
              : 'border-transparent text-gray-600 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400'
          "
        >
          {{ t(item.label) }}
        </router-link>
      </nav>
    </div>

    <Transition name="mobile">
      <div v-if="mobileOpen" class="border-t border-gray-100 bg-white px-4 pb-6 pt-3 shadow-card lg:hidden dark:border-gray-700 dark:bg-gray-900">
        <router-link
          v-for="item in navItems"
          :key="item.label"
          :to="item.to"
          class="block rounded-lg px-3 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-800"
          @click="mobileOpen = false"
        >
          {{ t(item.label) }}
        </router-link>
        <div class="mt-3 flex items-center gap-2 border-t border-gray-100 pt-3 dark:border-gray-700">
          <button
            v-for="l in LANGUAGES"
            :key="l.code"
            class="flex-1 rounded-lg border px-3 py-2 text-xs font-bold"
            :class="
              app.language === l.code
                ? 'border-primary-600 bg-primary-50 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300'
                : 'border-gray-200 text-gray-600 dark:border-gray-600 dark:text-gray-300'
            "
            @click="app.setLanguage(l.code)"
          >
            {{ l.native }}
          </button>
        </div>
      </div>
    </Transition>
  </header>
</template>

<style scoped>
.dropdown-enter-active,
.dropdown-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
.mobile-enter-active,
.mobile-leave-active {
  transition: opacity 0.2s ease;
}
.mobile-enter-from,
.mobile-leave-to {
  opacity: 0;
}
</style>