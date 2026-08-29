<script setup lang="ts">
import { computed } from 'vue'
import { useArticlesStore } from '@/stores/articles'
import { useI18n } from '@/composables/useI18n'
import HeroSlider from '@/components/public/HeroSlider.vue'
import ArticleCard from '@/components/public/ArticleCard.vue'
import SectionHeader from '@/components/public/SectionHeader.vue'
import NewsletterSection from '@/components/public/NewsletterSection.vue'
import { Flame, TrendingUp, Newspaper } from '@lucide/vue'

const store = useArticlesStore()
const { t } = useI18n()

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
const national = computed(() => store.national.slice(0, 5))
const nationalFeatured = computed(() => national.value[0])
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
    <section class="mx-auto max-w-7xl px-4 pt-6">
      <div class="grid gap-6 lg:grid-cols-3">
        <div class="lg:col-span-2">
          <HeroSlider :articles="featured" />
        </div>
        <div class="rounded-2xl border border-gray-100 bg-white p-4 shadow-soft dark:border-gray-700 dark:bg-gray-800">
          <div class="mb-3 flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="flex h-8 w-8 items-center justify-center rounded-lg bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400">
                <Flame class="h-4 w-4" />
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

    <section class="mx-auto max-w-7xl px-4 py-10">
      <SectionHeader :title="t('common.latestNews')" link-to="/search" :link-label="t('common.viewAll')" />
      <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <ArticleCard v-for="a in latestGrid" :key="a.id" :article="a" />
      </div>
    </section>

    <section class="border-y border-gray-100 bg-gray-50 py-10 dark:border-gray-700 dark:bg-gray-900/50">
      <div class="mx-auto max-w-7xl px-4">
        <SectionHeader :title="t('common.national')" link-to="/national" :link-label="t('common.viewAll')" accent />
        <div class="grid gap-6 lg:grid-cols-3">
          <div class="lg:col-span-2">
            <div class="grid gap-5 md:grid-cols-2">
              <ArticleCard v-if="nationalFeatured" :article="nationalFeatured" />
              <div class="space-y-3">
                <ArticleCard v-for="a in national.slice(1)" :key="a.id" :article="a" variant="horizontal" :show-excerpt="false" />
              </div>
            </div>
          </div>
          <aside class="space-y-6">
            <div class="rounded-2xl border border-gray-100 bg-white p-5 shadow-soft dark:border-gray-700 dark:bg-gray-800">
              <div class="mb-4 flex items-center gap-2">
                <TrendingUp class="h-4 w-4 text-primary-600 dark:text-primary-400" />
                <h3 class="text-sm font-extrabold uppercase tracking-wide text-gray-900 dark:text-white">{{ t('common.trending') }}</h3>
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
            <div class="rounded-2xl border border-gray-100 bg-white p-5 shadow-soft dark:border-gray-700 dark:bg-gray-800">
              <h3 class="mb-4 text-sm font-extrabold uppercase tracking-wide text-gray-900 dark:text-white">{{ t('common.mostRead') }}</h3>
              <div class="space-y-3">
                <ArticleCard v-for="a in popular.slice(0, 4)" :key="a.id" :article="a" variant="compact" />
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>

    <section class="mx-auto max-w-7xl px-4 py-10">
      <SectionHeader :title="t('common.international')" link-to="/international" :link-label="t('common.viewAll')" />
      <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <ArticleCard v-for="a in international" :key="a.id" :article="a" />
      </div>
    </section>

    <section v-if="videoNews.length" class="border-y border-gray-100 bg-gray-50 py-10 dark:border-gray-700 dark:bg-gray-900/50">
      <div class="mx-auto max-w-7xl px-4">
        <SectionHeader :title="t('home.videoNews')" :link-label="t('common.viewAll')" />
        <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <ArticleCard v-for="a in videoNews" :key="a.id" :article="a" />
        </div>
      </div>
    </section>

    <section class="mx-auto max-w-7xl px-4 py-10">
      <div class="grid gap-6 lg:grid-cols-3">
        <div class="lg:col-span-2">
          <SectionHeader :title="t('common.recommended')" />
          <div class="grid gap-5 sm:grid-cols-2">
            <ArticleCard v-for="a in recommended" :key="a.id" :article="a" />
          </div>
        </div>
        <div class="rounded-2xl border border-gray-100 bg-white p-5 shadow-soft dark:border-gray-700 dark:bg-gray-800">
          <div class="mb-4 flex items-center gap-2">
            <Newspaper class="h-4 w-4 text-primary-600 dark:text-primary-400" />
            <h3 class="text-sm font-extrabold uppercase tracking-wide text-gray-900 dark:text-white">{{ t('common.editorsPick') }}</h3>
          </div>
          <div class="space-y-3">
            <ArticleCard v-for="a in popular.slice(2, 5)" :key="a.id" :article="a" variant="compact" />
          </div>
        </div>
      </div>
    </section>

    <section class="mx-auto max-w-7xl px-4 pb-14">
      <NewsletterSection />
    </section>
  </div>
</template>