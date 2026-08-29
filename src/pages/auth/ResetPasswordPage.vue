<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import AlertMessage from '@/components/auth/AlertMessage.vue'
import PasswordInput from '@/components/auth/PasswordInput.vue'
import Button from '@/components/auth/Button.vue'

const route = useRoute()

const token = typeof route.query.token === 'string' ? route.query.token : 'demo-reset-token'

const form = reactive({ password: '', confirm: '' })
const errors = reactive<{ password: string; confirm: string }>({ password: '', confirm: '' })
const formError = ref('')
const loading = ref(false)
const done = ref(false)

const canSubmit = computed(() => loading.value || !form.password || !form.confirm)

async function submit() {
  errors.password = form.password.length >= 6 ? '' : 'Password must be at least 6 characters.'
  errors.confirm = form.confirm === form.password && form.confirm ? '' : 'Passwords do not match.'
  if (errors.password || errors.confirm) return

  loading.value = true
  formError.value = 'Password reset is not available on the connected backend. Please contact the site administrator.'
  loading.value = false
}
</script>

<template>
  <div class="space-y-5">
    <div v-if="!done" class="space-y-5">
      <p class="text-sm text-gray-500 dark:text-gray-400">
        Enter a new password below. Keep it strong and don't reuse an old one.
      </p>

      <AlertMessage
        v-if="formError"
        type="error"
        message="Reset failed"
        :dismissible="true"
        @dismiss="formError = ''"
      />

      <form class="space-y-4" novalidate @submit.prevent="submit">
        <PasswordInput
          v-model="form.password"
          label="New Password"
          placeholder="Minimum 6 characters"
          :error="errors.password"
          required
        />
        <PasswordInput
          v-model="form.confirm"
          label="Confirm Password"
          placeholder="Re-enter your new password"
          :error="errors.confirm"
          required
        />
        <Button type="submit" block size="lg" :loading="loading" :disabled="canSubmit">
          {{ loading ? 'Resetting…' : 'Reset Password' }}
        </Button>
      </form>
    </div>

    <div v-else class="animate-fade-in rounded-xl border border-emerald-200 bg-emerald-50 p-6 text-center dark:border-emerald-900/40 dark:bg-emerald-900/20">
      <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-2xl dark:bg-emerald-900/40">
        ✓
      </div>
      <h3 class="mt-3 text-lg font-extrabold text-gray-900 dark:text-white">Password updated</h3>
      <p class="mt-2 text-sm text-gray-600 dark:text-gray-300">
        Your password has been reset successfully. You can now sign in with your new password.
      </p>
      <Button class="mt-4" block @click="router.push('/login')">Go to Sign in</Button>
    </div>
  </div>
</template>
