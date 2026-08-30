<script setup lang="ts">
import { reactive } from 'vue'
import { MapPin, Phone, Mail, Send, Clock } from '@lucide/vue'
import { useToast } from '@/composables/useToast'
import BaseInput from '@/components/ui/BaseInput.vue'
import { gradientImage } from '@/services/placeholder'

const mapImage = gradientImage(5, 'P CMS HQ')

const toast = useToast()
const form = reactive({ name: '', email: '', subject: '', message: '' })

function submit() {
  if (!form.name || !form.email || !form.message) {
    toast.error('Please fill in all required fields')
    return
  }
  toast.success('Message sent! Our team will reply within 24 hours.')
  form.name = ''
  form.email = ''
  form.subject = ''
  form.message = ''
}
</script>

<template>
  <div class="page-container py-10">
    <div class="mx-auto max-w-2xl text-center">
      <h1 class="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white lg:text-4xl">Contact us</h1>
      <p class="mt-3 text-gray-500 dark:text-gray-400">
        Questions about a story, advertising or technical issues? Get in touch — we read every message.
      </p>
    </div>

    <div class="mt-10 grid gap-6 lg:grid-cols-5">
      <div class="space-y-4 lg:col-span-2">
        <div class="card-surface flex gap-4 p-5">
          <span class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-100 text-primary-600 dark:bg-primary-900/40 dark:text-primary-400">
            <MapPin class="h-5 w-5" />
          </span>
          <div>
            <h3 class="text-sm font-extrabold text-gray-900 dark:text-white">Headquarters</h3>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">No. 118, Norodom Blvd, Phnom Penh, Cambodia</p>
          </div>
        </div>
        <div class="card-surface flex gap-4 p-5">
          <span class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-100 text-primary-600 dark:bg-primary-900/40 dark:text-primary-400">
            <Phone class="h-5 w-5" />
          </span>
          <div>
            <h3 class="text-sm font-extrabold text-gray-900 dark:text-white">Phone</h3>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">+855 23 000 000 · +855 12 000 000</p>
          </div>
        </div>
        <div class="card-surface flex gap-4 p-5">
          <span class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-100 text-primary-600 dark:bg-primary-900/40 dark:text-primary-400">
            <Mail class="h-5 w-5" />
          </span>
          <div>
            <h3 class="text-sm font-extrabold text-gray-900 dark:text-white">Email</h3>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">contact@globalcms.com · newsroom@globalcms.com</p>
          </div>
        </div>
        <div class="card-surface flex gap-4 p-5">
          <span class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-100 text-primary-600 dark:bg-primary-900/40 dark:text-primary-400">
            <Clock class="h-5 w-5" />
          </span>
          <div>
            <h3 class="text-sm font-extrabold text-gray-900 dark:text-white">Newsroom hours</h3>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Mon–Fri 8:00–18:00 · Live desk 24/7</p>
          </div>
        </div>
        <div class="relative hidden h-64 overflow-hidden rounded-2xl border border-gray-100 lg:block dark:border-gray-700">
          <img :src="mapImage" alt="Map" class="h-full w-full object-cover" />
          <div class="absolute inset-0 flex items-center justify-center bg-primary-600/10 backdrop-blur-[1px]">
            <span class="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-card">
              <MapPin class="h-6 w-6 text-primary-600" />
            </span>
          </div>
        </div>
      </div>

      <div class="card-surface p-6 lg:col-span-3">
        <h2 class="text-xl font-extrabold text-gray-900 dark:text-white">Send a message</h2>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">We usually respond within one business day.</p>
        <form class="mt-6 grid gap-4 sm:grid-cols-2" @submit.prevent="submit">
          <BaseInput v-model="form.name" label="Full name" required placeholder="Your name" />
          <BaseInput v-model="form.email" label="Email address" type="email" required placeholder="you@example.com" />
          <div class="sm:col-span-2">
            <BaseInput v-model="form.subject" label="Subject" placeholder="What is this about?" />
          </div>
          <div class="sm:col-span-2">
            <BaseInput v-model="form.message" label="Message" textarea :rows="5" required placeholder="Write your message…" />
          </div>
          <div class="sm:col-span-2">
            <button
              class="flex items-center gap-2 rounded-xl bg-primary-600 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-primary-700"
              type="submit"
            >
              <Send class="h-4 w-4" /> Send message
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>