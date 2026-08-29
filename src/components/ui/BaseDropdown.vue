<script setup lang="ts">
import { ref } from 'vue'
import { ChevronDown } from '@lucide/vue'
import { useClickOutside } from '@/composables/useClickOutside'

withDefaults(
  defineProps<{
    align?: 'left' | 'right'
    label?: string
    chevron?: boolean
    width?: string
  }>(),
  {
    align: 'left',
    label: '',
    chevron: false,
    width: 'w-56'
  }
)

const open = ref(false)
const root = ref<HTMLElement | null>(null)
useClickOutside(root, () => (open.value = false))
</script>

<template>
  <div ref="root" class="relative inline-block">
    <div class="cursor-pointer" @click="open = !open">
      <slot name="trigger">
        <button
          class="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
        >
          {{ label }}
          <ChevronDown v-if="chevron" :class="['h-4 w-4 transition-transform', open ? 'rotate-180' : '']" />
        </button>
      </slot>
    </div>
    <Transition name="dropdown">
      <div
        v-if="open"
        :class="[
          'absolute z-50 mt-2 origin-top rounded-xl border border-gray-100 bg-white p-1.5 shadow-card dark:border-gray-700 dark:bg-gray-800',
          width,
          align === 'right' ? 'right-0' : 'left-0'
        ]"
        @click="open = false"
      >
        <slot />
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.dropdown-enter-active,
.dropdown-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-6px) scale(0.98);
}
</style>