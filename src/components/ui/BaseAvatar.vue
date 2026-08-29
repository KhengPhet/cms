<script setup lang="ts">
import { computed } from 'vue'
import { initials } from '@/services/format'

const props = withDefaults(
  defineProps<{
    src?: string
    name: string
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  }>(),
  {
    src: '',
    size: 'md'
  }
)

const sizeClass = computed(() => ({
  xs: 'h-6 w-6 text-[9px]',
  sm: 'h-8 w-8 text-[11px]',
  md: 'h-10 w-10 text-sm',
  lg: 'h-12 w-12 text-base',
  xl: 'h-16 w-16 text-xl'
})[props.size])
</script>

<template>
  <div class="relative inline-block shrink-0" :title="name">
    <img
      v-if="src"
      :src="src"
      :alt="name"
      :class="['rounded-full object-cover', sizeClass]"
    />
    <div
      v-else
      :class="[
        'flex items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-indigo-600 font-bold text-white',
        sizeClass
      ]"
    >
      {{ initials(name) }}
    </div>
  </div>
</template>