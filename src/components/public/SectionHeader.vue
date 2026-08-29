<script setup lang="ts">
withDefaults(
  defineProps<{
    title: string
    linkTo?: string
    linkLabel?: string
    accent?: boolean
  }>(),
  {
    title: '',
    linkTo: '',
    linkLabel: '',
    accent: false
  }
)
</script>

<template>
  <div class="mb-5 flex items-center justify-between">
    <div class="flex items-center gap-3">
      <span :class="['h-7 w-1.5 rounded-full', accent ? 'bg-red-500' : 'bg-primary-600']" />
      <h2 class="text-xl font-extrabold tracking-tight text-gray-900 dark:text-white lg:text-2xl">
        {{ title }}
      </h2>
    </div>
    <router-link
      v-if="linkTo"
      :to="linkTo"
      class="group flex items-center gap-1 text-sm font-semibold text-primary-600 transition-colors hover:text-primary-700 dark:text-primary-400"
    >
      {{ linkLabel }}
      <span class="transition-transform group-hover:translate-x-0.5">→</span>
    </router-link>
  </div>
</template>