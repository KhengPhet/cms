<script setup lang="ts">
import { Loader2 } from '@lucide/vue'

withDefaults(
  defineProps<{
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success'
    size?: 'sm' | 'md' | 'lg' | 'icon'
    loading?: boolean
    type?: 'button' | 'submit'
    block?: boolean
    disabled?: boolean
  }>(),
  {
    variant: 'primary',
    size: 'md',
    type: 'button',
    block: false,
    disabled: false
  }
)

const emit = defineEmits<{ click: [e: MouseEvent] }>()

function onClick(e: MouseEvent) {
  emit('click', e)
}
</script>

<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    :class="[
      'inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:focus-visible:ring-offset-gray-900 active:scale-[0.98]',
      block ? 'w-full' : '',
      size === 'sm' && 'px-3 py-1.5 text-xs',
      size === 'md' && 'px-4 py-2.5 text-sm',
      size === 'lg' && 'px-6 py-3 text-base',
      size === 'icon' && 'h-9 w-9 p-0',
      variant === 'primary' &&
        'bg-primary-600 text-white shadow-sm hover:bg-primary-700 shadow-lift',
      variant === 'secondary' &&
        'bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600',
      variant === 'outline' &&
        'border border-gray-200 bg-white text-gray-700 hover:border-primary-300 hover:text-primary-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:border-primary-500',
      variant === 'ghost' && 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800',
      variant === 'danger' &&
        'bg-red-600 text-white shadow-sm hover:bg-red-700 focus-visible:ring-red-500',
      variant === 'success' &&
        'bg-emerald-600 text-white shadow-sm hover:bg-emerald-700 focus-visible:ring-emerald-500'
    ]"
    @click="onClick"
  >
    <Loader2 v-if="loading" class="h-4 w-4 animate-spin" />
    <slot />
  </button>
</template>