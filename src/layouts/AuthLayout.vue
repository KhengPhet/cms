<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { Globe, LayoutDashboard, Users, FileText } from '@lucide/vue'
import { useSettingsStore } from '@/stores/settings'

const route = useRoute()
const settings = useSettingsStore()

const page = computed(() => {
  const map: Record<string, { title: string; sub: string }> = {
    login: { title: 'Welcome back', sub: 'Sign in to your account to continue' },
    register: { title: 'Create an account', sub: 'Join the team and start creating' },
    'forgot-password': { title: 'Forgot your password?', sub: 'Enter your email to receive a reset link' },
    'reset-password': { title: 'Set a new password', sub: 'Choose a strong password for your account' }
  }
  return map[route.name as string] ?? { title: '', sub: '' }
})

const features = [
  { icon: FileText, label: 'Manage content easily' },
  { icon: Users, label: 'Team collaboration' },
  { icon: LayoutDashboard, label: 'Live analytics dashboard' }
]
</script>

<template>
  <div class="flex min-h-screen bg-slate-50 dark:bg-gray-950">
    <aside class="relative hidden w-1/2 overflow-hidden bg-primary-700 lg:block">
      <div class="absolute inset-0 bg-gradient-to-br from-primary-600 via-primary-700 to-blue-800" />
      <div
        v-for="(c, i) in ['#ffffff18', '#ffffff0d', '#4f46e5', '#3730a3']"
        :key="i"
        class="pointer-events-none absolute rounded-full blur-3xl"
        :style="{
          width: `${260 - i * 40}px`,
          height: `${260 - i * 40}px`,
          left: `${10 + i * 30}%`,
          top: `${-40 + i * 25}%`,
          background: c
        }"
      />
      <div class="relative z-10 flex h-full flex-col justify-between p-12 text-white">
        <div class="flex items-center gap-3">
          <div class="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 backdrop-blur">
            <Globe class="h-6 w-6" />
          </div>
          <div>
            <p class="text-lg font-extrabold leading-none tracking-tight">{{ settings.appName }}</p>
            <p class="text-xs text-primary-200">Content Management Platform</p>
          </div>
        </div>

        <div>
          <p class="text-xs font-bold uppercase tracking-widest text-primary-200">The hub for your newsroom</p>
          <h2 class="mt-3 text-4xl font-extrabold leading-tight">
            Manage national and international content easily
          </h2>
          <p class="mt-4 max-w-md text-primary-100/90">
            Combine editorial workflows, media and audience insights in one powerful, modern dashboard.
          </p>
          <div class="mt-8 space-y-3">
            <div
              v-for="f in features"
              :key="f.label"
              class="flex max-w-sm items-center gap-3 rounded-xl bg-white/10 px-4 py-3 backdrop-blur"
            >
              <f.icon class="h-5 w-5 text-primary-100" />
              <span class="text-sm font-medium">{{ f.label }}</span>
            </div>
          </div>
        </div>

        <div class="flex items-center gap-6 text-xs text-primary-200/80">
          <a href="#" class="transition-colors hover:text-white">Terms</a>
          <a href="#" class="transition-colors hover:text-white">Privacy</a>
          <a href="#" class="transition-colors hover:text-white">Support</a>
        </div>
      </div>
    </aside>

    <main class="flex max-h-screen flex-1 items-start justify-center overflow-y-auto px-4 py-10 sm:px-8 lg:items-center">
      <div class="w-full max-w-md">
        <div class="mb-8 flex items-center justify-center gap-2 lg:hidden">
          <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-600 text-white">
            <Globe class="h-5 w-5" />
          </div>
          <span class="text-lg font-extrabold text-gray-900 dark:text-white">{{ settings.appName }}</span>
        </div>

        <div class="animate-slide-up rounded-2xl border border-gray-100 bg-white p-8 shadow-lg dark:border-gray-800 dark:bg-gray-900">
          <h1 class="text-2xl font-extrabold text-gray-900 dark:text-white">{{ page.title }}</h1>
          <p class="mt-1.5 text-sm text-gray-500 dark:text-gray-400">{{ page.sub }}</p>
          <div class="mt-6">
            <router-view v-slot="{ Component }">
              <component :is="Component" />
            </router-view>
          </div>
        </div>

        <p class="mt-6 text-center text-xs text-gray-400 dark:text-gray-500">
          © {{ new Date().getFullYear() }} {{ settings.appName }}. All rights reserved.
        </p>
      </div>
    </main>
  </div>
</template>
