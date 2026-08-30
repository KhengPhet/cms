<script setup lang="ts">
import { Home } from '@lucide/vue'
import { useI18n } from '@/composables/useI18n'

withDefaults(
  defineProps<{
    title: string
    eyebrow?: string
    description?: string
    tone?: 'primary' | 'sky' | 'neutral'
  }>(),
  { eyebrow: '', description: '', tone: 'primary' }
)

const { t } = useI18n()

const gradients: Record<string, string> = {
  primary: 'from-primary-700 via-primary-600 to-indigo-700',
  sky: 'from-sky-700 via-indigo-700 to-primary-800',
  neutral: 'from-gray-900 via-gray-800 to-gray-700'
}
</script>

<template>
  <section
    class="relative overflow-hidden py-14 text-white lg:py-16"
    :class="`bg-gradient-to-br ${gradients[tone]}`"
  >
    <div class="pointer-events-none absolute -right-24 -top-28 h-72 w-72 rounded-full bg-white/10 blur-2xl" />
    <div class="pointer-events-none absolute -bottom-28 -left-20 h-80 w-80 rounded-full bg-white/5 blur-2xl" />

    <div class="relative mx-auto w-[90%] px-4">
      <nav v-if="eyebrow" class="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-white/70">
        <Home class="h-3.5 w-3.5" />
        <router-link to="/" class="transition-colors hover:text-white">{{ t('nav.home') }}</router-link>
        <span class="text-white/40">/</span>
        <span class="text-white">{{ eyebrow }}</span>
      </nav>

      <div class="mt-4 flex items-center gap-3">
        <span class="h-8 w-1.5 shrink-0 rounded-full bg-white/40" />
        <h1 class="text-3xl font-extrabold tracking-tight sm:text-4xl">{{ title }}</h1>
      </div>

      <p v-if="description" class="mt-3 max-w-2xl text-sm leading-relaxed text-white/80 sm:text-base">
        {{ description }}
      </p>
    </div>
  </section>
</template>