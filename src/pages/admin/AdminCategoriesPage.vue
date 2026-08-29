<script setup lang="ts">
import { computed, ref } from 'vue'
import { Plus, Pencil, Trash2, FolderPlus, Layers } from '@lucide/vue'
import { useArticlesStore } from '@/stores/articles'
import { useNotificationsStore } from '@/stores/notifications'
import { useToast } from '@/composables/useToast'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseCard from '@/components/ui/BaseCard.vue'
import ConfirmationModal from '@/components/ui/ConfirmationModal.vue'
import BaseModal from '@/components/ui/BaseModal.vue'
import { slugify } from '@/services/format'

const store = useArticlesStore()
const notifStore = useNotificationsStore()
const toast = useToast()

const modalOpen = ref(false)
const editingId = ref<string | null>(null)
const toDelete = ref<string | null>(null)

const form = ref({ name: '', description: '', color: '#4f46e5' })

const counts = computed(() => store.categoryCounts)

const palette = ['#4f46e5', '#7c3aed', '#2563eb', '#0891b2', '#0d9488', '#059669', '#ea580c', '#db2777', '#dc2626', '#f59e0b', '#8b5cf6', '#14b8a6']

function openNew() {
  editingId.value = null
  form.value = { name: '', description: '', color: '#4f46e5' }
  modalOpen.value = true
}

function openEdit(c: { id: string; name: string; description?: string; color?: string }) {
  editingId.value = c.id
  form.value = { name: c.name, description: c.description ?? '', color: c.color ?? '#4f46e5' }
  modalOpen.value = true
}

async function save() {
  if (!form.value.name.trim()) {
    toast.error('Category name is required')
    return
  }
  const id = editingId.value ?? 'c' + Date.now()
  try {
    await store.upsertCategory({
      id,
      name: form.value.name.trim(),
      slug: slugify(form.value.name) || 'category',
      description: form.value.description || undefined,
      color: form.value.color,
      articleCount: counts.value[id] ?? 0
    })
    store.syncCategories()
    notifStore.addActivity({
      id: 'l' + Date.now(),
      user: 'Sokha Mony',
      avatar: store.articles[0]?.author.avatar ?? '',
      action: editingId.value ? 'Updated category' : 'Created category',
      entity: form.value.name,
      ip: '203.0.113.10',
      date: new Date().toISOString()
    })
    toast.success(editingId.value ? 'Category updated' : 'Category created')
    modalOpen.value = false
  } catch (e) {
    toast.error(e instanceof Error ? e.message : 'Failed to save category')
  }
}

async function commitDelete() {
  if (toDelete.value) {
    const c = store.categories.find((x) => x.id === toDelete.value)
    try {
      await store.deleteCategory(toDelete.value)
      toast.success(`Deleted category "${c?.name}"`)
      toDelete.value = null
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to delete category')
    }
  }
}
</script>

<template>
  <div class="space-y-5">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <p class="text-sm text-gray-500 dark:text-gray-400">{{ store.categories.length }} categories configured</p>
      <BaseButton @click="openNew">
        <Plus class="h-4 w-4" /> Add category
      </BaseButton>
    </div>

    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      <BaseCard
        v-for="c in store.categories"
        :key="c.id"
        hover
        class="group"
      >
        <div class="flex items-start justify-between">
          <span
            class="flex h-12 w-12 items-center justify-center rounded-xl"
            :style="{ backgroundColor: (c.color ?? '#4f46e5') + '1a', color: c.color ?? '#4f46e5' }"
          >
            <Layers class="h-6 w-6" />
          </span>
          <div class="flex gap-1">
            <button class="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-primary-50 hover:text-primary-600 dark:hover:bg-primary-900/40" title="Edit" @click="openEdit(c)">
              <Pencil class="h-4 w-4" />
            </button>
            <button class="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/30" title="Delete" @click="toDelete = c.id">
              <Trash2 class="h-4 w-4" />
            </button>
          </div>
        </div>
        <h3 class="mt-4 text-lg font-extrabold text-gray-900 dark:text-white">{{ c.name }}</h3>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400" style="min-height: 20px;">{{ c.description }}</p>
        <div class="mt-3 flex items-center justify-between border-t border-gray-50 pt-3 dark:border-gray-700/50">
          <span class="text-xs font-bold" :style="{ color: c.color }">{{ c.slug }}</span>
          <span class="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-bold text-gray-600 dark:bg-gray-700 dark:text-gray-300">
            {{ counts[c.id] ?? 0 }} articles
          </span>
        </div>
      </BaseCard>

      <button
        class="flex min-h-[180px] flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-gray-200 text-gray-400 transition-colors hover:border-primary-400 hover:bg-primary-50/40 hover:text-primary-600 dark:border-gray-700 dark:hover:border-primary-600 dark:hover:bg-primary-900/20"
        @click="openNew"
      >
        <FolderPlus class="h-8 w-8" />
        <span class="text-sm font-bold">New category</span>
      </button>
    </div>

    <BaseModal :open="modalOpen" :title="editingId ? 'Edit category' : 'Add category'" @close="modalOpen = false">
      <div class="space-y-4">
        <BaseInput v-model="form.name" label="Category name" required placeholder="e.g. Technology" />
        <BaseInput v-model="form.description" label="Description" placeholder="Short description of this category" />
        <div>
          <label class="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">Color</label>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="color in palette"
              :key="color"
              class="h-8 w-8 rounded-full transition-transform hover:scale-110"
              :class="form.color === color ? 'ring-2 ring-offset-2 ring-gray-400' : ''"
              :style="{ backgroundColor: color }"
              @click="form.color = color"
            />
          </div>
        </div>
      </div>
      <template #footer>
        <div class="flex justify-end gap-2">
          <BaseButton variant="outline" size="sm" @click="modalOpen = false">Cancel</BaseButton>
          <BaseButton size="sm" @click="save">{{ editingId ? 'Save changes' : 'Create' }}</BaseButton>
        </div>
      </template>
    </BaseModal>

    <ConfirmationModal
      :open="!!toDelete"
      title="Delete category?"
      message="Articles in this category will remain published but lose their category assignment."
      confirm-label="Delete"
      @confirm="commitDelete"
      @cancel="toDelete = null"
    />
  </div>
</template>