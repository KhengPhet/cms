<script setup lang="ts">
import { computed } from 'vue'
import {
  FileText,
  Flag,
  Globe2,
  Eye,
  MessageSquare,
  LayoutGrid,
  Clock
} from '@lucide/vue'
import { useArticlesStore } from '@/stores/articles'
import { useCommentsStore } from '@/stores/comments'
import { useAuthStore } from '@/stores/auth'
import StatCard from '@/components/admin/StatCard.vue'
import BaseCard from '@/components/ui/BaseCard.vue'
import BaseTable from '@/components/ui/BaseTable.vue'
import StatusBadge from '@/components/ui/StatusBadge.vue'
import BaseAvatar from '@/components/ui/BaseAvatar.vue'
import { formatNumber, timeAgo } from '@/services/format'

const articlesStore = useArticlesStore()
const commentsStore = useCommentsStore()
const auth = useAuthStore()

const recentArticles = computed(() =>
  [...articlesStore.articles]
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, 5)
)

const guest = computed(() => auth.user?.name?.split(' ')[0] ?? 'Admin')
const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })

const totalArticles = computed(() => articlesStore.articles.length)
const nationalCount = computed(() => articlesStore.national.length)
const internationalCount = computed(() => articlesStore.international.length)
const draftCount = computed(() => articlesStore.drafts.length)
const totalViews = computed(() => articlesStore.articles.reduce((s, a) => s + a.views, 0))
const commentCount = computed(() => commentsStore.comments.length)
const approvedComments = computed(() => commentsStore.approved.length)
const pendingComments = computed(() => commentsStore.pending.length)

const quickActions = [
  { label: 'New article', to: '/admin/articles/new', icon: FileText, tone: 'text-primary-600 bg-primary-100' },
  { label: 'Review comments', to: '/admin/comments', icon: MessageSquare, tone: 'text-amber-600 bg-amber-100' },
  { label: 'Manage categories', to: '/admin/categories', icon: LayoutGrid, tone: 'text-red-600 bg-red-100' },
  { label: 'View published', to: '/admin/articles', icon: Globe2, tone: 'text-emerald-600 bg-emerald-100' }
]

const articleColumns = [
  { key: 'title', label: 'Article' },
  { key: 'category', label: 'Category' },
  { key: 'status', label: 'Status' },
  { key: 'views', label: 'Views', align: 'right' as const },
  { key: 'publishedAt', label: 'Published', align: 'right' as const }
]

const isPending = (c: { status: string }) => c.status === 'pending' || c.status === 'reported'
const pendingCommentsList = computed(() => commentsStore.comments.filter(isPending).slice(0, 4))
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-wrap items-end justify-between gap-3">
      <div>
        <h2 class="text-2xl font-extrabold text-gray-900 dark:text-white">Good {{ +new Date().getHours() < 12 ? 'morning' : +new Date().getHours() < 18 ? 'afternoon' : 'evening' }}, {{ guest }} 👋</h2>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">{{ today }} — here's what's happening on Global CMS.</p>
      </div>
      <router-link
        to="/admin/articles/new"
        class="flex items-center gap-2 rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-bold text-white shadow-lift transition-all hover:bg-primary-700"
      >
        <FileText class="h-4 w-4" /> Create article
      </router-link>
    </div>

    <div class="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
      <StatCard label="Total articles" :value="String(totalArticles)" :icon="FileText" tone="primary" />
      <StatCard label="National" :value="String(nationalCount)" :icon="Flag" tone="red" />
      <StatCard label="International" :value="String(internationalCount)" :icon="Globe2" tone="blue" />
      <StatCard label="Drafts" :value="String(draftCount)" :icon="Clock" tone="purple" />
      <StatCard label="Total views" :value="formatNumber(totalViews)" :icon="Eye" tone="green" />
      <StatCard label="Comments" :value="String(commentCount)" :icon="MessageSquare" tone="amber" />
    </div>

    <div class="grid gap-6 lg:grid-cols-3">
      <BaseCard>
        <h3 class="text-base font-extrabold text-gray-900 dark:text-white">Content mix</h3>
        <p class="text-xs text-gray-400">Articles by scope (from live data)</p>
        <div class="mt-5 flex items-center justify-center">
          <div class="relative flex h-44 w-44 items-center justify-center">
            <svg viewBox="0 0 120 120" class="h-full w-full -rotate-90">
              <circle cx="60" cy="60" r="50" fill="none" stroke-width="16" class="stroke-gray-100 dark:stroke-gray-700" stroke-dasharray="314.16" stroke-dashoffset="0" />
              <circle cx="60" cy="60" r="50" fill="none" stroke="#4f46e5" stroke-width="16" stroke-dasharray="188.5 125.66" stroke-dashoffset="0" />
              <circle cx="60" cy="60" r="50" fill="none" stroke="#38bdf8" stroke-width="16" stroke-dasharray="125.66 188.5" stroke-dashoffset="-188.5" />
            </svg>
            <div class="absolute text-center">
              <p class="text-2xl font-extrabold text-gray-900 dark:text-white">{{ totalArticles }}</p>
              <p class="text-[10px] font-bold uppercase tracking-wide text-gray-400">Articles</p>
            </div>
          </div>
        </div>
        <div class="mt-4 grid grid-cols-2 gap-3">
          <div class="rounded-xl bg-primary-50 p-3 dark:bg-primary-900/30">
            <p class="text-xs font-semibold text-primary-600 dark:text-primary-400">National</p>
            <p class="text-lg font-extrabold text-primary-700 dark:text-primary-300">{{ nationalCount }}</p>
          </div>
          <div class="rounded-xl bg-sky-50 p-3 dark:bg-sky-900/30">
            <p class="text-xs font-semibold text-sky-600 dark:text-sky-400">International</p>
            <p class="text-lg font-extrabold text-sky-700 dark:text-sky-300">{{ internationalCount }}</p>
          </div>
        </div>
      </BaseCard>

      <BaseCard>
        <h3 class="text-base font-extrabold text-gray-900 dark:text-white">Draft article status</h3>
        <p class="text-xs text-gray-400">Current publication state</p>
        <ul class="mt-4 space-y-3">
          <li class="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3 dark:bg-gray-800">
            <span class="text-sm font-semibold text-gray-600 dark:text-gray-300">Published</span>
            <span class="text-lg font-extrabold text-emerald-600 dark:text-emerald-400">{{ articlesStore.published.length }}</span>
          </li>
          <li class="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3 dark:bg-gray-800">
            <span class="text-sm font-semibold text-gray-600 dark:text-gray-300">Drafts</span>
            <span class="text-lg font-extrabold text-amber-600 dark:text-amber-400">{{ draftCount }}</span>
          </li>
          <li class="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3 dark:bg-gray-800">
            <span class="text-sm font-semibold text-gray-600 dark:text-gray-300">Comments</span>
            <span class="text-lg font-extrabold text-primary-600 dark:text-primary-400">{{ approvedComments }}</span>
          </li>
        </ul>
      </BaseCard>

      <BaseCard>
        <h3 class="text-base font-extrabold text-gray-900 dark:text-white">Content overview</h3>
        <p class="text-xs text-gray-400">Live totals from the API</p>
        <ul class="mt-4 space-y-3">
          <li class="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3 dark:bg-gray-800">
            <span class="text-sm font-semibold text-gray-600 dark:text-gray-300">Total articles</span>
            <span class="text-lg font-extrabold text-gray-900 dark:text-white">{{ totalArticles }}</span>
          </li>
          <li class="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3 dark:bg-gray-800">
            <span class="text-sm font-semibold text-gray-600 dark:text-gray-300">Total views</span>
            <span class="text-lg font-extrabold text-gray-900 dark:text-white">{{ formatNumber(totalViews) }}</span>
          </li>
          <li class="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3 dark:bg-gray-800">
            <span class="text-sm font-semibold text-gray-600 dark:text-gray-300">Pending comments</span>
            <span class="text-lg font-extrabold text-amber-600 dark:text-amber-400">{{ pendingCommentsList.length }}</span>
          </li>
        </ul>
      </BaseCard>
    </div>

    <div class="grid gap-6 lg:grid-cols-3">
      <BaseCard class="lg:col-span-2">
        <div class="mb-4 flex items-center justify-between">
          <h3 class="text-base font-extrabold text-gray-900 dark:text-white">Recent articles</h3>
          <router-link to="/admin/articles" class="text-xs font-bold text-primary-600 hover:underline dark:text-primary-400">View all</router-link>
        </div>
        <BaseTable :columns="articleColumns" :items="recentArticles">
          <template #cell-title="{ row }">
            <div class="flex items-center gap-3">
              <img :src="(row as any).thumbnail" class="h-10 w-14 rounded-lg object-cover" alt="" />
              <div class="min-w-0">
                <p class="truncate text-sm font-bold text-gray-900 dark:text-white">{{ (row as any).title }}</p>
                <p class="text-xs text-gray-400">{{ (row as any).author.name }}</p>
              </div>
            </div>
          </template>
          <template #cell-status="{ row }">
            <StatusBadge :status="(row as any).status" kind="article" />
          </template>
          <template #cell-views="{ row }">
            <span class="font-bold text-gray-900 dark:text-white">{{ formatNumber((row as any).views) }}</span>
          </template>
          <template #cell-publishedAt="{ row }">
            <span class="text-xs text-gray-400">{{ timeAgo((row as any).publishedAt) }}</span>
          </template>
        </BaseTable>
      </BaseCard>

      <div class="space-y-6">
        <BaseCard>
          <div class="mb-4 flex items-center justify-between">
            <h3 class="text-sm font-extrabold text-gray-900 dark:text-white">Pending moderation</h3>
            <router-link to="/admin/comments" class="text-xs font-bold text-primary-600 hover:underline dark:text-primary-400">View all</router-link>
          </div>
          <div class="space-y-3">
            <div v-for="c in pendingCommentsList" :key="c.id" class="flex items-start gap-3">
              <BaseAvatar :src="c.avatar" :name="c.author" size="sm" />
              <div class="min-w-0 flex-1">
                <p class="truncate text-xs font-bold text-gray-900 dark:text-white">{{ c.author }}</p>
                <p class="line-clamp-1 text-xs text-gray-400">{{ c.content }}</p>
              </div>
              <span :class="c.status === 'reported' ? 'bg-red-50 text-red-600 dark:bg-red-900/30' : 'bg-amber-50 text-amber-600 dark:bg-amber-900/30'" class="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase">
                {{ c.status }}
              </span>
            </div>
            <p v-if="!pendingCommentsList.length" class="py-4 text-center text-xs text-gray-400">All caught up 🎉</p>
          </div>
        </BaseCard>

        <BaseCard>
          <h3 class="mb-4 text-sm font-extrabold text-gray-900 dark:text-white">Quick actions</h3>
          <div class="grid grid-cols-2 gap-3">
            <router-link
              v-for="q in quickActions"
              :key="q.label"
              :to="q.to"
              class="group flex flex-col items-center gap-2 rounded-xl border border-gray-100 p-4 text-center transition-all hover:-translate-y-0.5 hover:border-primary-200 hover:shadow-card dark:border-gray-700 dark:hover:border-primary-700"
            >
              <span :class="['flex h-10 w-10 items-center justify-center rounded-xl', q.tone]">
                <component :is="q.icon" class="h-5 w-5" />
              </span>
              <span class="text-xs font-bold text-gray-700 dark:text-gray-300">{{ q.label }}</span>
            </router-link>
          </div>
        </BaseCard>
      </div>
    </div>
  </div>
</template>