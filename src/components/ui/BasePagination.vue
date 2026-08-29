<script setup lang="ts">
import { computed } from 'vue'
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from '@lucide/vue'

const props = withDefaults(
  defineProps<{
    current: number
    total: number
    perPage?: number
    siblingCount?: number
  }>(),
  {
    perPage: 8,
    siblingCount: 1
  }
)

const emit = defineEmits<{ 'update:current': [value: number] }>()

const pageCount = computed(() => Math.max(1, Math.ceil(props.total / props.perPage)))

const pages = computed<number[]>(() => {
  const total = pageCount.value
  const current = props.current
  const sibling = props.siblingCount
  const set = new Set<number>([1, total, current])
  for (let i = current - sibling; i <= current + sibling; i++) {
    if (i >= 1 && i <= total) set.add(i)
  }
  return [...set]
    .sort((a, b) => a - b)
    .reduce<number[]>((acc, p, i, arr) => {
      if (i > 0 && p - arr[i - 1] > 1) acc.push(-1)
      acc.push(p)
      return acc
    }, [])
})

function go(p: number) {
  if (p < 1 || p > pageCount.value || p === props.current) return
  emit('update:current', p)
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<template>
  <nav v-if="pageCount > 1" class="flex items-center justify-center gap-1" aria-label="Pagination">
    <button
      class="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-800 disabled:opacity-40 dark:hover:bg-gray-700 dark:hover:text-gray-100"
      :disabled="current <= 1"
      @click="go(1)"
    >
      <ChevronsLeft class="h-4 w-4" />
    </button>
    <button
      class="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-800 disabled:opacity-40 dark:hover:bg-gray-700 dark:hover:text-gray-100"
      :disabled="current <= 1"
      @click="go(current - 1)"
    >
      <ChevronLeft class="h-4 w-4" />
    </button>
    <template v-for="(p, i) in pages" :key="i">
      <button
        v-if="p === -1"
        class="flex h-9 items-center px-2 text-sm text-gray-400"
        disabled
      >
        …
      </button>
      <button
        v-else
        class="flex h-9 items-center rounded-lg px-3.5 text-sm font-semibold transition-all"
        :class="
          p === current
            ? 'bg-primary-600 text-white shadow-sm'
            : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
        "
        @click="go(p)"
      >
        {{ p }}
      </button>
    </template>
    <button
      class="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-800 disabled:opacity-40 dark:hover:bg-gray-700 dark:hover:text-gray-100"
      :disabled="current >= pageCount"
      @click="go(current + 1)"
    >
      <ChevronRight class="h-4 w-4" />
    </button>
    <button
      class="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-800 disabled:opacity-40 dark:hover:bg-gray-700 dark:hover:text-gray-100"
      :disabled="current >= pageCount"
      @click="go(pageCount)"
    >
      <ChevronsRight class="h-4 w-4" />
    </button>
  </nav>
</template>