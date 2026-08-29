<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Search, X, SlidersHorizontal } from '@lucide/vue'
import { useArticlesStore } from '@/stores/articles'
import { useI18n } from '@/composables/useI18n'
import ArticleCard from '@/components/public/ArticleCard.vue'
import BasePagination from '@/components/ui/BasePagination.vue'
import BaseSelect from '@/components/ui/BaseSelect.vue'

const store = useArticlesStore()
const { t } = useI18n()
const route = useRoute()
const router = useRouter()

const query = ref(String(route.query.q ?? ''))
const catId = ref('')
const country = ref('')
const author = ref('')
const dateRange = ref('')
const showFilters = ref(false)
const page = ref(1)
const PER_PAGE = 8

const authorOptions = computed(() => {
  const uniq = new Map<string, string>()
  store.published.forEach((a) => uniq.set(a.author.id, a.author.name))
  return [...uniq].map(([value, label]) => ({ value, label }))
})

const catOptions = computed(() => [
  { label: 'All categories', value: '' },
  ...store.categories.map((c) => ({ label: c.name, value: c.id }))
])

const countryOptions = computed(() => {
  const uniq = new Map<string, string>()
  store.published.forEach((a) => {
    if (a.country) uniq.set(a.country, a.country)
  })
  return [{ label: 'All countries', value: '' }, ...[...uniq].map(([code, name]) => ({ label: name, value: code }))]
})

const dateOptions = [
  { label: 'Any time', value: '' },
  { label: 'Today', value: 'today' },
  { label: 'Past 7 days', value: 'week' },
  { label: 'Past 30 days', value: 'month' }
]

const results = computed(() => {
  const q = query.value.trim().toLowerCase()
  return store.published.filter((a) => {
    if (q && !(a.title + a.excerpt + a.tags.join(' ') + a.author.name).toLowerCase().includes(q)) return false
    if (catId.value && a.categoryId !== catId.value) return false
    if (country.value && a.country !== country.value) return false
    if (author.value && a.author.id !== author.value) return false
    if (dateRange.value) {
      const d = Date.now() - new Date(a.publishedAt).getTime()
      if (dateRange.value === 'today' && d > 86400e3) return false
      if (dateRange.value === 'week' && d > 7 * 86400e3) return false
      if (dateRange.value === 'month' && d > 30 * 86400e3) return false
    }
    return true
  })
})

const paged = computed(() => {
  const start = (page.value - 1) * PER_PAGE
  return results.value.slice(start, start + PER_PAGE)
})

function runSearch() {
  page.value = 1
  router.replace({ path: '/search', query: { q: query.value || undefined } })
}

function clearFilters() {
  catId.value = ''
  country.value = ''
  author.value = ''
  dateRange.value = ''
  page.value = 1
}

watch([catId, country, author, dateRange], () => (page.value = 1))
watch(
  () => route.query.q,
  (q) => {
    query.value = String(q ?? '')
    page.value = 1
  }
)
</script>

<template>
  <div class="mx-auto max-w-7xl px-4 py-10">
    <div class="mx-auto max-w-3xl text-center">
      <h1 class="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white lg:text-4xl">{{ t('common.search') }}</h1>
      <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">Search across {{ store.published.length }} published articles, by keyword, category, author or country.</p>
      <form class="relative mx-auto mt-6 max-w-xl" @submit.prevent="runSearch">
        <Search class="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
        <input
          v-model="query"
          type="search"
          :placeholder="t('common.searchPlaceholder')"
          class="w-full rounded-2xl border border-gray-200 bg-white py-3.5 pl-12 pr-28 text-sm shadow-soft focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
        />
        <div class="absolute right-2 top-1/2 flex -translate-y-1/2 gap-1.5">
          <button
            type="button"
            class="flex items-center gap-1 rounded-xl px-3 py-2 text-xs font-bold text-gray-500 transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
            @click="showFilters = !showFilters"
          >
            <SlidersHorizontal class="h-3.5 w-3.5" /> Filters
          </button>
          <button type="submit" class="rounded-xl bg-primary-600 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-primary-700">
            {{ t('common.search') }}
          </button>
        </div>
      </form>
    </div>

    <Transition name="fade">
      <div v-if="showFilters" class="mx-auto mt-5 max-w-4xl rounded-2xl border border-gray-100 bg-white p-5 shadow-soft dark:border-gray-700 dark:bg-gray-800">
        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <BaseSelect v-model="catId" :options="catOptions" :label="t('common.allCategories')" />
          <BaseSelect v-model="country" :options="countryOptions" :label="t('common.allCountries')" />
          <BaseSelect v-model="author" :options="authorOptions" label="Author" placeholder="All authors" />
          <BaseSelect v-model="dateRange" :options="dateOptions" :label="t('common.dateFilter')" />
        </div>
        <div class="mt-3 flex justify-end">
          <button class="flex items-center gap-1 text-xs font-bold text-gray-400 transition-colors hover:text-red-500" @click="clearFilters">
            <X class="h-3.5 w-3.5" /> Clear all
          </button>
        </div>
      </div>
    </Transition>

    <p class="mt-8 text-sm font-semibold text-gray-500 dark:text-gray-400">
      {{ results.length }} {{ t('common.result') }}{{ route.query.q ? ` for "${route.query.q}"` : '' }}
    </p>

    <div v-if="paged.length" class="mt-4 space-y-4">
      <ArticleCard v-for="a in paged" :key="a.id" :article="a" variant="horizontal" />
      <div class="flex justify-center pt-4">
        <BasePagination v-model:current="page" :total="results.length" :per-page="PER_PAGE" />
      </div>
    </div>

    <div v-else class="mt-4 rounded-2xl border border-dashed border-gray-200 py-24 text-center dark:border-gray-700">
      <Search class="mx-auto h-12 w-12 text-gray-300 dark:text-gray-600" />
      <p class="mt-4 text-lg font-bold text-gray-600 dark:text-gray-300">{{ t('common.noResults') }}</p>
      <p class="mt-1 text-sm text-gray-400">Try different keywords or clear the active filters.</p>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>