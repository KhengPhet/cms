<script setup lang="ts">
import { AlertTriangle, Trash2 } from '@lucide/vue'
import BaseModal from './BaseModal.vue'
import BaseButton from './BaseButton.vue'

withDefaults(
  defineProps<{
    open: boolean
    title?: string
    message?: string
    confirmLabel?: string
    cancelLabel?: string
    danger?: boolean
  }>(),
  {
    title: 'Are you sure?',
    message: 'This action cannot be undone.',
    confirmLabel: 'Confirm',
    cancelLabel: 'Cancel',
    danger: true
  }
)

const emit = defineEmits<{ confirm: []; cancel: [] }>()
</script>

<template>
  <BaseModal :open="open" :title="title" max-width="max-w-md" @close="emit('cancel')">
    <div class="flex gap-4">
      <div
        class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full"
        :class="danger ? 'bg-red-50 dark:bg-red-900/30' : 'bg-primary-50 dark:bg-primary-900/30'"
      >
        <AlertTriangle
          v-if="danger"
          class="h-6 w-6 text-red-500"
        />
        <Trash2 v-else class="h-6 w-6 text-primary-500" />
      </div>
      <div>
        <p class="text-sm text-gray-500 dark:text-gray-400">{{ message }}</p>
      </div>
    </div>
    <template #footer>
      <div class="flex justify-end gap-2">
        <BaseButton variant="outline" size="sm" @click="emit('cancel')">{{ cancelLabel }}</BaseButton>
        <BaseButton :variant="danger ? 'danger' : 'primary'" size="sm" @click="emit('confirm')">
          {{ confirmLabel }}
        </BaseButton>
      </div>
    </template>
  </BaseModal>
</template>