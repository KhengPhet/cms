<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { ChevronLeft, ChevronRight } from '@lucide/vue'
import type { Article } from '@/types'
import ArticleCard from './ArticleCard.vue'
import { useI18n } from '@/composables/useI18n'

const props = defineProps<{
  articles: Article[]
}>()

const { lang } = useI18n()
const current = ref(0)
let timer: number | null = null

const total = computed(() => props.articles.length)

function go(i: number) {
  current.value = ((i % total.value) + total.value) % total.value
}

function restart() {
  if (timer) window.clearInterval(timer)
  timer = window.setInterval(() => go(current.value + 1), 5000)
}

watch(
  () => props.articles.length,
  () => {
    if (current.value >= total.value) current.value = 0
    restart()
  },
  { immediate: true }
)

onMounted(restart)
onBeforeUnmount(() => {
  if (timer) window.clearInterval(timer)
})
</script>

<template>
  <div v-if="articles.length" class="relative slider-fade" :key="lang">
    <div class="overflow-hidden rounded-xl sm:rounded-3xl">
      <div
        class="flex transition-transform duration-700 ease-out"
        :style="{ transform: `translateX(-${current * 100}%)` }"
      >
        <div v-for="a in articles" :key="a.id" class="w-full shrink-0">
          <ArticleCard :article="a" variant="overlay" :show-excerpt="false" />
        </div>
      </div>
    </div>

    <button
      class="absolute left-2 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-gray-700 shadow-card backdrop-blur transition-all hover:scale-110 hover:bg-white sm:left-3 sm:h-10 sm:w-10"
      @click="go(current - 1)"
    >
      <ChevronLeft class="h-4 w-4 sm:h-5 sm:w-5" />
    </button>
    <button
      class="absolute right-2 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-gray-700 shadow-card backdrop-blur transition-all hover:scale-110 hover:bg-white sm:right-3 sm:h-10 sm:w-10"
      @click="go(current + 1)"
    >
      <ChevronRight class="h-4 w-4 sm:h-5 sm:w-5" />
    </button>

    <div class="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-1.5 sm:bottom-4">
      <button
        v-for="(a, i) in articles"
        :key="a.id"
        class="rounded-full transition-all duration-300"
        :class="i === current ? 'h-2 w-6 bg-white sm:w-7' : 'h-2 w-2 bg-white/50 hover:bg-white/80'"
        aria-label="slide"
        @click="go(i)"
      />
    </div>
  </div>
</template>