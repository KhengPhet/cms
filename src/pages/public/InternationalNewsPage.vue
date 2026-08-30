<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useArticlesStore } from '@/stores/articles'
import { useSettingsStore } from '@/stores/settings'
import { useI18n } from '@/composables/useI18n'
import ArticleCard from '@/components/public/ArticleCard.vue'
import SectionHeader from '@/components/public/SectionHeader.vue'
import BasePagination from '@/components/ui/BasePagination.vue'
import { TrendingUp, Globe2 } from '@lucide/vue'
import { getImageUrl, imageErrorHandler } from '@/utils/getImageUrl'

const store = useArticlesStore()
const settings = useSettingsStore()
const { t } = useI18n()

const country = ref('')
const page = ref(1)
const PER_PAGE = 9

const regionOptions = computed<string[]>(() => {
  const set = new Set<string>()
  store.international.forEach((a) => {
    if (a.country) set.add(a.country)
  })
  return [...set]
})

const trendingThisWeek = computed(() => {
  const seen: string[] = []
  for (const a of [...store.international].sort((x, y) => y.views - x.views)) {
    for (const tag of a.tags) {
      if (!seen.includes(tag)) seen.push(tag)
      if (seen.length >= 6) return seen
    }
  }
  return seen
})

const list = computed(() =>
  country.value
    ? store.international.filter((a) => a.country === country.value)
    : store.international
)

const paged = computed(() => {
  const start = (page.value - 1) * PER_PAGE
  return list.value.slice(start, start + PER_PAGE)
})

const totalPages = computed(() => list.value.length)

function selectCountry(code: string) {
  country.value = code === country.value ? '' : code
  page.value = 1
}

watch(country, () => (page.value = 1))
</script>

<template>
  <div>
    <div class="bg-gradient-to-r from-sky-700 via-primary-700 to-indigo-700 py-10 text-white">
      <div class="mx-auto max-w-7xl px-4">
        <p class="text-xs font-bold uppercase tracking-widest text-sky-200">{{ settings.appName }} / International</p>
        <h1 class="mt-1 text-3xl font-extrabold lg:text-4xl">{{ t('nav.international') }} News</h1>
        <p class="mt-2 max-w-2xl text-sm text-sky-100">Breaking world news and analysis from the USA, Europe, Asia and beyond.</p>
      </div>
    </div>

    <section class="page-container py-8">
      <div class="mb-6 flex items-center gap-2 overflow-x-auto pb-2">
        <button
          class="flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-bold transition-all"
          :class="
            country === ''
              ? 'border-primary-600 bg-primary-600 text-white shadow-lift'
              : 'border-gray-200 bg-white text-gray-600 hover:border-primary-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300'
          "
          @click="selectCountry('')"
        >
          <Globe2 class="h-4 w-4" /> All Regions
        </button>
        <button
          v-for="c in regionOptions"
          :key="c"
          class="flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-bold transition-all"
          :class="
            country === c
              ? 'border-primary-600 bg-primary-600 text-white shadow-lift'
              : 'border-gray-200 bg-white text-gray-600 hover:border-primary-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300'
          "
          @click="selectCountry(c)"
        >
          <Globe2 class="h-4 w-4" /> {{ c }}
        </button>
      </div>

      <div class="grid gap-6 lg:grid-cols-3">
        <div class="space-y-6 lg:col-span-2">
          <template v-if="paged.length">
            <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <ArticleCard v-for="a in paged" :key="a.id" :article="a" :show-excerpt="false" />
            </div>
            <div class="flex justify-center pt-2">
              <BasePagination v-model:current="page" :total="totalPages" :per-page="PER_PAGE" />
            </div>
          </template>
          <div v-else class="rounded-2xl border border-dashed border-gray-200 py-20 text-center dark:border-gray-700">
            <Globe2 class="mx-auto h-10 w-10 text-gray-300 dark:text-gray-600" />
            <p class="mt-3 font-semibold text-gray-500 dark:text-gray-400">{{ t('common.noResults') }}</p>
          </div>
        </div>

        <aside class="space-y-6">
          <div class="card-surface p-5">
            <div class="mb-4 flex items-center gap-2">
              <TrendingUp class="h-4 w-4 text-primary-600 dark:text-primary-400" />
              <h3 class="text-sm font-extrabold uppercase tracking-wide text-gray-900 dark:text-white">International trending</h3>
            </div>
            <ul class="space-y-3">
              <li v-for="(topic, i) in trendingThisWeek" :key="topic" class="flex items-center gap-3">
                <span class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-50 text-[11px] font-extrabold text-primary-600 dark:bg-primary-900/40 dark:text-primary-400">
                  {{ i + 1 }}
                </span>
                <a href="/search" class="text-sm font-semibold text-gray-700 transition-colors hover:text-primary-600 dark:text-gray-300">
                  {{ topic }}
                </a>
              </li>
            </ul>
          </div>

          <div class="card-surface p-5">
            <SectionHeader :title="t('common.related')" />
            <div class="space-y-3">
              <p v-if="!paged.length" class="text-sm text-gray-400">Select a region to see related reads.</p>
              <template v-for="a in paged.slice(0, 4)" v-else>
                <router-link :to="`/article/${a.id}`" class="group block rounded-xl p-2 transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <div class="flex items-center gap-3">
                    <img :src="getImageUrl(a.thumbnail)" :alt="a.title" class="h-12 w-16 shrink-0 rounded-lg object-cover" @error="imageErrorHandler" />
                    <div>
                      <p class="line-clamp-2 text-[13px] font-semibold leading-snug text-gray-800 group-hover:text-primary-600 dark:text-gray-200">
                        {{ a.title }}
                      </p>
                      <p class="mt-1 text-[11px] text-gray-400">{{ a.country?.slice(0, 10) }} · {{ a.readTime }} {{ t('common.minRead') }}</p>
                    </div>
                  </div>
                </router-link>
              </template>
            </div>
          </div>
        </aside>
      </div>
    </section>
  </div>
</template>