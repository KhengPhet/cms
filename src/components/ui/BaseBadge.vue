<script setup lang="ts">
import { computed } from 'vue'

type Tone = 'gray' | 'primary' | 'red' | 'green' | 'amber' | 'blue' | 'purple' | 'pink'

const props = withDefaults(
  defineProps<{
    tone?: Tone
    dot?: boolean
    size?: 'sm' | 'md'
  }>(),
  {
    tone: 'gray',
    dot: false,
    size: 'sm'
  }
)

const classes = computed(() => ({
  gray: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300',
  primary: 'bg-primary-50 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300',
  red: 'bg-red-50 text-red-700 dark:bg-red-900/40 dark:text-red-300',
  green: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  amber: 'bg-amber-50 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  blue: 'bg-sky-50 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300',
  purple: 'bg-purple-50 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
  pink: 'bg-pink-50 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300'
})[props.tone])

const dotClasses = computed(() => ({
  gray: 'bg-gray-400',
  primary: 'bg-primary-500',
  red: 'bg-red-500',
  green: 'bg-emerald-500',
  amber: 'bg-amber-500',
  blue: 'bg-sky-500',
  purple: 'bg-purple-500',
  pink: 'bg-pink-500'
})[props.tone])
</script>

<template>
  <span
    :class="[
      'inline-flex items-center gap-1.5 rounded-full font-semibold tracking-wide',
      size === 'sm' ? 'px-2.5 py-0.5 text-[10px] uppercase' : 'px-3 py-1 text-xs',
      classes
    ]"
  >
    <span v-if="dot" :class="['h-1.5 w-1.5 rounded-full', dotClasses]" />
    <slot />
  </span>
</template>