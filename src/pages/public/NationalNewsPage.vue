<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useArticlesStore } from '@/stores/articles'
import { useSettingsStore } from '@/stores/settings'
import { useI18n } from '@/composables/useI18n'
import ArticleCard from '@/components/public/ArticleCard.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseSelect from '@/components/ui/BaseSelect.vue'
import BasePagination from '@/components/ui/BasePagination.vue'
import { Search, MapPin, TrendingUp, ChevronDown } from '@lucide/vue'
import { useRoute } from 'vue-router'

const store = useArticlesStore()
const settings = useSettingsStore()
const { t } = useI18n()
const route = useRoute()

const query = ref('')
const prov = ref('')
const catId = ref('')
const page = ref(1)
const PER_PAGE = 8

const provinces = computed(() => {
  const set = new Set<string>()
  store.national.forEach((a) => {
    if (a.province) set.add(a.province)
  })
  return [...set]
})

const trendingTopics = computed(() => {
  const seen: string[] = []
  for (const a of [...store.national].sort((x, y) => y.views - x.views)) {
    for (const tag of a.tags) {
      if (!seen.includes(tag)) seen.push(tag)
      if (seen.length >= 8) return seen
    }
  }
  return seen
})

const filterCategories = computed(() =>
  store.categories.filter((c) => c.id !== 'c1' && c.id !== 'c2' && c.slug !== 'international')
)

const allNational = computed(() => store.national)
const featured = computed(() => allNational.value[0])

const filtered = computed(() => {
  const q = query.value.trim().toLowerCase()
  return allNational.value.filter((a) => {
    if (q && !(a.title + a.excerpt + a.tags.join(' ')).toLowerCase().includes(q)) return false
    if (catId.value && a.categoryId !== catId.value) return false
    if (prov.value && (a.province ?? 'General') !== prov.value) return false
    return true
  })
})

const totalPages = computed(() => filtered.value.length)
const paged = computed(() => {
  const start = (page.value - 1) * PER_PAGE
  return filtered.value.slice(start, start + PER_PAGE)
})

function applyFilters() {
  page.value = 1
}

watch([prov, catId], () => applyFilters())
watch(route.query, () => {
  if (route.query.q) query.value = String(route.query.q)
})

const provinceOptions = computed(() => [
  { label: 'All provinces', value: '' },
  ...provinces.value.map((p) => ({ label: p, value: p }))
])

const catOptions = computed(() => [
  { label: 'All categories', value: '' },
  ...filterCategories.value.map((c) => ({ label: c.name, value: c.id }))
])
</script>

<template>
  <div>
    <div class="bg-gradient-to-r from-primary-700 to-indigo-700 py-10 text-white">
      <div class="mx-auto max-w-7xl px-4">
        <p class="text-xs font-bold uppercase tracking-widest text-indigo-200">{{ settings.appName }} / National</p>
        <h1 class="mt-1 text-3xl font-extrabold lg:text-4xl">{{ t('nav.national') }} News</h1>
        <p class="mt-2 max-w-2xl text-sm text-indigo-100">Authoritative coverage from every province — politics, economy, sports and culture.</p>
      </div>
    </div>

    <section class="page-container py-8">
      <div class="grid gap-6 lg:grid-cols-3">
        <div class="space-y-6 lg:col-span-2">
          <ArticleCard v-if="featured" :article="featured" variant="overlay" :show-excerpt="false" />

          <div class="card-surface p-4">
            <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <div class="sm:col-span-2">
                <BaseInput
                  v-model="query"
                  icon="search"
                  :placeholder="t('common.searchPlaceholder')"
                  :hint="t('common.result') + ': ' + filtered.length"
                />
              </div>
              <BaseSelect v-model="prov" :options="provinceOptions" :placeholder="t('common.provinceFilter')" />
              <BaseSelect v-model="catId" :options="catOptions" :placeholder="t('common.allCategories')" />
            </div>
          </div>

          <template v-if="paged.length">
            <div class="grid gap-5 sm:grid-cols-2">
              <ArticleCard v-for="a in paged" :key="a.id" :article="a" />
            </div>
            <div class="flex justify-center pt-2">
              <BasePagination v-model:current="page" :total="totalPages" :per-page="PER_PAGE" />
            </div>
          </template>
          <div v-else class="rounded-2xl border border-dashed border-gray-200 py-20 text-center dark:border-gray-700">
            <Search class="mx-auto h-10 w-10 text-gray-300 dark:text-gray-600" />
            <p class="mt-3 font-semibold text-gray-500 dark:text-gray-400">{{ t('common.noResults') }}</p>
          </div>
        </div>

        <aside class="space-y-6">
          <div class="card-surface p-5">
            <div class="mb-4 flex items-center gap-2">
              <MapPin class="h-4 w-4 text-primary-600 dark:text-primary-400" />
              <h3 class="text-sm font-extrabold uppercase tracking-wide text-gray-900 dark:text-white">Provinces</h3>
            </div>
            <ul class="space-y-2">
              <li v-for="p in provinces" :key="p">
                <a href="#" class="flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-primary-50 hover:text-primary-700 dark:text-gray-300 dark:hover:bg-primary-900/30">
                  <span>{{ p }}</span>
                  <ChevronDown class="h-3.5 w-3.5 -rotate-90 text-gray-300" />
                </a>
              </li>
            </ul>
          </div>

          <div class="card-surface p-5">
            <div class="mb-4 flex items-center gap-2">
              <TrendingUp class="h-4 w-4 text-primary-600 dark:text-primary-400" />
              <h3 class="text-sm font-extrabold uppercase tracking-wide text-gray-900 dark:text-white">{{ t('common.trending') }}</h3>
            </div>
            <div class="flex flex-wrap gap-2">
              <a v-for="topic in trendingTopics.slice(0, 8)" :key="topic" href="/search" class="rounded-full border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-600 transition-colors hover:border-primary-400 hover:bg-primary-50 hover:text-primary-700 dark:border-gray-600 dark:text-gray-300 dark:hover:border-primary-500 dark:hover:bg-primary-900/30">
                {{ topic }}
              </a>
            </div>
          </div>
        </aside>
      </div>
    </section>
  </div>
</template>