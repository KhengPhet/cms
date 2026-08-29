<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  UploadCloud,
  Image as ImageIcon,
  Video,
  Music,
  FileText,
  Trash2,
  Search,
  SearchX,
  Download,
  Eye
} from '@lucide/vue'
import { useMediaStore } from '@/stores/media'
import { useNotificationsStore } from '@/stores/notifications'
import { useToast } from '@/composables/useToast'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseModal from '@/components/ui/BaseModal.vue'
import ConfirmationModal from '@/components/ui/ConfirmationModal.vue'
import BaseTabs from '@/components/ui/BaseTabs.vue'
import { gradientImage } from '@/services/placeholder'
import { formatNumber } from '@/services/format'
import type { MediaItem } from '@/types'

const store = useMediaStore()
const notifStore = useNotificationsStore()
const toast = useToast()

const tab = ref('all')
const query = ref('')
const previewItem = ref<MediaItem | null>(null)
const toDelete = ref<string | null>(null)
const uploadOpen = ref(false)
const dropActive = ref(false)

const filtered = computed(() => {
  const q = query.value.trim().toLowerCase()
  return store.items.filter((m) => {
    if (tab.value !== 'all' && m.type !== tab.value) return false
    if (q && !(m.name + m.uploadedBy + m.mime).toLowerCase().includes(q)) return false
    return true
  })
})

const typeIcon = { image: ImageIcon, video: Video, audio: Music, document: FileText }
const typeColor = {
  image: 'text-emerald-500',
  video: 'text-red-500',
  audio: 'text-purple-500',
  document: 'text-sky-500'
}

const items = [
  { label: 'All media', value: 'all', count: store.items.length },
  { label: 'Images', value: 'image', count: store.images.length },
  { label: 'Videos', value: 'video', count: store.items.filter((m) => m.type === 'video').length },
  { label: 'Audio', value: 'audio', count: store.items.filter((m) => m.type === 'audio').length },
  { label: 'Documents', value: 'document', count: store.items.filter((m) => m.type === 'document').length }
]

function handleUpload(e: Event) {
  const input = e.target as HTMLInputElement
  const files = Array.from(input.files ?? [])
  files.forEach((file) => {
    const type: MediaItem['type'] = file.type.startsWith('image')
      ? 'image'
      : file.type.startsWith('video')
        ? 'video'
        : file.type.startsWith('audio')
          ? 'audio'
          : 'document'
    const reader = new FileReader()
    reader.onload = () => {
      store.addItem({
        id: 'm' + Date.now() + Math.random(),
        name: file.name,
        url: type === 'image' ? String(reader.result) : gradientImage(Math.floor(Math.random() * 12), file.name),
        type,
        size: (file.size / (1024 * 1024)).toFixed(1) + ' MB',
        mime: file.type || 'application/octet-stream',
        uploadedBy: 'Sokha Mony',
        date: new Date().toISOString().slice(0, 10),
        downloads: 0
      })
    }
    reader.readAsDataURL(file)
  })
  toast.success(`Uploaded ${files.length} file${files.length > 1 ? 's' : ''}`)
  notifStore.addActivity({
    id: 'l' + Date.now(),
    user: 'Sokha Mony',
    avatar: store.items[0]?.url ?? '',
    action: 'Uploaded media',
    entity: files.map((f) => f.name).join(', ').slice(0, 40),
    ip: '203.0.113.10',
    date: new Date().toISOString()
  })
  uploadOpen.value = false
}

function commitDelete() {
  if (toDelete.value) {
    store.deleteItem(toDelete.value)
    toast.success('File deleted')
    toDelete.value = null
  }
}
</script>

<template>
  <div class="space-y-5">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <p class="text-sm text-gray-500 dark:text-gray-400">{{ store.items.length }} files · {{ store.items.reduce((s, m) => s + (m.type === 'image' || m.type === 'video' || m.type === 'audio' ? 1 : 0), 0) }} media</p>
      <BaseButton @click="uploadOpen = true">
        <UploadCloud class="h-4 w-4" /> Upload media
      </BaseButton>
    </div>

    <div class="grid gap-3 rounded-2xl border border-gray-100 bg-white p-4 sm:grid-cols-3 dark:border-gray-700 dark:bg-gray-800">
      <div class="sm:col-span-1">
        <div class="relative">
          <Search class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            v-model="query"
            placeholder="Search files…"
            class="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-3 text-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          />
        </div>
      </div>
      <div class="sm:col-span-2">
        <BaseTabs v-model="tab" :items="items" />
      </div>
    </div>

    <div v-if="filtered.length" class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      <div
        v-for="m in filtered"
        :key="m.id"
        class="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-card dark:border-gray-700 dark:bg-gray-800"
      >
        <div class="relative aspect-[4/3] overflow-hidden bg-gray-100 dark:bg-gray-700">
          <img
            v-if="m.type === 'image'"
            :src="m.url"
            :alt="m.name"
            class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div v-else class="flex h-full w-full flex-col items-center justify-center gap-2 bg-gray-50 dark:bg-gray-700">
            <component :is="typeIcon[m.type]" :class="['h-10 w-10', typeColor[m.type]]" />
            <span class="text-[11px] font-semibold text-gray-400">{{ m.type.toUpperCase() }}</span>
          </div>
          <div class="absolute inset-0 flex items-center justify-center gap-2 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
            <button
              class="flex h-8 w-8 items-center justify-center rounded-full bg-white text-gray-700 transition-transform hover:scale-110"
              title="Preview"
              @click="previewItem = m"
            >
              <Eye class="h-4 w-4" />
            </button>
            <button
              class="flex h-8 w-8 items-center justify-center rounded-full bg-red-500 text-white transition-transform hover:scale-110"
              title="Delete"
              @click="toDelete = m.id"
            >
              <Trash2 class="h-4 w-4" />
            </button>
          </div>
        </div>
        <div class="p-3">
          <p class="truncate text-xs font-bold text-gray-800 dark:text-gray-200">{{ m.name }}</p>
          <p class="mt-1 text-[10px] text-gray-400">{{ m.size }} · {{ m.width ? m.width + '×' + m.height + ' · ' : '' }}{{ m.uploadedBy }}</p>
        </div>
      </div>
    </div>

    <div v-else class="rounded-2xl border border-dashed border-gray-200 py-20 text-center dark:border-gray-700">
      <SearchX class="mx-auto h-10 w-10 text-gray-300" />
      <p class="mt-3 font-semibold text-gray-500 dark:text-gray-400">No media found</p>
      <p class="text-xs text-gray-400">Try a different search term or upload new files.</p>
    </div>

    <BaseModal :open="!!previewItem" title="Media preview" max-width="max-w-2xl" @close="previewItem = null">
      <div v-if="previewItem">
        <img v-if="previewItem.type === 'image'" :src="previewItem.url" :alt="previewItem.name" class="w-full rounded-xl object-contain" />
        <div v-else class="relative flex aspect-video items-center justify-center overflow-hidden rounded-xl bg-gray-900">
          <img :src="previewItem.url" alt="" class="absolute inset-0 h-full w-full object-cover opacity-40" />
          <component :is="typeIcon[previewItem.type]" class="relative h-14 w-14 text-white" />
        </div>
        <div class="mt-4 grid grid-cols-2 gap-3 text-sm">
          <div class="rounded-xl bg-gray-50 p-3 dark:bg-gray-700/50">
            <p class="text-[10px] font-bold uppercase tracking-wide text-gray-400">Filename</p>
            <p class="mt-1 truncate font-semibold text-gray-800 dark:text-gray-200">{{ previewItem.name }}</p>
          </div>
          <div class="rounded-xl bg-gray-50 p-3 dark:bg-gray-700/50">
            <p class="text-[10px] font-bold uppercase tracking-wide text-gray-400">Type</p>
            <p class="mt-1 font-semibold text-gray-800 dark:text-gray-200">{{ previewItem.mime }}</p>
          </div>
          <div class="rounded-xl bg-gray-50 p-3 dark:bg-gray-700/50">
            <p class="text-[10px] font-bold uppercase tracking-wide text-gray-400">Size</p>
            <p class="mt-1 font-semibold text-gray-800 dark:text-gray-200">{{ previewItem.size }}</p>
          </div>
          <div class="rounded-xl bg-gray-50 p-3 dark:bg-gray-700/50">
            <p class="text-[10px] font-bold uppercase tracking-wide text-gray-400">Uploaded by</p>
            <p class="mt-1 font-semibold text-gray-800 dark:text-gray-200">{{ previewItem.uploadedBy }}</p>
          </div>
          <div class="rounded-xl bg-gray-50 p-3 dark:bg-gray-700/50">
            <p class="text-[10px] font-bold uppercase tracking-wide text-gray-400">Date</p>
            <p class="mt-1 font-semibold text-gray-800 dark:text-gray-200">{{ previewItem.date }}</p>
          </div>
          <div class="rounded-xl bg-gray-50 p-3 dark:bg-gray-700/50">
            <p class="text-[10px] font-bold uppercase tracking-wide text-gray-400">Downloads</p>
            <p class="mt-1 font-semibold text-gray-800 dark:text-gray-200">{{ formatNumber(previewItem.downloads ?? 0) }}</p>
          </div>
        </div>
        <div class="mt-4 flex gap-2">
          <BaseButton variant="secondary" size="sm"><Download class="h-4 w-4" /> Download</BaseButton>
          <BaseButton variant="danger" size="sm" @click="toDelete = previewItem!.id; previewItem = null">
            <Trash2 class="h-4 w-4" /> Delete
          </BaseButton>
        </div>
      </div>
    </BaseModal>

    <BaseModal :open="uploadOpen" title="Upload media" @close="uploadOpen = false">
      <label
        class="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed px-6 py-14 text-center transition-colors"
        :class="dropActive ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : 'border-gray-300 hover:border-primary-400 dark:border-gray-600'"
        @dragover.prevent="dropActive = true"
        @dragleave="dropActive = false"
        @drop.prevent="dropActive = false"
      >
        <UploadCloud class="h-12 w-12 text-primary-500" />
        <div>
          <p class="font-bold text-gray-700 dark:text-gray-200">Drag & drop files here</p>
          <p class="mt-1 text-xs text-gray-400">or click to browse. Images, videos, audio & documents supported.</p>
        </div>
        <span class="rounded-lg bg-primary-600 px-4 py-2 text-sm font-bold text-white">Browse files</span>
        <input type="file" multiple class="hidden" @change="handleUpload" />
      </label>
    </BaseModal>

    <ConfirmationModal
      :open="!!toDelete"
      title="Delete file?"
      message="This permanently removes the media file. Any article thumbnails using it may break."
      confirm-label="Delete"
      @confirm="commitDelete"
      @cancel="toDelete = null"
    />
  </div>
</template>