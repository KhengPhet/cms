<script setup lang="ts">
import { reactive, ref } from 'vue'
import { ArrowLeft } from '@lucide/vue'
import AlertMessage from '@/components/auth/AlertMessage.vue'
import InputField from '@/components/auth/InputField.vue'
import Button from '@/components/auth/Button.vue'

const form = reactive({ email: '' })
const emailError = ref('')
const formError = ref('')
const sent = ref(false)
const loading = ref(false)
const resetEmail = ref('')

async function submit() {
  emailError.value = ''
  formError.value = ''
  if (!/^\S+@\S+\.\S+$/.test(form.email)) {
    emailError.value = 'Please enter a valid email address.'
    return
  }
  formError.value = 'Password reset is not available on the connected backend. Please contact the site administrator.'
}
</script>

<template>
  <div class="space-y-5">
    <div v-if="!sent" class="space-y-5">
      <p class="text-sm text-gray-500 dark:text-gray-400">
        Enter the email address associated with your account and we'll send you a secure link to reset your password.
      </p>

      <AlertMessage
        v-if="formError"
        type="error"
        message="Unable to send reset link"
        :dismissible="true"
        @dismiss="formError = ''"
      />

      <form class="space-y-4" novalidate @submit.prevent="submit">
        <InputField
          v-model="form.email"
          label="Email"
          type="email"
          placeholder="you@example.com"
          :error="emailError"
          required
        />
        <Button type="submit" block size="lg" :loading="loading">
          {{ loading ? 'Sending…' : 'Send Reset Link' }}
        </Button>
      </form>
    </div>

    <div v-else class="animate-fade-in rounded-xl border border-emerald-200 bg-emerald-50 p-6 text-center dark:border-emerald-900/40 dark:bg-emerald-900/20">
      <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-2xl dark:bg-emerald-900/40">
        ✓
      </div>
      <h3 class="mt-3 text-lg font-extrabold text-gray-900 dark:text-white">Check your inbox</h3>
      <p class="mt-2 text-sm text-gray-600 dark:text-gray-300">
        We've sent a password reset link to
        <strong class="font-semibold text-emerald-600 dark:text-emerald-400">{{ resetEmail }}</strong>.
        The link expires in 30 minutes.
      </p>
      <button
        type="button"
        class="mt-3 text-xs font-semibold text-primary-600 hover:underline dark:text-primary-400"
        @click="sent = false"
      >
        Didn't get it? Try again
      </button>
    </div>

    <router-link
      to="/login"
      class="flex items-center justify-center gap-1.5 text-sm font-semibold text-gray-500 transition-colors hover:text-primary-600 dark:text-gray-400"
    >
      <ArrowLeft class="h-4 w-4" /> Back to sign in
    </router-link>
  </div>
</template>
