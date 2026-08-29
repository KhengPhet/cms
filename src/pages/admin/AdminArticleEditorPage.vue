<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Save, Send, ArrowLeft, Image as ImageIcon, X } from '@lucide/vue'
import { useArticlesStore } from '@/stores/articles'
import { useMediaStore } from '@/stores/media'
import { useNotificationsStore } from '@/stores/notifications'
import { useToast } from '@/composables/useToast'
import { countries, provinces } from '@/services/data'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseSelect from '@/components/ui/BaseSelect.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseModal from '@/components/ui/BaseModal.vue'
import RichTextEditor from '@/components/ui/RichTextEditor.vue'
import { slugify, readingTime } from '@/services/format'
import { gradientImage, avatarImage } from '@/services/placeholder'
import type { Article, ArticleStatus } from '@/types'

const route = useRoute()
const router = useRouter()
const store = useArticlesStore()
const mediaStore = useMediaStore()
const notifStore = useNotificationsStore()
const toast = useToast()

const isEdit = computed(() => !!route.params.id)
const original = computed(() => (isEdit.value ? store.byId(String(route.params.id)) : null))

const form = reactive({
  title: '',
  slug: '',
  excerpt: '',
  categoryId: 'c1',
  scope: 'national' as 'national' | 'international',
  country: '',
  province: '',
  tags: [] as string[],
  authorId: 'a1',
  status: 'draft' as ArticleStatus,
  publishedAt: new Date().toISOString().slice(0, 10),
  content: ''
})

const tagInput = ref('')
const thumb = ref('')
const thumbOpen = ref(false)
const autoTitle = ref(true)

if (original.value) {
  const a = original.value
  form.title = a.title
  form.slug = a.slug
  form.excerpt = a.excerpt
  form.categoryId = a.categoryId
  form.scope = a.scope
  form.country = a.country ?? ''
  form.province = a.province ?? ''
  form.tags = [...a.tags]
  form.authorId = a.author.id
  form.status = a.status
  form.publishedAt = a.publishedAt.slice(0, 10)
  form.content = a.content
  thumb.value = a.thumbnail
  autoTitle.value = false
}

const authorOptions = computed(() => store.articles.map((a) => a.author).filter((a, i, arr) => arr.findIndex((x) => x.id === a.id) === i))
const scopeOptions = [
  { label: 'National', value: 'national' },
  { label: 'International', value: 'international' }
]
const countryOptions = computed(() => [
  { label: 'Select country…', value: '' },
  ...countries.map((c) => ({ label: `${c.flag} ${c.name}`, value: c.code }))
])
const provinceOptions = computed(() => [
  { label: 'None', value: '' },
  ...provinces.map((p) => ({ label: p, value: p }))
])
const catOptions = computed(() => store.categories.map((c) => ({ label: c.name, value: c.id })))

const gradientOptions = Array.from({ length: 12 }, (_, i) => gradientImage(i, 'Thumbnail ' + (i + 1)))

function onTitle() {
  if (autoTitle.value) form.slug = slugify(form.title) || 'article'
}

function addTag() {
  const t = tagInput.value.trim().replace(/^#/, '')
  if (t && !form.tags.includes(t)) form.tags.push(t)
  tagInput.value = ''
}

function removeTag(i: number) {
  form.tags.splice(i, 1)
}

function updateStatus(status: ArticleStatus) {
  form.status = status
  save(status)
}

async function save(status?: ArticleStatus) {
  const s = status ?? form.status
  const id = isEdit.value ? String(route.params.id) : 'art-' + Date.now()
  const kind = s === 'published' ? 'published' : 'draft'
  if (kind === 'published' && !form.title.trim()) {
    toast.error('Title is required to publish')
    return
  }
  const article: Article = {
    id,
    title: form.title || 'Untitled article',
    slug: form.slug || slugify(form.title) || 'article',
    excerpt: form.excerpt || form.title,
    content: form.content || '<p>…</p>',
    thumbnail: thumb.value || gradientImage(0, form.title),
    category: store.categories.find((c) => c.id === form.categoryId)?.name ?? 'National',
    categoryId: form.categoryId,
    scope: form.scope,
    country: form.scope === 'international' ? form.country || 'asia' : undefined,
    province: form.scope === 'national' ? form.province || undefined : undefined,
    tags: form.tags.length ? form.tags : [store.categories.find((c) => c.id === form.categoryId)?.name ?? 'National'],
    author: store.articles.find((a) => a.author.id === form.authorId)?.author ?? {
      id: form.authorId,
      name: 'Sokha Mony',
      username: 'sokhamony',
      avatar: avatarImage(0),
      role: 'Editor'
    },
    status: s,
    publishedAt: new Date(form.publishedAt).toISOString() || new Date().toISOString(),
    views: isEdit.value ? original.value?.views ?? 0 : 0,
    likes: isEdit.value ? original.value?.likes ?? 0 : 0,
    commentsCount: isEdit.value ? original.value?.commentsCount ?? 0 : 0,
    readTime: readingTime(form.content),
    isFeatured: false,
    isBreaking: false,
    isVideo: false
  }
  try {
    await store.saveArticle(article)
    toast.success(s === 'published' ? 'Article published' : 'Draft saved')
    notifStore.addActivity({
      id: 'l' + Date.now(),
      user: 'Sokha Mony',
      avatar: avatarImage(0),
      action: s === 'published' ? 'Published article' : 'Saved draft',
      entity: article.title.slice(0, 40),
      ip: '203.0.113.10',
      date: new Date().toISOString()
    })
    router.push('/admin/articles')
  } catch (err) {
    toast.error(err instanceof Error ? err.message : 'Failed to save article')
  }
}

onMounted(() => {
  if (!isEdit.value && !form.content) {
    form.content = '<p>Start writing…</p>'
  }
})
</script>

<template>
  <div class="mx-auto max-w-5xl space-y-5">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div class="flex items-center gap-3">
        <button
          class="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
          @click="router.back()"
        >
          <ArrowLeft class="h-5 w-5" />
        </button>
        <div>
          <h2 class="text-xl font-extrabold text-gray-900 dark:text-white">{{ isEdit ? 'Edit article' : 'Create article' }}</h2>
          <p class="text-xs text-gray-400">{{ isEdit ? form.slug : 'All fields marked * are required' }}</p>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <BaseButton variant="outline" size="sm" @click="updateStatus('draft')">
          <Save class="h-4 w-4" /> Save draft
        </BaseButton>
        <BaseButton size="sm" @click="updateStatus('published')">
          <Send class="h-4 w-4" /> Publish
        </BaseButton>
      </div>
    </div>

    <div class="grid gap-5 lg:grid-cols-3">
      <div class="space-y-5 lg:col-span-2">
        <div class="rounded-2xl border border-gray-100 bg-white p-5 shadow-soft dark:border-gray-700 dark:bg-gray-800">
          <BaseInput
            v-model="form.title"
            label="Title"
            required
            placeholder="Enter a compelling headline…"
            @update:model-value="onTitle"
          />
          <div class="mt-4">
            <BaseInput v-model="form.slug" label="Slug" placeholder="auto-generated-slug" hint="Used in the article URL: /article/" />
          </div>
          <div class="mt-4">
            <BaseInput v-model="form.excerpt" label="Excerpt / description" textarea :rows="3" placeholder="Short summary shown on cards…" />
          </div>

          <div class="mt-5 border-t border-gray-100 pt-4 dark:border-gray-700">
            <label class="mb-1.5 block text-sm font-semibold text-gray-700 dark:text-gray-300">Content</label>
            <RichTextEditor v-model="form.content" :min-height="380" />
          </div>
        </div>

        <div class="rounded-2xl border border-gray-100 bg-white p-5 shadow-soft dark:border-gray-700 dark:bg-gray-800">
          <div class="mb-3 flex items-center justify-between">
            <label class="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Tags <span class="text-xs text-gray-400">(press Enter to add)</span>
            </label>
            <span class="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-bold text-gray-500 dark:bg-gray-700 dark:text-gray-300">{{ form.tags.length }}</span>
          </div>
          <div class="flex flex-wrap items-center gap-2">
            <span
              v-for="(tag, i) in form.tags"
              :key="tag"
              class="flex items-center gap-1 rounded-full bg-primary-50 px-3 py-1.5 text-xs font-bold text-primary-700 dark:bg-primary-900/40 dark:text-primary-300"
            >
              #{{ tag }}
              <button class="rounded-full p-0.5 hover:bg-primary-200/50" @click="removeTag(i)">
                <X class="h-3 w-3" />
              </button>
            </span>
            <input
              v-model="tagInput"
              placeholder="Add tag…"
              class="rounded-full border border-dashed border-gray-300 px-3 py-1.5 text-xs focus:border-primary-400 focus:outline-none dark:border-gray-500 dark:bg-gray-800 dark:text-white"
              @keydown.enter.prevent="addTag"
              @blur="addTag"
            />
          </div>
        </div>
      </div>

      <div class="space-y-5">
        <div class="rounded-2xl border border-gray-100 bg-white p-5 shadow-soft dark:border-gray-700 dark:bg-gray-800">
          <label class="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">Thumbnail image *</label>
          <button
            class="group relative block w-full overflow-hidden rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-600"
            @click="thumbOpen = true"
          >
            <img v-if="thumb" :src="thumb" alt="" class="aspect-[16/9] w-full object-cover" />
            <div v-else class="flex aspect-[16/9] w-full flex-col items-center justify-center gap-2 text-gray-400">
              <ImageIcon class="h-8 w-8" />
              <span class="text-xs font-semibold">Click to choose from media library</span>
            </div>
            <span class="absolute inset-0 flex items-center justify-center bg-black/40 text-xs font-bold text-white opacity-0 transition-opacity group-hover:opacity-100">
              Change image
            </span>
          </button>
          <p class="mt-2 text-[11px] text-gray-400">Recommended 16:9 ratio, min 1200×675.</p>
          <div class="mt-3 grid grid-cols-4 gap-2">
            <button
              v-for="(g, i) in gradientOptions.slice(0, 8)"
              :key="i"
              class="overflow-hidden rounded-lg border-2 transition-all"
              :class="thumb === g ? 'border-primary-500 ring-2 ring-primary-500/30' : 'border-transparent hover:border-gray-300'"
              @click="thumb = g"
            >
              <img :src="g" alt="" class="aspect-video w-full object-cover" />
            </button>
          </div>
        </div>

        <div class="rounded-2xl border border-gray-100 bg-white p-5 shadow-soft dark:border-gray-700 dark:bg-gray-800">
          <div class="space-y-4">
            <BaseSelect v-model="form.categoryId" :options="catOptions" label="Category" required />
            <BaseSelect v-model="form.scope" :options="scopeOptions" label="Scope" required />
            <BaseSelect v-if="form.scope === 'international'" v-model="form.country" :options="countryOptions" label="Country" />
            <BaseSelect v-if="form.scope === 'national'" v-model="form.province" :options="provinceOptions" label="Province" />
            <BaseSelect v-model="form.authorId" :options="authorOptions.map((a) => ({ label: a.name, value: a.id }))" label="Author" required />
            <BaseInput v-model="form.publishedAt" label="Publish date" type="date" />
            <div class="flex gap-2">
              <BaseButton variant="outline" size="sm" block @click="updateStatus('draft')">Save draft</BaseButton>
              <BaseButton variant="success" size="sm" block @click="updateStatus('published')">Publish</BaseButton>
            </div>
          </div>
        </div>
      </div>
    </div>

    <BaseModal :open="thumbOpen" title="Select thumbnail" max-width="max-w-2xl" @close="thumbOpen = false">
      <div class="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <button
          v-for="m in mediaStore.images"
          :key="m.id"
          class="group relative overflow-hidden rounded-xl border-2 transition-all"
          :class="thumb === m.url ? 'border-primary-500 ring-2 ring-primary-500/30' : 'border-transparent hover:border-gray-300'"
          @click="thumb = m.url; thumbOpen = false"
        >
          <img :src="m.url" :alt="m.name" class="aspect-[4/3] w-full object-cover" />
          <span class="absolute inset-x-0 bottom-0 truncate bg-black/60 px-2 py-1 text-[10px] font-bold text-white opacity-0 transition-opacity group-hover:opacity-100">
            {{ m.name }}
          </span>
        </button>
      </div>
    </BaseModal>
  </div>
</template>