<script setup lang="ts">
import { computed, ref, watch } from 'vue'

interface TabItem {
  label: string
  value: string
  count?: number
  icon?: string
}

const props = withDefaults(
  defineProps<{
    items: TabItem[]
    modelValue: string
  }>(),
  {}
)

const emit = defineEmits<{ 'update:modelValue': [value: string] }>()
const active = computed(() => props.items.find((i) => i.value === props.modelValue)?.label || '')
const id = ref('tabs-' + Math.random().toString(36).slice(2, 8))

function setValue(v: string) {
  emit('update:modelValue', v)
}

watch(
  () => props.modelValue,
  () => {
    const panel = document.getElementById(id.value + '-' + props.modelValue)
    panel?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }
)
</script>

<template>
  <div>
    <div class="flex w-full items-center gap-1 border-b border-gray-100 dark:border-gray-700">
      <button
        v-for="tab in items"
        :key="tab.value"
        class="relative flex items-center gap-2 whitespace-nowrap px-4 py-2.5 text-sm font-semibold transition-colors"
        :class="
          modelValue === tab.value
            ? 'text-primary-600 dark:text-primary-400'
            : 'text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200'
        "
        @click="setValue(tab.value)"
      >
        {{ tab.label }}
        <span
          v-if="tab.count !== undefined"
          class="rounded-full px-1.5 py-0.5 text-[10px] font-bold"
          :class="
            modelValue === tab.value
              ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/50 dark:text-primary-300'
              : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
          "
        >
          {{ tab.count }}
        </span>
        <span
          v-if="modelValue === tab.value"
          class="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-primary-600 dark:bg-primary-400"
        />
      </button>
    </div>
    <div
      :id="id + '-' + modelValue"
      class="py-4"
      :aria-label="active"
    >
      <slot />
    </div>
  </div>
</template>