<script setup lang="ts">
import { computed } from 'vue'
import { useArticlesStore } from '@/stores/articles'

const props = defineProps<{
  categoryId?: string
  name?: string
  link?: boolean
}>()

const store = useArticlesStore()

const category = computed(() => store.categories.find((c) => c.id === props.categoryId))

const style = computed(() => ({
  color: category.value?.color ?? '#4f46e5'
}))

const content = computed(() => props.name ?? category.value?.name ?? 'News')

const to = computed(() => (category.value ? `/category/${category.value.slug}` : '#'))
</script>

<template>
  <router-link
    v-if="link !== false && category"
    :to="to"
    class="inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide"
    :style="{ backgroundColor: style.color + '1a', color: style.color }"
  >
    {{ content }}
  </router-link>
  <span
    v-else
    class="inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide"
    :style="{ backgroundColor: style.color + '1a', color: style.color }"
  >
    {{ content }}
  </span>
</template>