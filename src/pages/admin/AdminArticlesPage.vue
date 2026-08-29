<script setup lang="ts">
import { computed, ref } from 'vue'
import { Plus, Eye, EyeOff, Pencil, Trash2, MoreHorizontal, FileText } from '@lucide/vue'
import { useArticlesStore } from '@/stores/articles'
import { useNotificationsStore } from '@/stores/notifications'
import { useToast } from '@/composables/useToast'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseSelect from '@/components/ui/BaseSelect.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseTable from '@/components/ui/BaseTable.vue'
import BasePagination from '@/components/ui/BasePagination.vue'
import StatusBadge from '@/components/ui/StatusBadge.vue'
import ConfirmationModal from '@/components/ui/ConfirmationModal.vue'
import BaseDropdown from '@/components/ui/BaseDropdown.vue'
import { formatDate } from '@/services/format'

const store = useArticlesStore()
const notifStore = useNotificationsStore()
const toast = useToast()

const query = ref('')
const statusFilter = ref('')
const catFilter = ref('')
const page = ref(1)
const PER_PAGE = 8
const allSelected = ref(false)
const selected = ref<string[]>([])

const toDelete = ref<string | null>(null)
const toBulkDelete = ref(false)

const filtered = computed(() => {
  const q = query.value.trim().toLowerCase()
  return store.articles.filter((a) => {
    if (q && !(a.title + a.author.name + a.tags.join(' ')).toLowerCase().includes(q)) return false
    if (statusFilter.value && a.status !== statusFilter.value) return false
    if (catFilter.value && a.categoryId !== catFilter.value) return false
    return true
  })
})

const paged = computed(() => {
  const start = (page.value - 1) * PER_PAGE
  return filtered.value.slice(start, start + PER_PAGE)
})

const totalPages = computed(() => filtered.value.length)

const statusOptions = [
  { label: 'All statuses', value: '' },
  { label: 'Published', value: 'published' },
  { label: 'Draft', value: 'draft' },
  { label: 'In review', value: 'review' },
  { label: 'Archived', value: 'archived' }
]

const catOptions = computed(() => [
  { label: 'All categories', value: '' },
  ...store.categories.map((c) => ({ label: c.name, value: c.id }))
])

const columns = [
  { key: 'title', label: 'Article' },
  { key: 'category', label: 'Category' },
  { key: 'scope', label: 'Scope' },
  { key: 'status', label: 'Status' },
  { key: 'views', label: 'Views', align: 'right' as const },
  { key: 'publishedAt', label: 'Published', align: 'right' as const },
  { key: 'actions', label: '', align: 'right' as const }
]

function isRowSelected(id: string) {
  return selected.value.includes(id)
}

function toggleRow(id: string) {
  allSelected.value = false
  selected.value = selected.value.includes(id) ? selected.value.filter((x) => x !== id) : [...selected.value, id]
}

function toggleStatus(a: { id: string; status: string; title: string }) {
  const next = a.status === 'published' ? 'draft' : 'published'
  store.setStatus(a.id, next)
  toast.success(`"${a.title.slice(0, 40)}…" marked ${next}`)
  notifStore.addActivity({
    id: 'l' + Date.now(),
    user: 'Sokha Mony',
    avatar: store.articles.find((x) => x.id === a.id)?.author.avatar ?? '',
    action: next === 'published' ? 'Published article' : 'Unpublished article',
    entity: a.title.slice(0, 40),
    ip: '203.0.113.10',
    date: new Date().toISOString()
  })
}

function confirmDelete(id: string) {
  toDelete.value = id
}

function commitDelete() {
  const id = toDelete.value
  if (id) {
    const a = store.articles.find((x) => x.id === id)
    store.deleteArticle(id)
    toast.success(a ? `Deleted "${a.title.slice(0, 40)}…"` : 'Article deleted')
    selected.value = selected.value.filter((x) => x !== id)
    toDelete.value = null
  }
}

function confirmBulkDelete() {
  toBulkDelete.value = false
  selected.value.forEach((id) => store.deleteArticle(id))
  toast.success(`${selected.value.length} articles deleted`)
  selected.value = []
  allSelected.value = false
}
</script>

<template>
  <div class="space-y-5">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div>
        <p class="text-sm text-gray-500 dark:text-gray-400">{{ store.articles.length }} articles total · {{ store.drafts.length }} drafts</p>
      </div>
      <div class="flex items-center gap-2">
        <BaseButton v-if="selected.length" variant="danger" size="sm" @click="toBulkDelete = true">
          <Trash2 class="h-4 w-4" /> Delete {{ selected.length }}
        </BaseButton>
        <router-link to="/admin/articles/new">
          <BaseButton>
            <Plus class="h-4 w-4" /> New article
          </BaseButton>
        </router-link>
      </div>
    </div>

    <div class="grid gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-soft md:grid-cols-3 dark:border-gray-700 dark:bg-gray-800">
      <BaseInput v-model="query" icon="search" placeholder="Search title, author, tags…" />
      <BaseSelect v-model="statusFilter" :options="statusOptions" placeholder="All statuses" />
      <BaseSelect v-model="catFilter" :options="catOptions" placeholder="All categories" />
    </div>

    <BaseTable
      :columns="columns"
      :items="paged"
      :selectable="true"
    >
      <template #cell-title="{ row }">
        <div class="flex items-center gap-3">
          <input
            type="checkbox"
            :checked="isRowSelected((row as any).id)"
            class="h-4 w-4 rounded border-gray-300 accent-primary-600"
            @click.stop="toggleRow((row as any).id)"
          />
          <img :src="(row as any).thumbnail" class="h-10 w-14 shrink-0 rounded-lg object-cover" alt="" />
          <div class="min-w-0">
            <p class="line-clamp-1 text-sm font-bold text-gray-900 dark:text-white">{{ (row as any).title }}</p>
            <p class="text-xs text-gray-400">{{ (row as any).author.name }}</p>
          </div>
        </div>
      </template>
      <template #cell-category="{ row }">
        <span class="text-sm font-medium text-gray-600 dark:text-gray-300">{{ (row as any).category }}</span>
      </template>
      <template #cell-scope="{ row }">
        <span
          :class="
            (row as any).scope === 'national'
              ? 'bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400'
              : 'bg-sky-50 text-sky-600 dark:bg-sky-900/30 dark:text-sky-400'
          "
          class="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase"
        >
          {{ (row as any).scope }}
        </span>
      </template>
      <template #cell-status="{ row }">
        <StatusBadge :status="(row as any).status" kind="article" />
      </template>
      <template #cell-views="{ row }">
        <span class="font-bold text-gray-900 dark:text-white">{{ (row as any).views.toLocaleString() }}</span>
      </template>
      <template #cell-publishedAt="{ row }">
        <span class="whitespace-nowrap text-xs text-gray-400">{{ formatDate((row as any).publishedAt) }}</span>
      </template>
      <template #cell-actions="{ row }">
        <div class="flex items-center justify-end gap-1">
          <router-link
            :to="`/admin/articles/${(row as any).id}/edit`"
            class="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-primary-50 hover:text-primary-600 dark:hover:bg-primary-900/40"
            title="Edit"
          >
            <Pencil class="h-4 w-4" />
          </router-link>
          <button
            class="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-amber-50 hover:text-amber-600 dark:hover:bg-amber-900/30"
            :title="(row as any).status === 'published' ? 'Unpublish' : 'Publish'"
            @click="toggleStatus(row as any)"
          >
            <EyeOff v-if="(row as any).status === 'published'" class="h-4 w-4" />
            <Eye v-else class="h-4 w-4" />
          </button>
          <button
            class="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/30"
            title="Delete"
            @click="confirmDelete((row as any).id)"
          >
            <Trash2 class="h-4 w-4" />
          </button>
          <BaseDropdown align="right" width="w-40">
            <template #trigger>
              <span class="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700">
                <MoreHorizontal class="h-4 w-4" />
              </span>
            </template>
            <router-link :to="`/admin/articles/${(row as any).id}/edit`" class="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-700">
              <Pencil class="h-3.5 w-3.5" /> Edit
            </router-link>
            <a :href="`/article/${(row as any).id}`" target="_blank" class="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-700">
              <FileText class="h-3.5 w-3.5" /> View page
            </a>
            <button class="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30" @click="confirmDelete((row as any).id)">
              <Trash2 class="h-3.5 w-3.5" /> Delete
            </button>
          </BaseDropdown>
        </div>
      </template>
    </BaseTable>

    <div class="flex justify-center pt-2">
      <BasePagination v-model:current="page" :total="totalPages" :per-page="PER_PAGE" />
    </div>

    <ConfirmationModal
      :open="!!toDelete"
      title="Delete article?"
      message="This will permanently remove the article, its comments and media references. This action cannot be undone."
      confirm-label="Delete"
      @confirm="commitDelete"
      @cancel="toDelete = null"
    />
    <ConfirmationModal
      :open="toBulkDelete"
      title="Delete selected articles?"
      :message="`You are about to permanently delete ${selected.length} articles.`"
      confirm-label="Delete all"
      @confirm="confirmBulkDelete"
      @cancel="toBulkDelete = false"
    />
  </div>
</template>