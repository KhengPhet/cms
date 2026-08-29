<script setup lang="ts">
import { ref } from 'vue'
import { Mail, Send } from '@lucide/vue'
import { useI18n } from '@/composables/useI18n'
import { useToast } from '@/composables/useToast'

const { t } = useI18n()
const toast = useToast()
const email = ref('')
const subscribed = ref(false)

function subscribe() {
  if (!/^\S+@\S+\.\S+$/.test(email.value)) {
    toast.error('Please enter a valid email address')
    return
  }
  subscribed.value = true
  toast.success('Subscription confirmed. Thank you!')
}
</script>

<template>
  <section class="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary-700 via-primary-600 to-indigo-600 px-6 py-10 text-white shadow-lift sm:px-10">
    <div class="pointer-events-none absolute -right-16 -top-24 h-72 w-72 rounded-full bg-white/10 blur-2xl" />
    <div class="pointer-events-none absolute -bottom-28 -left-10 h-72 w-72 rounded-full bg-indigo-400/20 blur-2xl" />
    <div class="relative mx-auto flex max-w-4xl flex-col items-center gap-6 text-center md:flex-row md:text-left">
      <div class="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/15 backdrop-blur">
        <Mail class="h-8 w-8" />
      </div>
      <div class="flex-1">
        <h3 class="text-2xl font-extrabold">{{ t('common.newsletterTitle') }}</h3>
        <p class="mt-1 text-sm text-indigo-100">{{ t('common.newsletterDesc') }}</p>
      </div>
      <div v-if="!subscribed" class="flex w-full max-w-md items-center gap-2">
        <input
          v-model="email"
          type="email"
          :placeholder="t('common.emailPlaceholder')"
          class="w-full rounded-xl border border-white/20 bg-white/15 px-4 py-3 text-sm text-white placeholder:text-indigo-200 backdrop-blur focus:border-white/50 focus:outline-none"
        />
        <button
          class="flex shrink-0 items-center gap-1.5 rounded-xl bg-white px-4 py-3 text-sm font-bold text-primary-700 transition-all hover:scale-[1.03] hover:shadow-lg"
          @click="subscribe"
        >
          <Send class="h-4 w-4" /> {{ t('common.subscribe') }}
        </button>
      </div>
      <div v-else class="flex items-center gap-2 rounded-xl bg-white/15 px-5 py-3 font-semibold backdrop-blur">
        <span class="text-2xl">✓</span> You're on the list!
      </div>
    </div>
  </section>
</template>