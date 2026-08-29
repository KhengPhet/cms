<script setup lang="ts">
import type { PropType } from 'vue'
import { Loader2 } from '@lucide/vue'

export interface TableColumn {
  key: string
  label: string
  align?: 'left' | 'right' | 'center'
  width?: string
}

const props = defineProps({
  columns: { type: Array as PropType<TableColumn[]>, required: true },
  items: { type: Array as PropType<unknown[]>, default: () => [] },
  loading: { type: Boolean, default: false },
  selectable: { type: Boolean, default: false },
  emptyText: { type: String, default: 'No records found' },
  rowKey: { type: String, default: 'id' }
})

const emit = defineEmits<{ 'update:selected': [value: string[]] }>()

function cellSlot(key: string) {
  return `cell-${key}`
}
</script>

<template>
  <div class="overflow-hidden rounded-2xl border border-gray-100 bg-white dark:border-gray-700 dark:bg-gray-800">
    <div class="overflow-x-auto">
      <table class="w-full text-left text-sm">
        <thead>
          <tr class="border-b border-gray-100 bg-gray-50/70 dark:border-gray-700 dark:bg-gray-800/60">
            <template v-for="col in columns" :key="col.key">
              <th
                :class="[
                  'whitespace-nowrap px-4 py-3 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400',
                  col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'
                ]"
                :style="col.width ? `width: ${col.width}` : ''"
              >
                {{ col.label }}
              </th>
            </template>
          </tr>
        </thead>
        <tbody>
          <tr v-if="loading">
            <td :colspan="columns.length" class="px-4 py-16 text-center">
              <Loader2 class="mx-auto h-6 w-6 animate-spin text-primary-500" />
              <p class="mt-2 text-sm text-gray-400">Loading data…</p>
            </td>
          </tr>
          <tr v-else-if="items.length === 0">
            <td :colspan="columns.length" class="px-4 py-16 text-center">
              <slot name="empty">
                <p class="text-sm text-gray-400">{{ emptyText }}</p>
              </slot>
            </td>
          </tr>
          <template v-else>
            <tr
              v-for="row in items"
              :key="String((row as Record<string, unknown>)[rowKey])"
              class="border-b border-gray-50 transition-colors last:border-0 hover:bg-gray-50/70 dark:border-gray-700/50 dark:hover:bg-gray-700/30"
            >
              <td
                v-for="col in columns"
                :key="col.key"
                :class="[
                  'px-4 py-3.5 text-gray-700 dark:text-gray-300',
                  col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'
                ]"
              >
                <slot :name="cellSlot(col.key)" :row="row">
                  {{ (row as Record<string, unknown>)[col.key] }}
                </slot>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
  </div>
</template>