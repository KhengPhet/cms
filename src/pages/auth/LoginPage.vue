<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { AuthError } from '@/services/authApi'
import AlertMessage from '@/components/auth/AlertMessage.vue'
import InputField from '@/components/auth/InputField.vue'
import PasswordInput from '@/components/auth/PasswordInput.vue'
import Button from '@/components/auth/Button.vue'
import SocialIcon from '@/components/public/SocialIcon.vue'
import { dashboardPathForRole } from '@/utils/roles'

const auth = useAuthStore()
const router = useRouter()
const route = useRoute()

const form = reactive({ email: '', password: '' })
const remember = ref(true)
const formError = ref('')

const errors = reactive<{ email: string; password: string }>({ email: '', password: '' })

const socials: { id: 'google' | 'facebook' | 'telegram'; label: string }[] = [
  { id: 'google', label: 'Google' },
  { id: 'facebook', label: 'Facebook' },
  { id: 'telegram', label: 'Telegram' }
]

function validate(): boolean {
  formError.value = ''
  errors.email = /^\S+@\S+\.\S+$/.test(form.email.trim()) ? '' : 'Please enter a valid email address.'
  errors.password = !form.password ? 'Please enter your password.' : ''
  return !errors.email && !errors.password
}

async function submit() {
  if (!validate()) return
  try {
    await auth.login(form.email, form.password)
    const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : null
    if (redirect) {
      router.push(redirect)
    } else {
      router.push(dashboardPathForRole(auth.user?.role))
    }
  } catch (e) {
    if (e instanceof AuthError) formError.value = e.message
    else formError.value = 'Unable to sign in. Please try again.'
  }
}

function socialLogin(_id: string) {
  // Social login is not wired to a backend provider locally. We must NOT
  // fabricate a fake user/token here — authentication can only come from the
  // Express API backed by PostgreSQL. Show a clear message instead.
  formError.value = 'Social login is not available. Please sign in with your email and password.'
}

const canSubmit = computed(() => !form.email || !form.password)</script>

<template>
  <div class="space-y-5">
    <AlertMessage
      v-if="formError"
      type="error"
      message="Login failed."
      :dismissible="true"
      @dismiss="formError = ''"
    />

    <form class="space-y-4" novalidate @submit.prevent="submit">
      <InputField
        v-model="form.email"
        label="Email"
        type="email"
        placeholder="you@example.com"
        :error="errors.email"
        required
        autocomplete="email"
      />

      <PasswordInput
        v-model="form.password"
        label="Password"
        placeholder="Enter your password"
        :error="errors.password"
        required
      />

      <div class="flex items-center justify-between">
        <label class="flex cursor-pointer items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
          <input
            v-model="remember"
            type="checkbox"
            class="h-4 w-4 rounded border-gray-300 accent-primary-600"
          />
          Remember me
        </label>
        <router-link
          to="/forgot-password"
          class="text-sm font-semibold text-primary-600 transition-colors hover:text-primary-700 dark:text-primary-400"
        >
          Forgot password?
        </router-link>
      </div>

      <Button
        type="submit"
        block
        size="lg"
        :loading="auth.loading"
        :disabled="canSubmit"
      >
        {{ auth.loading ? 'Signing in…' : 'Sign in' }}
      </Button>
    </form>

    <div class="flex items-center gap-3">
      <span class="h-px flex-1 bg-gray-200 dark:bg-gray-700" />
      <span class="text-xs font-medium uppercase tracking-wider text-gray-400">or</span>
      <span class="h-px flex-1 bg-gray-200 dark:bg-gray-700" />
    </div>

    <div class="grid grid-cols-3 gap-2.5">
      <button
        v-for="s in socials"
        :key="s.id"
        type="button"
        class="flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white py-2.5 text-sm font-semibold text-gray-600 transition-all hover:bg-gray-50 hover:shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
        @click="socialLogin(s.id)"
      >
        <SocialIcon :name="s.id" class="h-4 w-4" />
        <span class="hidden sm:inline">{{ s.label }}</span>
      </button>
    </div>

    <p class="pt-1 text-center text-sm text-gray-500 dark:text-gray-400">
      Don't have an account?
      <router-link
        to="/register"
        class="font-semibold text-primary-600 transition-colors hover:text-primary-700 dark:text-primary-400"
      >
        Register
      </router-link>
    </p>
  </div>
</template>
