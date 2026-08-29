<script setup lang="ts">
withDefaults(
  defineProps<{
    padded?: boolean
    hover?: boolean
    borderless?: boolean
  }>(),
  {
    padded: true,
    hover: false,
    borderless: false
  }
)
</script>

<template>
  <div
    :class="[
      'rounded-2xl bg-white transition-all duration-300 dark:bg-gray-800',
      borderless ? '' : 'border border-gray-100 dark:border-gray-700',
      padded ? 'p-5' : '',
      hover
        ? 'shadow-soft hover:-translate-y-0.5 hover:shadow-card'
        : 'shadow-soft'
    ]"
  >
    <slot />
  </div>
</template>