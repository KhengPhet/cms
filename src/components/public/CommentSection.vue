<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { MessageSquare, ThumbsUp, Send } from '@lucide/vue'
import { useCommentsStore } from '@/stores/comments'
import { useI18n } from '@/composables/useI18n'
import { useToast } from '@/composables/useToast'
import { timeAgo } from '@/services/format'
import { useAuthStore } from '@/stores/auth'
import { getAuthorImageUrl, imageErrorHandler, PLACEHOLDER_IMAGE } from '@/utils/getImageUrl'

const props = defineProps<{
  articleId: string
  articleTitle: string
}>()

const commentsStore = useCommentsStore()
const auth = useAuthStore()
const { t } = useI18n()
const toast = useToast()

const list = computed(() =>
  commentsStore.comments
    .filter((c) => c.articleId === props.articleId && c.status === 'visible')
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
)

const content = ref('')
const submitting = ref(false)

onMounted(() => {
  commentsStore.fetchByPost(props.articleId)
})

async function addComment() {
  if (!content.value.trim()) {
    toast.error('Please write a comment first')
    return
  }
  if (!auth.isAuthenticated) {
    toast.error('Please sign in to comment')
    return
  }
  submitting.value = true
  try {
    await commentsStore.addComment({
      comment: content.value.trim(),
      articleId: props.articleId
    })
    content.value = ''
    toast.success('Comment posted')
  } catch {
    toast.error('Could not post comment. Please try again.')
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <section>
    <h3 class="flex items-center gap-2 text-lg font-extrabold text-gray-900 dark:text-white">
      <MessageSquare class="h-5 w-5 text-primary-600 dark:text-primary-400" />
      {{ t('common.comments') }} ({{ list.length }})
    </h3>

    <form
      v-if="auth.isAuthenticated"
      class="card-surface mt-4 p-4"
      @submit.prevent="addComment"
    >
      <textarea
        v-model="content"
        rows="3"
        :placeholder="t('common.commentPlaceholder')"
        class="w-full resize-y rounded-lg border border-gray-200 px-3 py-2.5 text-sm bg-white focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
      />
      <div class="mt-3 flex justify-end">
        <button
          type="submit"
          :disabled="submitting"
          class="flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-primary-700 disabled:opacity-60"
        >
          <Send class="h-4 w-4" /> {{ submitting ? 'Posting…' : t('common.postComment') }}
        </button>
      </div>
    </form>
    <p v-else class="card-surface mt-4 p-4 text-center text-sm text-gray-400 shadow-soft dark:border-gray-700 dark:bg-gray-800">
      <router-link to="/login" class="font-semibold text-primary-600 hover:underline">Sign in</router-link> to join the discussion.
    </p>

    <div class="mt-6 space-y-4">
      <p v-if="!list.length" class="py-6 text-center text-sm text-gray-400">Be the first to comment.</p>
      <article v-for="c in list" :key="c.id" class="card-surface flex gap-3 p-4">
        <img :src="getAuthorImageUrl(c.avatar) || PLACEHOLDER_IMAGE" :alt="c.author" class="h-10 w-10 shrink-0 rounded-full" @error="imageErrorHandler" />
        <div class="min-w-0 flex-1">
          <div class="flex flex-wrap items-center justify-between gap-1">
            <div class="flex items-center gap-2">
              <span class="text-sm font-bold text-gray-900 dark:text-white">{{ c.author }}</span>
              <span class="text-[11px] text-gray-400">{{ timeAgo(c.date) }}</span>
            </div>
            <button
              class="flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold text-gray-400 transition-colors hover:bg-primary-50 hover:text-primary-600 dark:hover:bg-primary-900/30"
            >
              <ThumbsUp class="h-3.5 w-3.5" /> {{ c.likes }}
            </button>
          </div>
          <p class="mt-1.5 text-sm leading-relaxed text-gray-600 dark:text-gray-300">{{ c.content }}</p>
        </div>
      </article>
    </div>
  </section>
</template>
