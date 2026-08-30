<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useArticlesStore } from '@/stores/articles'
import ArticleCard from '@/components/public/ArticleCard.vue'
import PageBanner from '@/components/public/PageBanner.vue'
import SectionHeader from '@/components/public/SectionHeader.vue'
import BasePagination from '@/components/ui/BasePagination.vue'
import { TrendingUp } from '@lucide/vue'

const route = useRoute()
const store = useArticlesStore()

const category = computed(() => store.categories.find((c) => c.slug === route.params.slug))
const page = ref(1)
const PER_PAGE = 9

const list = computed(() =>
  store.published.filter((a) => a.categoryId === category.value?.id || a.category === category.value?.name)
)

const current = computed(() => list.value[0])
const paged = computed(() => {
  const start = (page.value - 1) * PER_PAGE
  const rest = list.value.slice(1)
  return { rest: rest.slice(start, start + PER_PAGE) }
})

const trending = computed(() => [...store.published].sort((a, b) => b.views - a.views).slice(0, 5))

watch(
  () => route.params.slug,
  () => (page.value = 1)
)
</script>

<template>
  <div>
    <PageBanner
      tone="neutral"
      :eyebrow="category?.name ?? 'Category'"
      :title="category?.name ?? 'Category'"
      :description="category?.description ?? ''"
    />

    <section class="page-container py-8">
      <div class="grid gap-6 lg:grid-cols-3">
        <div class="space-y-6 lg:col-span-2">
          <ArticleCard v-if="current" :article="current" variant="overlay" />

          <SectionHeader :title="`Latest ${category?.name ?? ''} news`" />
          <div v-if="paged.rest.length" class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <ArticleCard v-for="a in paged.rest" :key="a.id" :article="a" :show-excerpt="false" />
          </div>
          <div v-else class="rounded-2xl border border-dashed border-gray-200 py-16 text-center dark:border-gray-700">
            <p class="font-semibold text-gray-400">No articles in this category yet.</p>
          </div>
          <div class="flex justify-center pt-2">
            <BasePagination v-model:current="page" :total="Math.max(0, list.length - 1)" :per-page="PER_PAGE" />
          </div>
        </div>

        <aside class="space-y-6">
          <div class="card-surface p-5">
            <div class="mb-4 flex items-center gap-2">
              <TrendingUp class="h-4 w-4 text-primary-600 dark:text-primary-400" />
              <h3 class="text-sm font-extrabold uppercase tracking-wide text-gray-900 dark:text-white">Top in category</h3>
            </div>
            <div class="space-y-2">
              <ArticleCard v-for="a in trending" :key="a.id" :article="a" variant="compact" />
            </div>
          </div>
        </aside>
      </div>
    </section>
  </div>
</template>