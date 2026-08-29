<script setup lang="ts">
import { X } from '@lucide/vue'

withDefaults(
  defineProps<{
    open: boolean
    title?: string
    maxWidth?: string
  }>(),
  {
    open: false,
    title: '',
    maxWidth: 'max-w-lg'
  }
)

const emit = defineEmits<{ close: [] }>()

function onBackdrop() {
  emit('close')
}
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="open"
        class="fixed inset-0 z-[100] flex items-center justify-center p-4"
        @keydown.esc="emit('close')"
      >
        <div
          class="absolute inset-0 bg-gray-900/50 backdrop-blur-sm animate-fade-in"
          @click="onBackdrop"
        />
        <div
          :class="['modal-panel relative w-full rounded-2xl bg-white shadow-card dark:bg-gray-800', maxWidth]"
        >
          <div
            class="flex items-center justify-between border-b border-gray-100 px-5 py-4 dark:border-gray-700"
          >
            <h3 class="text-base font-bold text-gray-900 dark:text-white">{{ title }}</h3>
            <button
              class="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700"
              @click="emit('close')"
            >
              <X class="h-5 w-5" />
            </button>
          </div>
          <div class="max-h-[75vh] overflow-y-auto px-5 py-4">
            <slot />
          </div>
          <div v-if="$slots.footer" class="border-t border-gray-100 px-5 py-3 dark:border-gray-700">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}
.modal-enter-active .modal-panel,
.modal-leave-active .modal-panel {
  transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.25s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
.modal-enter-from .modal-panel,
.modal-leave-to .modal-panel {
  opacity: 0;
  transform: scale(0.95) translateY(8px);
}
</style>