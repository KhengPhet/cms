<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Component } from 'vue'
import { Activity, Search, Download, RotateCcw, FileText, User, MessageSquare, Image as ImageIcon, FolderOpen, Settings } from '@lucide/vue'
import { useNotificationsStore } from '@/stores/notifications'
import BaseTable from '@/components/ui/BaseTable.vue'
import BaseAvatar from '@/components/ui/BaseAvatar.vue'
import BasePagination from '@/components/ui/BasePagination.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseSelect from '@/components/ui/BaseSelect.vue'
import { timeAgo } from '@/services/format'

const store = useNotificationsStore()

const query = ref('')
const actionFilter = ref('')
const page = ref(1)
const PER_PAGE = 8

const actionIcon: Record<string, Component> = {
  'Published article': FileText,
  'Updated article': FileText,
  'Deleted media': ImageIcon,
  'Uploaded media': ImageIcon,
  'Moderated comment': MessageSquare,
  'Created category': FolderOpen,
  'Updated category': FolderOpen,
  'Deleted category': FolderOpen,
  'Created user': User,
  'Edited user': User,
  'Changed user role': User,
  'Registered account': User,
  'Updated settings': Settings,
  'Saved draft': FileText,
  'Unpublished article': FileText,
  default: Activity
}

const actionOptions = computed(() => [
  { label: 'All actions', value: '' },
  ...[...new Set(store.activityLogs.map((l) => l.action))].map((a) => ({ label: a, value: a }))
])

const filtered = computed(() => {
  const q = query.value.trim().toLowerCase()
  return store.activityLogs.filter((l) => {
    if (q && !(l.user + l.action + l.entity).toLowerCase().includes(q)) return false
    if (actionFilter.value && l.action !== actionFilter.value) return false
    return true
  })
})

const paged = computed(() => {
  const start = (page.value - 1) * PER_PAGE
  return filtered.value.slice(start, start + PER_PAGE)
})

const columns = [
  { key: 'user', label: 'Actor' },
  { key: 'action', label: 'Action' },
  { key: 'entity', label: 'Target' },
  { key: 'ip', label: 'IP Address' },
  { key: 'date', label: 'Time', align: 'right' as const }
]
</script>

<template>
  <div class="space-y-5">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div>
        <p class="text-sm text-gray-500 dark:text-gray-400">Audit trail of every action taken across the platform.</p>
      </div>
      <div class="flex gap-2">
        <BaseButton variant="outline" size="sm"><Download class="h-4 w-4" /> Export CSV</BaseButton>
        <BaseButton variant="outline" size="sm"><RotateCcw class="h-4 w-4" /> Refresh</BaseButton>
      </div>
    </div>

    <div class="grid gap-3 rounded-2xl border border-gray-100 bg-white p-4 md:grid-cols-2 dark:border-gray-700 dark:bg-gray-800">
      <div class="relative">
        <Search class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          v-model="query"
          placeholder="Search actor, action or target…"
          class="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-3 text-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
        />
      </div>
      <BaseSelect v-model="actionFilter" :options="actionOptions" placeholder="All actions" />
    </div>

    <BaseTable :columns="columns" :items="paged">
      <template #cell-user="{ row }">
        <div class="flex items-center gap-3">
          <BaseAvatar :src="(row as any).avatar" :name="(row as any).user" size="sm" />
          <span class="text-sm font-bold text-gray-900 dark:text-white">{{ (row as any).user }}</span>
        </div>
      </template>
      <template #cell-action="{ row }">
        <div class="flex items-center gap-2">
          <span class="flex h-7 w-7 items-center justify-center rounded-lg bg-primary-50 text-primary-600 dark:bg-primary-900/40 dark:text-primary-400">
            <component :is="actionIcon[(row as any).action] ?? actionIcon.default" class="h-3.5 w-3.5" />
          </span>
          <span class="text-sm font-semibold text-gray-700 dark:text-gray-300">{{ (row as any).action }}</span>
        </div>
      </template>
      <template #cell-entity="{ row }">
        <span class="text-sm text-gray-600 dark:text-gray-400">{{ (row as any).entity }}</span>
      </template>
      <template #cell-ip="{ row }">
        <code class="rounded bg-gray-100 px-1.5 py-0.5 text-[11px] font-mono text-gray-500 dark:bg-gray-700 dark:text-gray-300">{{ (row as any).ip }}</code>
      </template>
      <template #cell-date="{ row }">
        <span class="whitespace-nowrap text-xs text-gray-400">{{ timeAgo((row as any).date) }}</span>
      </template>
    </BaseTable>

    <div class="flex justify-center">
      <BasePagination v-model:current="page" :total="filtered.length" :per-page="PER_PAGE" />
    </div>
  </div>
</template>