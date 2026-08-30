<script setup lang="ts">
import { useI18n } from '@/composables/useI18n'
import { useArticlesStore } from '@/stores/articles'
import { useSettingsStore } from '@/stores/settings'
import SocialIcon from './SocialIcon.vue'

const { t } = useI18n()
const store = useArticlesStore()
const settings = useSettingsStore()

const quickLinks = [
  { label: 'nav.home', to: '/' },
  { label: 'nav.national', to: '/national' },
  { label: 'nav.international', to: '/international' },
  { label: 'nav.contact', to: '/contact' },
  { label: 'auth.login', to: '/login' }
]

const socials = [
  { name: 'facebook' as const, color: 'hover:bg-blue-600' },
  { name: 'twitter' as const, color: 'hover:bg-sky-500' },
  { name: 'telegram' as const, color: 'hover:bg-sky-500' },
  { name: 'youtube' as const, color: 'hover:bg-red-600' }
]
</script>

<template>
  <footer class="border-t border-gray-100 bg-gray-50 dark:border-gray-700 dark:bg-gray-900">
    <div class="px-4 py-12 mx-auto w-[90%]">
      <div class="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <div class="flex items-center gap-2.5">
            <img src="/p-cms.png" alt="logo" class="h-10 w-10 shrink-0 object-contain" />
            <div class="leading-tight">
              <span class="block text-lg font-extrabold tracking-tight text-gray-900 dark:text-white">{{ settings.appName }}</span>
            </div>
          </div>
          <p class="mt-4 text-sm leading-relaxed text-gray-500 dark:text-gray-400">
            {{ t('common.footerDesc') }}
          </p>
          <div class="flex gap-2 mt-5">
            <a v-for="s in socials" :key="s.name" href="#" class="flex items-center justify-center text-gray-600 transition-all bg-gray-200 rounded-full h-9 w-9 hover:text-white dark:bg-gray-800 dark:text-gray-300" :class="s.color">
              <SocialIcon :name="s.name" :size="15" />
            </a>
          </div>
        </div>
        <div>
          <h4 class="text-sm font-bold tracking-wider text-gray-900 uppercase dark:text-white">{{ t('common.quickLinks') }}</h4>
          <ul class="mt-4 space-y-2.5">
            <li v-for="l in quickLinks" :key="l.label">
              <router-link :to="l.to" class="text-sm text-gray-500 transition-colors hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400">
                {{ t(l.label) }}
              </router-link>
            </li>
          </ul>
        </div>
        <div>
          <h4 class="text-sm font-bold tracking-wider text-gray-900 uppercase dark:text-white">{{ t('common.categories') }}</h4>
          <ul class="mt-4 space-y-2.5">
            <li v-for="c in store.categories.slice(0, 7)" :key="c.id">
              <router-link :to="`/category/${c.slug}`" class="text-sm text-gray-500 transition-colors hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400">
                {{ c.name }}
              </router-link>
            </li>
          </ul>
        </div>
        <div>
          <h4 class="text-sm font-bold tracking-wider text-gray-900 uppercase dark:text-white">{{ t('common.newsletterTitle') }}</h4>
          <p class="mt-4 text-sm text-gray-500 dark:text-gray-400">{{ t('common.newsletterDesc') }}</p>
          <form class="flex gap-2 mt-4" @submit.prevent>
            <input type="email" placeholder="you@example.com" class="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white"/>
            <button class="px-4 py-2 text-sm font-bold text-white transition-colors rounded-lg shrink-0 bg-primary-600 hover:bg-primary-700">
              OK
            </button>
          </form>
        </div>
      </div>

      <div class="flex flex-col items-center justify-between gap-3 pt-6 mt-10 text-sm text-gray-400 border-t border-gray-200 dark:border-gray-700 sm:flex-row">
        <span>© {{ new Date().getFullYear() }} {{ settings.appName }}. {{ t('common.rights') }}</span>
        <div class="flex gap-6">
          <a href="#" class="transition-colors hover:text-primary-600">Privacy</a>
          <a href="#" class="transition-colors hover:text-primary-600">Terms</a>
          <a href="#" class="transition-colors hover:text-primary-600">Cookies</a>
        </div>
      </div>
    </div>
  </footer>
</template>