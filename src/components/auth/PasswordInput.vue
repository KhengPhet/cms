<script setup lang="ts">
import { ref } from 'vue'
import { Eye, EyeOff, Lock } from '@lucide/vue'

withDefaults(
  defineProps<{
    modelValue?: string
    label?: string
    placeholder?: string
    hint?: string
    error?: string
    disabled?: boolean
    required?: boolean
    autocomplete?: string
  }>(),
  {
    modelValue: '',
    label: 'Password',
    placeholder: 'Enter your password',
    hint: '',
    error: '',
    disabled: false,
    required: false,
    autocomplete: 'current-password'
  }
)

const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

const visible = ref(false)
</script>

<template>
  <div class="w-full">
    <label v-if="label" class="mb-1.5 block text-sm font-semibold text-gray-700 dark:text-gray-300">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>
    <div class="relative">
      <Lock
        class="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
      />
      <input
        :type="visible ? 'text' : 'password'"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :autocomplete="autocomplete"
        :class="[
          'w-full rounded-xl border py-2.5 pl-10 pr-11 text-sm text-gray-900 shadow-sm transition-all placeholder:text-gray-400 focus:outline-none focus:ring-2 dark:bg-gray-800 dark:text-white dark:disabled:bg-gray-700',
          error
            ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20 dark:border-red-500/60'
            : 'border-gray-200 focus:border-primary-500 focus:ring-primary-500/20 dark:border-gray-600'
        ]"
        @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      />
      <button
        type="button"
        :aria-label="visible ? 'Hide password' : 'Show password'"
        class="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-gray-400 transition-colors hover:text-gray-600 dark:hover:text-gray-200"
        @click="visible = !visible"
      >
        <EyeOff v-if="visible" class="h-4 w-4" />
        <Eye v-else class="h-4 w-4" />
      </button>
    </div>
    <p v-if="error" class="mt-1 text-xs font-medium text-red-500">{{ error }}</p>
    <p v-else-if="hint" class="mt-1 text-xs text-gray-400 dark:text-gray-500">{{ hint }}</p>
    <slot />
  </div>
</template>
