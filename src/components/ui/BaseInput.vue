<script setup lang="ts">
import { Search } from '@lucide/vue'

withDefaults(
  defineProps<{
    modelValue?: string
    label?: string
    type?: 'text' | 'email' | 'password' | 'number' | 'search' | 'url' | 'date'
    placeholder?: string
    hint?: string
    error?: string
    icon?: 'search' | 'email' | 'user' | 'lock' | 'link' | 'none'
    disabled?: boolean
    required?: boolean
    textarea?: boolean
    rows?: number
  }>(),
  {
    modelValue: '',
    label: '',
    type: 'text',
    placeholder: '',
    hint: '',
    error: '',
    icon: 'none',
    disabled: false,
    required: false,
    textarea: false,
    rows: 3
  }
)

const emit = defineEmits<{ 'update:modelValue': [value: string] }>()
</script>

<template>
  <div class="w-full">
    <label v-if="label" class="mb-1.5 block text-sm font-semibold text-gray-700 dark:text-gray-300">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>
    <div class="relative">
      <Search
        v-if="icon === 'search'"
        class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
      />
      <textarea
        v-if="textarea"
        :rows="rows"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        class="w-full rounded-xl border px-3.5 py-2.5 text-sm text-gray-900 shadow-sm transition-colors placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-50 dark:bg-gray-800 dark:text-white dark:disabled:bg-gray-700 resize-y"
        @input="emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
      />
      <input
        v-else
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :class="[
          'w-full rounded-xl border px-3.5 py-2.5 text-sm text-gray-900 shadow-sm transition-colors placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-50 dark:bg-gray-800 dark:text-white dark:disabled:bg-gray-700',
          icon !== 'none' ? 'pl-10' : '',
          error ? 'border-red-400 focus:ring-red-500' : 'border-gray-200 dark:border-gray-600'
        ]"
        @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      />
      <span
        v-if="icon === 'email'"
        class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
      >@</span>
    </div>
    <p v-if="error" class="mt-1 text-xs font-medium text-red-500">{{ error }}</p>
    <p v-else-if="hint" class="mt-1 text-xs text-gray-400">{{ hint }}</p>
  </div>
</template>