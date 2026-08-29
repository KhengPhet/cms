<script setup lang="ts">
import { computed, ref } from 'vue'
import { Bell, Check, CheckCheck, Trash2, Info, AlertTriangle, XCircle, CheckCircle2 } from '@lucide/vue'
import { useNotificationsStore } from '@/stores/notifications'
import { useToast } from '@/composables/useToast'
import { timeAgo } from '@/services/format'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseTabs from '@/components/ui/BaseTabs.vue'

const store = useNotificationsStore()
const toast = useToast()

const tab = ref('all')
const icons = { info: Info, success: CheckCircle2, warning: AlertTriangle, danger: XCircle }
const tones = {
  info: 'bg-sky-100 text-sky-600 dark:bg-sky-900/40 dark:text-sky-400',
  success: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400',
  warning: 'bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400',
  danger: 'bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400'
}

const filtered = computed(() =>
  tab.value === 'all' ? store.notifications : store.notifications.filter((n) => n.type === tab.value)
)

const tabs = [
  { label: 'All', value: 'all', count: store.notifications.length },
  { label: 'Info', value: 'info', count: store.notifications.filter((n) => n.type === 'info').length },
  { label: 'Success', value: 'success', count: store.notifications.filter((n) => n.type === 'success').length },
  { label: 'Warnings', value: 'warning', count: store.notifications.filter((n) => n.type === 'warning').length },
  { label: 'Alerts', value: 'danger', count: store.notifications.filter((n) => n.type === 'danger').length }
]

function clearAll() {
  store.notifications = []
  toast.success('All notifications cleared')
}
</script>

<template>
  <div class="mx-auto max-w-3xl space-y-5">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div class="flex items-center gap-3">
        <span class="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-100 text-primary-600 dark:bg-primary-900/40 dark:text-primary-400">
          <Bell class="h-5 w-5" />
        </span>
        <div>
          <h2 class="text-lg font-extrabold text-gray-900 dark:text-white">Notification Center</h2>
          <p class="text-xs text-gray-400">{{ store.unreadCount }} unread · {{ store.notifications.length }} total</p>
        </div>
      </div>
      <div class="flex gap-2">
        <BaseButton variant="secondary" size="sm" @click="store.markAllRead(); toast.success('All marked as read')">
          <CheckCheck class="h-4 w-4" /> Mark all read
        </BaseButton>
        <BaseButton variant="danger" size="sm" @click="clearAll">
          <Trash2 class="h-4 w-4" /> Clear all
        </BaseButton>
      </div>
    </div>

    <div class="rounded-2xl border border-gray-100 bg-white p-3 dark:border-gray-700 dark:bg-gray-800">
      <BaseTabs v-model="tab" :items="tabs" />
    </div>

    <div class="space-y-3">
      <article
        v-for="n in filtered"
        :key="n.id"
        class="flex items-start gap-4 rounded-2xl border p-4 transition-all"
        :class="n.read ? 'border-gray-100 bg-white dark:border-gray-700 dark:bg-gray-800' : 'border-primary-100 bg-primary-50/40 dark:border-primary-900/40 dark:bg-primary-900/10'"
      >
        <span :class="['flex h-10 w-10 shrink-0 items-center justify-center rounded-xl', tones[n.type]]">
          <component :is="icons[n.type]" class="h-5 w-5" />
        </span>
        <div class="min-w-0 flex-1">
          <div class="flex items-center justify-between gap-2">
            <h3 class="text-sm font-bold text-gray-900 dark:text-white">{{ n.title }}</h3>
            <span class="shrink-0 text-[11px] text-gray-400">{{ timeAgo(n.date) }}</span>
          </div>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">{{ n.message }}</p>
        </div>
        <button
          v-if="!n.read"
          class="mt-1 shrink-0 rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-white hover:text-primary-600 dark:hover:bg-gray-700"
          title="Mark read"
          @click="store.markRead(n.id)"
        >
          <Check class="h-4 w-4" />
        </button>
      </article>

      <p v-if="!filtered.length" class="py-16 text-center text-sm text-gray-400">No notifications in this category.</p>
    </div>
  </div>
</template>