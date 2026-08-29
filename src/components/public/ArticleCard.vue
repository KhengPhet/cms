<script setup lang="ts">
import { computed } from 'vue'
import { Eye, Clock, MessageSquare, Bell, Play } from '@lucide/vue'
import type { Article } from '@/types'
import { formatDate, formatNumber } from '@/services/format'
import CategoryTag from './CategoryTag.vue'
import { useI18n } from '@/composables/useI18n'

const props = withDefaults(
  defineProps<{
    article: Article
    variant?: 'vertical' | 'horizontal' | 'overlay' | 'compact'
    showExcerpt?: boolean
  }>(),
  {
    variant: 'vertical',
    showExcerpt: true
  }
)

const { t, lang } = useI18n()

const href = computed(() => `/article/${props.article.id}`)
</script>

<template>
  <router-link
    :to="href"
    class="group block h-full overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-card dark:border-gray-700 dark:bg-gray-800"
  >
    <template v-if="variant === 'vertical'">
      <div class="relative aspect-[16/10] overflow-hidden">
        <img
          :src="article.thumbnail"
          :alt="article.title"
          class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span
          v-if="article.isBreaking"
          class="absolute left-3 top-3 inline-flex items-center gap-1 rounded bg-red-600 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white"
        >
          <Bell class="h-3 w-3" /> {{ t('common.breaking') }}
        </span>
        <span
          v-if="article.isVideo"
          class="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur"
        >
          <Play class="h-4 w-4 fill-current" />
        </span>
      </div>
      <div class="p-4">
        <div class="flex items-center gap-2">
          <CategoryTag :category-id="article.categoryId" />
          <span class="text-[11px] font-medium text-gray-400">{{ formatDate(article.publishedAt, lang) }}</span>
        </div>
        <h3
          class="mt-2 line-clamp-2 text-base font-bold leading-snug text-gray-900 transition-colors group-hover:text-primary-600 dark:text-white dark:group-hover:text-primary-400"
        >
          {{ article.title }}
        </h3>
        <p v-if="showExcerpt" class="mt-2 line-clamp-2 text-sm text-gray-500 dark:text-gray-400">
          {{ article.excerpt }}
        </p>
        <div class="mt-3 flex items-center justify-between border-t border-gray-100 pt-3 dark:border-gray-700">
          <div class="flex items-center gap-2">
            <img :src="article.author.avatar" :alt="article.author.name" class="h-6 w-6 rounded-full" />
            <span class="text-xs font-semibold text-gray-600 dark:text-gray-300">{{ article.author.name }}</span>
          </div>
          <div class="flex items-center gap-3 text-xs text-gray-400">
            <span class="flex items-center gap-1"><Eye class="h-3.5 w-3.5" /> {{ formatNumber(article.views) }}</span>
            <span class="flex items-center gap-1"><MessageSquare class="h-3.5 w-3.5" /> {{ formatNumber(article.commentsCount) }}</span>
          </div>
        </div>
      </div>
    </template>

    <template v-else-if="variant === 'horizontal'">
      <div class="flex flex-col sm:flex-row">
        <div class="relative h-40 w-full shrink-0 overflow-hidden sm:h-auto sm:w-56">
          <img :src="article.thumbnail" :alt="article.title" class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
          <span v-if="article.isBreaking" class="absolute left-3 top-3 rounded bg-red-600 px-2 py-0.5 text-[10px] font-bold uppercase text-white">
            {{ t('common.breaking') }}
          </span>
        </div>
        <div class="flex flex-1 flex-col p-4">
          <div class="flex items-center gap-2">
            <CategoryTag :category-id="article.categoryId" />
            <span class="text-[11px] text-gray-400">{{ formatDate(article.publishedAt, lang) }}</span>
          </div>
          <h3 class="mt-2 line-clamp-2 text-lg font-bold text-gray-900 transition-colors group-hover:text-primary-600 dark:text-white dark:group-hover:text-primary-400">
            {{ article.title }}
          </h3>
          <p v-if="showExcerpt" class="mt-2 line-clamp-2 text-sm text-gray-500 dark:text-gray-400">{{ article.excerpt }}</p>
          <div class="mt-auto flex items-center justify-between pt-3">
            <div class="flex items-center gap-2">
              <img :src="article.author.avatar" :alt="article.author.name" class="h-6 w-6 rounded-full" />
              <span class="text-xs font-semibold text-gray-600 dark:text-gray-300">{{ article.author.name }}</span>
            </div>
            <div class="flex items-center gap-3 text-xs text-gray-400">
              <span class="flex items-center gap-1"><Clock class="h-3.5 w-3.5" /> {{ article.readTime }} {{ t('common.minRead') }}</span>
              <span class="flex items-center gap-1"><Eye class="h-3.5 w-3.5" /> {{ formatNumber(article.views) }}</span>
            </div>
          </div>
        </div>
      </div>
    </template>

    <template v-else-if="variant === 'overlay'">
      <div class="relative aspect-[16/9] overflow-hidden">
        <img
          :src="article.thumbnail"
          :alt="article.title"
          class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />
        <span v-if="article.isBreaking" class="absolute left-3 top-3 inline-flex items-center gap-1 rounded bg-red-600 px-2 py-0.5 text-[10px] font-bold uppercase text-white">
          <Bell class="h-3 w-3" /> {{ t('common.breaking') }}
        </span>
        <div class="absolute inset-x-0 bottom-0 p-4">
          <div class="mb-2"><CategoryTag :category-id="article.categoryId" /></div>
          <h3 class="line-clamp-2 text-xl font-bold leading-tight text-white lg:text-2xl">
            {{ article.title }}
          </h3>
          <div class="mt-2.5 flex items-center gap-3 text-xs text-white/80">
            <div class="flex items-center gap-1.5">
              <img :src="article.author.avatar" :alt="article.author.name" class="h-5 w-5 rounded-full ring-1 ring-white/40" />
              <span>{{ article.author.name }}</span>
            </div>
            <span>{{ formatDate(article.publishedAt, lang) }}</span>
            <span class="flex items-center gap-1"><Eye class="h-3.5 w-3.5" /> {{ formatNumber(article.views) }}</span>
          </div>
        </div>
      </div>
    </template>

    <template v-else>
      <div class="flex items-start gap-3 p-3">
        <img :src="article.thumbnail" :alt="article.title" class="h-16 w-24 shrink-0 rounded-lg object-cover" />
        <div class="min-w-0">
          <h4 class="line-clamp-2 text-[13px] font-semibold leading-snug text-gray-900 transition-colors group-hover:text-primary-600 dark:text-white dark:group-hover:text-primary-400">
            {{ article.title }}
          </h4>
          <div class="mt-1.5 flex items-center gap-2 text-[11px] text-gray-400">
            <span>{{ formatDate(article.publishedAt, lang) }}</span>
            <span class="flex items-center gap-0.5"><Eye class="h-3 w-3" /> {{ formatNumber(article.views) }}</span>
          </div>
        </div>
      </div>
    </template>
  </router-link>
</template>