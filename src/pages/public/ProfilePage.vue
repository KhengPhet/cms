<script setup lang="ts">
import { computed, reactive } from 'vue'
import { Bookmark, MessageSquare, MapPin, Pencil, LogOut, Settings, ChevronRight } from '@lucide/vue'
import { useAuthStore } from '@/stores/auth'
import { useArticlesStore } from '@/stores/articles'
import { useCommentsStore } from '@/stores/comments'
import { useToast } from '@/composables/useToast'
import { useRouter } from 'vue-router'
import { timeAgo, formatDate } from '@/services/format'
import ArticleCard from '@/components/public/ArticleCard.vue'
import { useI18n } from '@/composables/useI18n'

const auth = useAuthStore()
const articlesStore = useArticlesStore()
const commentsStore = useCommentsStore()
const toast = useToast()
const router = useRouter()
const { t } = useI18n()

const form = reactive({
  name: auth.user?.name ?? '',
  email: auth.user?.email ?? '',
  bio: auth.user?.bio ?? ''
})

const savedIds = ['art-1', 'art-2', 'art-19', 'art-33']
const savedArticles = computed(() => savedIds.map((id) => articlesStore.byId(id)).filter(Boolean))

const myComments = computed(() => commentsStore.comments.filter((c) => c.author === (auth.user?.name ?? '')))

function saveProfile() {
  if (auth.user) {
    auth.user.name = form.name
    auth.user.bio = form.bio
  }
  toast.success('Profile updated successfully')
}

function logout() {
  auth.logout()
  toast.success('Signed out')
  router.push('/login')
}
</script>

<template>
  <div class="mx-auto max-w-7xl px-4 py-8">
    <div class="grid gap-6 lg:grid-cols-3">
      <aside class="lg:col-span-1">
        <div class="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-soft dark:border-gray-700 dark:bg-gray-800">
          <div class="h-24 bg-gradient-to-r from-primary-600 via-indigo-600 to-purple-600" />
          <div class="-mt-10 px-5 pb-5 text-center">
            <img :src="auth.user?.avatar" :alt="form.name" class="mx-auto h-20 w-20 rounded-full ring-4 ring-white dark:ring-gray-800" />
            <h2 class="mt-3 text-xl font-extrabold text-gray-900 dark:text-white">{{ form.name }}</h2>
            <p class="mt-0.5 text-sm text-gray-500 dark:text-gray-400">@{{ auth.user?.username }}</p>
            <p class="mt-2 text-xs text-gray-400">{{ auth.user?.role }}</p>
            <div class="mt-4 flex items-center justify-center gap-5 border-t border-gray-100 pt-4 text-center dark:border-gray-700">
              <div>
                <p class="text-lg font-extrabold text-gray-900 dark:text-white">{{ savedArticles.length }}</p>
                <p class="text-[11px] font-semibold uppercase tracking-wide text-gray-400">Saved</p>
              </div>
              <div>
                <p class="text-lg font-extrabold text-gray-900 dark:text-white">{{ myComments.length }}</p>
                <p class="text-[11px] font-semibold uppercase tracking-wide text-gray-400">Comments</p>
              </div>
              <div>
                <p class="text-lg font-extrabold text-gray-900 dark:text-white">{{ articlesStore.published.length }}</p>
                <p class="text-[11px] font-semibold uppercase tracking-wide text-gray-400">Articles</p>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-5 rounded-2xl border border-gray-100 bg-white p-5 shadow-soft dark:border-gray-700 dark:bg-gray-800">
          <div class="mb-4 flex items-center justify-between">
            <h3 class="text-sm font-extrabold uppercase tracking-wide text-gray-900 dark:text-white">Edit profile</h3>
            <Pencil class="h-4 w-4 text-gray-300" />
          </div>
          <form class="space-y-3" @submit.prevent="saveProfile">
            <label class="block">
              <span class="mb-1 block text-xs font-bold text-gray-500 dark:text-gray-400">Full name</span>
              <input v-model="form.name" class="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white" />
            </label>
            <label class="block">
              <span class="mb-1 block text-xs font-bold text-gray-500 dark:text-gray-400">Bio</span>
              <textarea v-model="form.bio" rows="3" class="w-full resize-none rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white" />
            </label>
            <button class="w-full rounded-lg bg-primary-600 py-2.5 text-sm font-bold text-white transition-colors hover:bg-primary-700">
              Save changes
            </button>
          </form>
          <button class="mt-3 flex w-full items-center justify-center gap-2 rounded-lg py-2 text-sm font-bold text-red-500 transition-colors hover:bg-red-50 dark:hover:bg-red-900/20" @click="logout">
            <LogOut class="h-4 w-4" /> Sign out
          </button>
        </div>
      </aside>

      <div class="space-y-8 lg:col-span-2">
        <section>
          <div class="mb-4 flex items-center justify-between">
            <h3 class="flex items-center gap-2 text-lg font-extrabold text-gray-900 dark:text-white">
              <Bookmark class="h-5 w-5 text-amber-500" /> {{ t('common.popular') }} — Saved articles
            </h3>
          </div>
          <div v-if="savedArticles.length" class="grid gap-5 sm:grid-cols-2">
            <ArticleCard v-for="a in savedArticles" :key="a!.id" :article="a!" />
          </div>
          <div v-else class="rounded-2xl border border-dashed border-gray-200 py-16 text-center dark:border-gray-700">
            <Bookmark class="mx-auto h-10 w-10 text-gray-300" />
            <p class="mt-3 text-sm font-semibold text-gray-500 dark:text-gray-400">No saved articles yet.</p>
          </div>
        </section>

        <section>
          <div class="mb-4 flex items-center justify-between">
            <h3 class="flex items-center gap-2 text-lg font-extrabold text-gray-900 dark:text-white">
              <MessageSquare class="h-5 w-5 text-primary-600 dark:text-primary-400" /> Comments history
            </h3>
            <span class="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-bold text-gray-500 dark:bg-gray-700 dark:text-gray-300">
              {{ myComments.length }}
            </span>
          </div>
          <div v-if="myComments.length" class="space-y-4">
            <article v-for="c in myComments" :key="c.id" class="rounded-2xl border border-gray-100 bg-white p-4 shadow-soft dark:border-gray-700 dark:bg-gray-800">
              <div class="flex items-center justify-between">
                <router-link :to="`/article/${c.articleId}`" class="text-sm font-bold text-primary-600 hover:underline dark:text-primary-400">
                  {{ c.articleTitle }}
                </router-link>
                <span class="text-[11px] text-gray-400">{{ timeAgo(c.date) }}</span>
              </div>
              <p class="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-300">{{ c.content }}</p>
              <p class="mt-2 text-[11px] font-semibold" :class="c.status === 'visible' ? 'text-emerald-500' : 'text-amber-500'">
                {{ c.status === 'visible' ? '· Approved' : '· Awaiting moderation' }}
              </p>
            </article>
          </div>
          <div v-else class="rounded-2xl border border-dashed border-gray-200 py-16 text-center dark:border-gray-700">
            <MessageSquare class="mx-auto h-10 w-10 text-gray-300" />
            <p class="mt-3 text-sm font-semibold text-gray-500 dark:text-gray-400">No comments yet.</p>
          </div>
        </section>

        <section>
          <div class="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-soft dark:border-gray-700 dark:bg-gray-800">
            <div class="flex items-center justify-between border-b border-gray-100 px-5 py-3.5 dark:border-gray-700">
              <h3 class="flex items-center gap-2 text-sm font-extrabold text-gray-900 dark:text-white">
                <MapPin class="h-4 w-4 text-primary-600" /> Membership
              </h3>
            </div>
            <div class="divide-y divide-gray-50 dark:divide-gray-700/60">
              <button class="flex w-full items-center justify-between px-5 py-3.5 text-left transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/30">
                <span class="text-sm font-medium text-gray-600 dark:text-gray-300">Member since</span>
                <span class="text-sm font-bold text-gray-900 dark:text-white">{{ formatDate('2023-01-15') }}</span>
              </button>
              <router-link to="/admin" class="flex items-center justify-between px-5 py-3.5 transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/30">
                <span class="text-sm font-medium text-gray-600 dark:text-gray-300">Open admin dashboard</span>
                <ChevronRight class="h-4 w-4 text-gray-300" />
              </router-link>
              <router-link to="/admin/settings" class="flex items-center justify-between px-5 py-3.5 transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/30">
                <span class="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-300">
                  <Settings class="h-4 w-4 text-gray-300" /> Website settings
                </span>
                <ChevronRight class="h-4 w-4 text-gray-300" />
              </router-link>
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>