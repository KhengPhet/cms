<script setup lang="ts">
import { CircleAlert, CircleCheck, Info, X } from '@lucide/vue'

withDefaults(
  defineProps<{
    type: 'success' | 'error' | 'info'
    title?: string
    message?: string
    dismissible?: boolean
  }>(),
  { title: '', message: '', dismissible: false }
)

const emit = defineEmits<{ dismiss: [] }>()

const styles: Record<string, string> = {
  success: 'border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900/40 dark:bg-emerald-900/20 dark:text-emerald-200',
  error: 'border-red-200 bg-red-50 text-red-800 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-200',
  info: 'border-sky-200 bg-sky-50 text-sky-800 dark:border-sky-900/40 dark:bg-sky-900/20 dark:text-sky-200'
}
</script>

<template>
  <div
    role="alert"
    class="flex items-start gap-3 rounded-xl border px-4 py-3 text-sm animate-fade-in"
    :class="styles[type]"
  >
    <CircleCheck v-if="type === 'success'" class="mt-0.5 h-4 w-4 shrink-0" />
    <CircleAlert v-else-if="type === 'error'" class="mt-0.5 h-4 w-4 shrink-0" />
    <Info v-else class="mt-0.5 h-4 w-4 shrink-0" />
    <div class="min-w-0 flex-1">
      <p v-if="title" class="font-bold">{{ title }}</p>
      <p v-if="message" class="opacity-90">{{ message }}</p>
      <slot />
    </div>
    <button
      v-if="dismissible"
      class="shrink-0 opacity-60 transition-opacity hover:opacity-100"
      aria-label="Dismiss"
      @click="emit('dismiss')"
    >
      <X class="h-4 w-4" />
    </button>
  </div>
</template>
