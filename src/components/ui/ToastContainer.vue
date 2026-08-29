<script setup lang="ts">
import { CheckCircle2, AlertTriangle, Info, XCircle, X } from '@lucide/vue'
import { useNotificationsStore } from '@/stores/notifications'

const store = useNotificationsStore()

const icons = {
  success: CheckCircle2,
  error: XCircle,
  info: Info,
  warning: AlertTriangle
}

const tone = {
  success: 'text-emerald-500',
  error: 'text-red-500',
  info: 'text-sky-500',
  warning: 'text-amber-500'
}
</script>

<template>
  <Teleport to="body">
    <div class="pointer-events-none fixed inset-x-0 top-4 z-[200] flex flex-col items-center gap-2 px-4">
      <TransitionGroup name="toast">
        <div
          v-for="toast in store.toasts"
          :key="toast.id"
          class="pointer-events-auto flex w-full max-w-sm items-center gap-3 rounded-xl border border-gray-100 bg-white px-4 py-3 shadow-card dark:border-gray-700 dark:bg-gray-800"
        >
          <component :is="icons[toast.type]" :class="['h-5 w-5 shrink-0', tone[toast.type]]" />
          <p class="flex-1 text-sm font-medium text-gray-800 dark:text-gray-100">{{ toast.message }}</p>
          <button
            class="text-gray-300 transition-colors hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-300"
            @click="store.dismiss(toast.id)"
          >
            <X class="h-4 w-4" />
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.25s ease;
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(-12px) scale(0.96);
}
.toast-leave-active {
  position: absolute;
}
</style>