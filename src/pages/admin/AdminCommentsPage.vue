<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { Check, Trash2, Flag, Eye, Search } from '@lucide/vue'
import { useCommentsStore } from '@/stores/comments'
import { useToast } from '@/composables/useToast'
import BaseTable from '@/components/ui/BaseTable.vue'
import BaseTabs from '@/components/ui/BaseTabs.vue'
import BaseAvatar from '@/components/ui/BaseAvatar.vue'
import BasePagination from '@/components/ui/BasePagination.vue'
import ConfirmationModal from '@/components/ui/ConfirmationModal.vue'
import BaseModal from '@/components/ui/BaseModal.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import { timeAgo } from '@/services/format'

const store = useCommentsStore()
const toast = useToast()

const tab = ref('pending')
const query = ref('')
const page = ref(1)
const PER_PAGE = 6
const toDelete = ref<string | null>(null)
const detail = ref<string | null>(null)
const pendingOnly = ref(true)

onMounted(() => store.fetchAll())

const view = computed(() => {
  if (pendingOnly.value) return store.comments.filter((c) => c.status === 'pending' || c.status === 'reported')
  return store.comments.filter((c) => c.status === 'visible' || c.status === 'hidden')
})

const filtered = computed(() => {
  const q = query.value.trim().toLowerCase()
  return view.value.filter((c) => !q || (c.author + c.content + c.articleTitle).toLowerCase().includes(q))
})

const paged = computed(() => {
  const start = (page.value - 1) * PER_PAGE
  return filtered.value.slice(start, start + PER_PAGE)
})

const tabs = [
  { label: 'Pending & reports', value: 'pending', count: store.comments.filter((c) => c.status === 'pending' || c.status === 'reported').length },
  { label: 'Approved', value: 'approved', count: store.comments.filter((c) => c.status === 'visible' || c.status === 'hidden').length }
]

const columns = [
  { key: 'comment', label: 'Comment' },
  { key: 'date', label: 'Date', align: 'right' as const },
  { key: 'actions', label: '', align: 'right' as const }
]

function onTab(v: string) {
  pendingOnly.value = v === 'pending'
  page.value = 1
}

async function approve(c: { id: string }) {
  await store.setStatus(c.id, 'visible')
  toast.success('Comment approved and published')
}

async function hide(c: { id: string }) {
  await store.setStatus(c.id, 'hidden')
  toast.success('Comment hidden from public')
}

async function dismissReport(c: { id: string }) {
  await store.setStatus(c.id, 'visible')
  toast.success('Report dismissed, comment restored')
}

async function commitDelete() {
  if (toDelete.value) {
    await store.deleteComment(toDelete.value)
    toast.success('Comment deleted')
    toDelete.value = null
  }
}
</script>

<template>
  <div class="space-y-5">
    <div class="grid gap-3 rounded-2xl border border-gray-100 bg-white p-4 md:grid-cols-2 dark:border-gray-700 dark:bg-gray-800">
      <div class="relative">
        <Search class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          v-model="query"
          placeholder="Search comments, authors, articles…"
          class="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-3 text-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
        />
      </div>
      <BaseTabs v-model="tab" :items="tabs" @update:model-value="onTab" />
    </div>

    <div class="rounded-2xl border border-amber-100 bg-amber-50 p-3 text-xs text-amber-700 dark:border-amber-900/40 dark:bg-amber-900/20 dark:text-amber-300">
      <strong>{{ store.comments.filter((c) => c.status === 'reported').length }} reported</strong> comment(s) need your attention. Reported comments are hidden from the public until you decide.
    </div>

    <BaseTable :columns="columns" :items="paged" :empty-text="pendingOnly ? 'No comments awaiting moderation' : 'No approved comments yet'">
      <template #cell-comment="{ row }">
        <div class="flex items-start gap-3">
          <BaseAvatar :src="(row as any).avatar" :name="(row as any).author" size="sm" />
          <div class="min-w-0">
            <div class="flex flex-wrap items-center gap-2">
              <span class="text-sm font-bold text-gray-900 dark:text-white">{{ (row as any).author }}</span>
              <span v-if="(row as any).status === 'reported'" class="flex items-center gap-1 rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-bold uppercase text-red-600 dark:bg-red-900/30 dark:text-red-400">
                <Flag class="h-3 w-3" /> Reported
              </span>
              <span v-else-if="(row as any).status === 'pending'" class="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold uppercase text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">
                Pending
              </span>
              <span v-else-if="(row as any).status === 'hidden'" class="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-bold uppercase text-gray-500 dark:bg-gray-700 dark:text-gray-400">
                Hidden
              </span>
            </div>
            <p class="mt-0.5 text-sm text-gray-600 dark:text-gray-300">{{ (row as any).content }}</p>
            <p class="mt-1 text-[11px] text-gray-400">on <router-link :to="`/article/${(row as any).articleId}`" class="font-semibold text-primary-600 hover:underline dark:text-primary-400">{{ (row as any).articleTitle }}</router-link></p>
          </div>
        </div>
      </template>
      <template #cell-date="{ row }">
        <span class="whitespace-nowrap text-xs text-gray-400">{{ timeAgo((row as any).date) }}<br />{{ (row as any).likes }} 👍</span>
      </template>
      <template #cell-actions="{ row }">
        <div class="flex items-center justify-end gap-1">
          <button
            v-if="(row as any).status !== 'visible'"
            class="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-emerald-50 hover:text-emerald-600 dark:hover:bg-emerald-900/30"
            title="Approve"
            @click="(row as any).status === 'reported' ? dismissReport(row as any) : approve(row as any)"
          >
            <Check class="h-4 w-4" />
          </button>
          <button class="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-sky-50 hover:text-sky-600 dark:hover:bg-sky-900/30" title="View" @click="detail = (row as any).id">
            <Eye class="h-4 w-4" />
          </button>
          <button
            v-if="(row as any).status === 'visible'"
            class="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-amber-50 hover:text-amber-600 dark:hover:bg-amber-900/30"
            title="Hide"
            @click="hide(row as any)"
          >
            <Eye class="h-4 w-4" />
          </button>
          <button class="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/30" title="Delete" @click="toDelete = (row as any).id">
            <Trash2 class="h-4 w-4" />
          </button>
        </div>
      </template>
    </BaseTable>

    <div class="flex justify-center">
      <BasePagination v-model:current="page" :total="filtered.length" :per-page="PER_PAGE" />
    </div>

    <BaseModal :open="!!detail" title="Comment detail" max-width="max-w-lg" @close="detail = null">
      <div v-if="detail && store.comments.find((c) => c.id === detail)" class="space-y-3">
        <div class="flex items-center gap-3">
          <BaseAvatar :src="store.comments.find((c) => c.id === detail)!.avatar" :name="store.comments.find((c) => c.id === detail)!.author" size="lg" />
          <div>
            <p class="font-bold text-gray-900 dark:text-white">{{ store.comments.find((c) => c.id === detail)!.author }}</p>
            <p class="text-xs text-gray-400">{{ timeAgo(store.comments.find((c) => c.id === detail)!.date) }}</p>
          </div>
        </div>
        <div class="rounded-xl bg-gray-50 p-4 dark:bg-gray-700/40">
          <p class="text-sm leading-relaxed text-gray-700 dark:text-gray-200">{{ store.comments.find((c) => c.id === detail)!.content }}</p>
        </div>
        <p class="text-xs text-gray-400">
          Article: <router-link :to="`/article/${store.comments.find((c) => c.id === detail)!.articleId}`" class="font-semibold text-primary-600 hover:underline">{{ store.comments.find((c) => c.id === detail)!.articleTitle }}</router-link>
        </p>
        <div class="flex gap-2">
          <BaseButton
            v-if="store.comments.find((c) => c.id === detail)!.status !== 'visible'"
            variant="success" size="sm" @click="approve(store.comments.find((c) => c.id === detail)!); detail = null"
          >
            <Check class="h-4 w-4" /> Approve
          </BaseButton>
          <BaseButton variant="danger" size="sm" @click="toDelete = detail; detail = null"><Trash2 class="h-4 w-4" /> Delete</BaseButton>
        </div>
      </div>
    </BaseModal>

    <ConfirmationModal
      :open="!!toDelete"
      title="Delete comment?"
      message="This permanently removes the comment. This action cannot be undone."
      confirm-label="Delete"
      @confirm="commitDelete"
      @cancel="toDelete = null"
    />
  </div>
</template>