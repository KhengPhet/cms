<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useArticlesStore } from '@/stores/articles'
import { useI18n } from '@/composables/useI18n'
import { AlertTriangle, Loader2 } from '@lucide/vue'
import HeroSlider from '@/components/public/HeroSlider.vue'
import ArticleCard from '@/components/public/ArticleCard.vue'
import SectionHeader from '@/components/public/SectionHeader.vue'
import NewsletterSection from '@/components/public/NewsletterSection.vue'
import { Flame, TrendingUp, Newspaper } from '@lucide/vue'

const store = useArticlesStore()
const { t } = useI18n()

onMounted(() => {
  store.fetchAll()
})

const trendingTopics = computed(() => {
  const seen: string[] = []
  for (const a of [...store.published].sort((x, y) => y.views - x.views)) {
    for (const tag of a.tags) {
      if (!seen.includes(tag)) seen.push(tag)
      if (seen.length >= 10) return seen
    }
  }
  return seen
})

const featured = computed(() => store.featured.slice(0, 4))
const latest = computed(() => [...store.published].sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()))
const latestSix = computed(() => latest.value.slice(0, 6))
const latestGrid = computed(() => latest.value.slice(6, 12))
const national = computed(() => store.national.slice(0, 4))
const international = computed(() => store.international.slice(0, 6))
const videoNews = computed(() => store.video.slice(0, 6))
const popular = computed(() => [...store.published].sort((a, b) => b.views - a.views).slice(0, 6))
const recommended = computed(() => {
  const sorted = [...store.published].sort((a, b) => b.likes - a.likes)
  return [...sorted.slice(0, 2), ...national.value.slice(1, 3)]
})
</script>

<template>
  <div>
    <div v-if="store.loading" class="page-container pt-8">
      <div class="card-surface flex items-center gap-3 p-5 text-gray-500 dark:text-gray-400">
        <Loader2 class="h-5 w-5 animate-spin text-primary-600" />
        <span>{{ t('common.loading') }}</span>
      </div>
    </div>

    <div v-else-if="store.error" class="page-container pt-8">
      <div class="card-surface flex items-center gap-3 border-red-200 bg-red-50 p-5 text-red-700 dark:border-red-900 dark:bg-red-900/30 dark:text-red-300">
        <AlertTriangle class="h-5 w-5 shrink-0" />
        <div>
          <p class="font-bold">Failed to load articles</p>
          <p class="text-sm">{{ store.error }}</p>
        </div>
      </div>
    </div>

    <div v-else-if="!store.published.length" class="page-container pt-8">
      <div class="card-surface p-5 text-center text-gray-500 dark:text-gray-400">
        {{ t('common.noArticles') }}
      </div>
    </div>

    <section class="pt-6 page-container">
      <div class="grid gap-6 lg:grid-cols-3">
        <div class="lg:col-span-2">
          <HeroSlider :articles="featured" />
        </div>
        <div class="p-4 card-surface sm:p-5">
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center gap-2">
              <span class="flex items-center justify-center w-8 h-8 text-red-600 bg-red-100 rounded-lg dark:bg-red-900/40 dark:text-red-400">
                <Flame class="w-4 h-4" />
              </span>
              <h2 class="text-base font-extrabold text-gray-900 dark:text-white">{{ t('common.latestNews') }}</h2>
            </div>
            <router-link to="/search" class="text-xs font-bold text-primary-600 hover:underline dark:text-primary-400">
              {{ t('common.viewAll') }}
            </router-link>
          </div>
          <div class="space-y-2">
            <ArticleCard v-for="a in latestSix" :key="a.id" :article="a" variant="compact" />
          </div>
        </div>
      </div>
    </section>

    <section class="py-10 page-container">
      <SectionHeader :title="t('common.latestNews')" link-to="/search" :link-label="t('common.viewAll')" />
      <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <ArticleCard v-for="a in latestGrid" :key="a.id" :article="a" />
      </div>
    </section>

    <section class="py-10 page-container">
      <div class="grid gap-6 lg:grid-cols-3">
        <div class="lg:col-span-2">
          <SectionHeader :title="t('common.national')" link-to="/national" :link-label="t('common.viewAll')" accent />
          <div class="grid gap-5 sm:grid-cols-2">
            <ArticleCard v-for="a in national" :key="a.id" :article="a" />
          </div>
        </div>
        <div class="p-5 card-surface h-fit">
          <div class="flex items-center gap-2 mb-4">
            <TrendingUp class="w-4 h-4 text-primary-600 dark:text-primary-400" />
            <h3 class="text-sm font-extrabold tracking-wide text-gray-900 uppercase dark:text-white">{{ t('common.trending') }}</h3>
          </div>
          <ul class="space-y-3">
            <li v-for="(topic, i) in trendingTopics" :key="topic" class="flex items-center gap-3">
              <span class="text-lg font-extrabold text-gray-300 dark:text-gray-600">{{ String(i + 1).padStart(2, '0') }}</span>
              <a href="/search" class="text-sm font-semibold text-gray-700 transition-colors hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400">
                {{ topic }}
              </a>
            </li>
          </ul>
        </div>
      </div>
    </section>

    <section class="py-10 page-container">
      <SectionHeader :title="t('common.international')" link-to="/international" :link-label="t('common.viewAll')" />
      <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <ArticleCard v-for="a in international" :key="a.id" :article="a" />
      </div>
    </section>

    <section v-if="videoNews.length" class="py-10 border-gray-100 border-y bg-gray-50 dark:border-gray-700 dark:bg-gray-900/50">
      <div class="page-container">
        <SectionHeader :title="t('home.videoNews')" :link-label="t('common.viewAll')" />
        <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <ArticleCard v-for="a in videoNews" :key="a.id" :article="a" />
        </div>
      </div>
    </section>

    <section class="py-10 page-container">
      <div class="grid gap-6 lg:grid-cols-3">
        <div class="lg:col-span-2">
          <SectionHeader :title="t('common.recommended')" />
          <div class="grid gap-5 sm:grid-cols-2">
            <ArticleCard v-for="a in recommended" :key="a.id" :article="a" />
          </div>
        </div>
        <div class="p-5 card-surface h-fit">
          <div class="flex items-center gap-2 mb-4">
            <Newspaper class="w-4 h-4 text-primary-600 dark:text-primary-400" />
            <h3 class="text-sm font-extrabold tracking-wide text-gray-900 uppercase dark:text-white">{{ t('common.editorsPick') }}</h3>
          </div>
          <div class="space-y-3">
            <ArticleCard v-for="a in popular.slice(2, 5)" :key="a.id" :article="a" variant="compact" />
          </div>
        </div>
      </div>
    </section>

    <section class="page-container pb-14">
      <NewsletterSection />
    </section>
  </div>
</template>