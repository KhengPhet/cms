<script setup lang="ts">
withDefaults(
  defineProps<{
    modelValue?: string
    label?: string
    type?: 'text' | 'email' | 'number' | 'url'
    placeholder?: string
    hint?: string
    error?: string
    prefix?: string
    disabled?: boolean
    required?: boolean
    autocomplete?: string
  }>(),
  {
    modelValue: '',
    label: '',
    type: 'text',
    placeholder: '',
    hint: '',
    error: '',
    prefix: '',
    disabled: false,
    required: false,
    autocomplete: 'off'
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
      <span
        v-if="prefix"
        class="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-gray-400"
      >{{ prefix }}</span>
      <input
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :autocomplete="autocomplete"
        :class="[
          'w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-gray-900 shadow-sm transition-all placeholder:text-gray-400 focus:outline-none focus:ring-2 dark:bg-gray-800 dark:text-white dark:disabled:bg-gray-700',
          prefix ? 'pl-8' : '',
          error
            ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20 dark:border-red-500/60'
            : 'border-gray-200 focus:border-primary-500 focus:ring-primary-500/20 dark:border-gray-600'
        ]"
        @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      />
    </div>
    <p v-if="error" class="mt-1 text-xs font-medium text-red-500">{{ error }}</p>
    <p v-else-if="hint" class="mt-1 text-xs text-gray-400 dark:text-gray-500">{{ hint }}</p>
  </div>
</template>
