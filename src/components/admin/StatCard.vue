<script setup lang="ts">
import { computed } from 'vue'
import { TrendingUp, TrendingDown, Minus } from '@lucide/vue'

const props = withDefaults(
  defineProps<{
    label: string
    value: string
    icon?: unknown
    tone?: 'primary' | 'red' | 'green' | 'amber' | 'blue' | 'purple' | 'pink'
    delta?: number
    deltaLabel?: string
  }>(),
  {
    delta: 0,
    deltaLabel: 'vs last week'
  }
)

const tones = computed(() => ({
  primary: 'bg-primary-100 text-primary-600 dark:bg-primary-900/40 dark:text-primary-400',
  red: 'bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400',
  green: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400',
  amber: 'bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400',
  blue: 'bg-sky-100 text-sky-600 dark:bg-sky-900/40 dark:text-sky-400',
  purple: 'bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-400',
  pink: 'bg-pink-100 text-pink-600 dark:bg-pink-900/40 dark:text-pink-400'
})[props.tone!])

const rising = computed(() => props.delta > 0)
const flat = computed(() => props.delta === 0)

const trendIcon = computed(() => {
  if (flat.value) return Minus
  return rising.value ? TrendingUp : TrendingDown
})

const trendColor = computed(() => {
  if (flat.value) return 'text-gray-400'
  return rising.value ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500 dark:text-red-400'
})
</script>

<template>
  <div class="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-5 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-card dark:border-gray-700 dark:bg-gray-800">
    <div class="flex items-start justify-between">
      <div class="min-w-0">
        <p class="text-sm font-semibold text-gray-500 dark:text-gray-400">{{ label }}</p>
        <p class="mt-1.5 text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white lg:text-3xl">
          {{ value }}
        </p>
      </div>
      <div
        class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-transform group-hover:scale-110"
        :class="tones"
      >
        <component :is="icon" class="h-6 w-6" />
      </div>
    </div>
    <div class="mt-3 flex items-center gap-1.5 text-xs">
      <span
        class="flex items-center gap-1 rounded-md px-1.5 py-0.5 font-bold"
        :class="trendColor + ' bg-current/10'"
        style="background-color: color-mix(in srgb, currentColor 10%, transparent)"
      >
        <component :is="trendIcon" class="h-3.5 w-3.5" />
        {{ Math.abs(delta) }}%
      </span>
      <span class="text-gray-400">{{ deltaLabel }}</span>
    </div>
  </div>
</template>