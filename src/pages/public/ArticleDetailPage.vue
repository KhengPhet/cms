<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  Clock,
  Eye,
  Calendar,
  MessageSquare,
  Bookmark,
  ThumbsUp,
  ArrowLeft,
  Share2,
  Check
} from '@lucide/vue'
import { useArticlesStore } from '@/stores/articles'
import { useI18n } from '@/composables/useI18n'
import { useToast } from '@/composables/useToast'
import { formatDate, formatNumber } from '@/services/format'
import ArticleCard from '@/components/public/ArticleCard.vue'
import SectionHeader from '@/components/public/SectionHeader.vue'
import CommentSection from '@/components/public/CommentSection.vue'
import SocialIcon from '@/components/public/SocialIcon.vue'

const route = useRoute()
const router = useRouter()
const store = useArticlesStore()
const { t, lang } = useI18n()
const toast = useToast()

const article = computed(() => store.byId(String(route.params.id)))
const saved = ref(false)
const copied = ref(false)

const related = computed(() => {
  if (!article.value) return []
  return store.published
    .filter((a) => a.categoryId === article.value!.categoryId && a.id !== article.value!.id)
    .slice(0, 3)
})

onMounted(() => {
  if (article.value) store.incrementViews(article.value.id)
  window.scrollTo(0, 0)
})

function saveArticle() {
  saved.value = !saved.value
  toast.success(saved.value ? 'Article saved to your list' : 'Removed from saved list')
}

function likeArticle() {
  if (article.value) article.value.likes += 1
}

async function copyLink() {
  try {
    await navigator.clipboard.writeText(window.location.href)
    copied.value = true
    setTimeout(() => (copied.value = false), 2000)
    toast.success('Link copied to clipboard')
  } catch {
    toast.error('Could not copy link')
  }
}
</script>

<template>
  <div class="mx-auto max-w-7xl px-4 py-8">
    <button
      class="mb-6 flex items-center gap-2 text-sm font-semibold text-gray-500 transition-colors hover:text-primary-600 dark:text-gray-400"
      @click="router.push(article ? `/category/${article.scope}` : '/')"
    >
      <ArrowLeft class="h-4 w-4" /> {{ t('common.backToHome') }}
    </button>

    <article v-if="article" class="mx-auto max-w-4xl">
      <div class="mb-4 flex flex-wrap items-center gap-2">
        <router-link
          :to="`/category/${article.categoryId}`"
          class="rounded-full bg-primary-50 px-3 py-1 text-xs font-bold uppercase tracking-wide text-primary-700 dark:bg-primary-900/40 dark:text-primary-300"
        >
          {{ article.category }}
        </router-link>
        <span v-if="article.isBreaking" class="rounded-full bg-red-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-red-700 dark:bg-red-900/40 dark:text-red-300">
          BREAKING
        </span>
        <span v-if="article.province" class="rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-gray-600 dark:bg-gray-700 dark:text-gray-300">
          {{ article.province }}
        </span>
        <span v-if="article.country" class="rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-gray-600 dark:bg-gray-700 dark:text-gray-300">
          {{ article.country.toUpperCase() }}
        </span>
      </div>

      <h1 class="text-3xl font-extrabold leading-tight tracking-tight text-gray-900 dark:text-white lg:text-5xl lg:leading-tight">
        {{ article.title }}
      </h1>
      <p class="mt-4 text-lg leading-relaxed text-gray-500 dark:text-gray-400">{{ article.excerpt }}</p>

      <div class="mt-6 flex flex-wrap items-center justify-between gap-4 border-y border-gray-100 py-4 dark:border-gray-700">
        <div class="flex items-center gap-3">
          <img :src="article.author.avatar" :alt="article.author.name" class="h-12 w-12 rounded-full ring-2 ring-primary-500/40" />
          <div>
            <p class="text-sm font-bold text-gray-900 dark:text-white">{{ article.author.name }}</p>
            <p class="text-xs text-gray-400">{{ article.author.role }} · {{ article.author.bio }}</p>
          </div>
        </div>
        <div class="flex flex-wrap items-center gap-4 text-xs font-medium text-gray-500 dark:text-gray-400">
          <span class="flex items-center gap-1.5"><Calendar class="h-4 w-4 text-gray-300 dark:text-gray-500" /> {{ formatDate(article.publishedAt, lang) }}</span>
          <span class="flex items-center gap-1.5"><Clock class="h-4 w-4 text-gray-300 dark:text-gray-500" /> {{ article.readTime }} {{ t('common.minRead') }}</span>
          <span class="flex items-center gap-1.5"><Eye class="h-4 w-4 text-gray-300 dark:text-gray-500" /> {{ formatNumber(article.views) }} {{ t('common.views') }}</span>
          <span class="flex items-center gap-1.5"><MessageSquare class="h-4 w-4 text-gray-300 dark:text-gray-500" /> {{ formatNumber(article.commentsCount) }}</span>
        </div>
      </div>

      <div class="mt-6 flex flex-wrap items-center gap-2">
        <span class="mr-1 flex items-center gap-1.5 text-sm font-bold text-gray-700 dark:text-gray-300">
          <Share2 class="h-4 w-4" /> {{ t('common.share') }}:
        </span>
        <button class="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-white transition-transform hover:scale-110" title="Facebook">
          <SocialIcon name="facebook" :size="15" />
        </button>
        <button class="flex h-9 w-9 items-center justify-center rounded-full bg-sky-500 text-white transition-transform hover:scale-110" title="X (Twitter)">
          <SocialIcon name="twitter" :size="15" />
        </button>
        <button class="flex h-9 w-9 items-center justify-center rounded-full bg-sky-600 text-white transition-transform hover:scale-110" title="Telegram">
          <SocialIcon name="telegram" :size="15" />
        </button>
        <button class="flex h-9 w-9 items-center justify-center rounded-full bg-red-600 text-white transition-transform hover:scale-110" title="YouTube">
          <SocialIcon name="youtube" :size="15" />
        </button>
        <button
          class="ml-2 flex h-9 items-center gap-1.5 rounded-full border border-gray-200 px-3 text-xs font-bold text-gray-600 transition-colors hover:border-gray-300 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
          @click="copyLink"
        >
          <Check v-if="copied" class="h-3.5 w-3.5 text-emerald-500" />
          <Share2 v-else class="h-3.5 w-3.5" />
          {{ copied ? 'Copied!' : 'Copy link' }}
        </button>
        <button
          class="ml-auto flex h-9 items-center gap-1.5 rounded-full px-3 text-xs font-bold transition-colors"
          :class="saved ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300' : 'border border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700'"
          @click="saveArticle"
        >
          <Bookmark :class="['h-4 w-4', saved ? 'fill-current' : '']" /> {{ saved ? 'Saved' : 'Save' }}
        </button>
        <button
          class="flex h-9 items-center gap-1.5 rounded-full border border-gray-200 px-3 text-xs font-bold text-gray-600 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
          @click="likeArticle"
        >
          <ThumbsUp class="h-4 w-4" /> {{ formatNumber(article.likes) }}
        </button>
      </div>

      <figure class="mt-6 overflow-hidden rounded-2xl">
        <img :src="article.thumbnail" :alt="article.title" class="w-full object-cover" />
      </figure>

      <div class="prose-article mt-8" v-html="article.content" />

      <div class="mt-8 flex flex-wrap gap-2">
        <router-link
          v-for="tag in article.tags"
          :key="tag"
          :to="{ path: '/search', query: { q: tag } }"
          class="rounded-full bg-gray-100 px-3 py-1.5 text-xs font-bold text-gray-600 transition-colors hover:bg-primary-50 hover:text-primary-700 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-primary-900/40"
        >
          #{{ tag }}
        </router-link>
      </div>
    </article>

    <template v-if="article">
      <section class="mx-auto mt-12 max-w-4xl">
        <CommentSection :article-id="article.id" :article-title="article.title" />
      </section>

      <section v-if="related.length" class="mt-12">
        <SectionHeader :title="t('common.related')" />
        <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <ArticleCard v-for="a in related" :key="a.id" :article="a" />
        </div>
      </section>
    </template>

    <div v-else class="rounded-2xl border border-dashed border-gray-200 py-24 text-center dark:border-gray-700">
      <p class="text-lg font-bold text-gray-500 dark:text-gray-400">Article not found</p>
    </div>
  </div>
</template>

<style scoped>
.prose-article :deep(p) {
  margin: 1rem 0;
  color: #374151;
  line-height: 1.8;
}
.dark .prose-article :deep(p) {
  color: #d1d5db;
}
.prose-article :deep(h2) {
  font-size: 1.6rem;
  font-weight: 700;
  margin: 2rem 0 0.5rem;
  color: #111827;
}
.dark .prose-article :deep(h2) {
  color: #f9fafb;
}
.prose-article :deep(ul) {
  list-style: disc;
  padding-left: 1.5rem;
  margin: 1rem 0;
  color: #374151;
}
.dark .prose-article :deep(ul) {
  color: #d1d5db;
}
.prose-article :deep(blockquote) {
  border-left: 4px solid #4f46e5;
  background: #eef2ff;
  padding: 1rem 1.25rem;
  margin: 1.25rem 0;
  border-radius: 0 0.75rem 0.75rem 0;
  font-style: italic;
  font-weight: 500;
  color: #4338ca;
}
.dark .prose-article :deep(blockquote) {
  background: #312e81;
  color: #c7d2fe;
}
</style>