<script setup lang="ts">
import AlertMessage from '@/components/auth/AlertMessage.vue'
import AvatarUpload from '@/components/auth/AvatarUpload.vue'
import InputField from '@/components/auth/InputField.vue'
import PasswordInput from '@/components/auth/PasswordInput.vue' 
import { AuthError } from '@/services/authApi'
import { useAuthStore } from '@/stores/auth'
import type { UserRole } from '@/types'
import { computed, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

const auth = useAuthStore()
const router = useRouter()

const form = reactive({
  fullName: '',
  username: '',
  email: '',
  password: '',
  confirm: '',
  role: 'User' as UserRole,
  avatar: ''
})
const terms = ref(false)
const formError = ref('')

const errors = reactive<Record<string, string>>({
  fullName: '',
  username: '',
  email: '',
  password: '',
  confirm: ''
})

const roleOptions: { label: string; value: UserRole }[] = [
  { label: 'User', value: 'User' },
  { label: 'Author', value: 'Author' }
]

const passwordChecks = computed(() => {
  const v = form.password
  return {
    length: v.length >= 6,
    letters: /[a-zA-Z]/.test(v),
    numbers: /\d/.test(v)
  }
})

const strength = computed(() => {
  const { length, letters, numbers } = passwordChecks.value
  const count = [length, letters, numbers].filter(Boolean).length
  return { level: count, label: ['Too weak', 'Weak', 'Fair', 'Good'][count] }
})

const canSubmit = computed(() =>
  auth.loading || !form.fullName || !form.username || !form.email || !form.password || !form.confirm || !terms.value
)

function validate(): boolean {
  formError.value = ''
  errors.fullName = form.fullName.trim().length < 2 ? 'Please enter your full name.' : ''

  const u = form.username.trim()
  if (u.length < 6) errors.username = 'Username must be at least 6 characters.'
  else if (!/[a-zA-Z]/.test(u) || !/\d/.test(u)) errors.username = 'Username must contain letters and numbers.'
  else if (!/^[a-zA-Z0-9_]+$/.test(u)) errors.username = 'Only letters, numbers and underscores allowed.'
  else errors.username = ''

  errors.email = /^\S+@\S+\.\S+$/.test(form.email) ? '' : 'Please enter a valid email address.'
  errors.password = form.password.length >= 6 && passwordChecks.value.letters && passwordChecks.value.numbers ? '' : 'Password must be at least 6 characters and contain letters and numbers.'
  errors.confirm = form.confirm === form.password && form.confirm ? '' : 'Passwords do not match.'

  if (!terms.value) formError.value = 'Please accept the Terms and Privacy Policy.'
  return Object.values(errors).every((e) => !e) && terms.value
}

async function submit() {
  if (!validate()) return
  try {
    const thumbnail = await dataUrlToFile(form.avatar)
    await auth.register({
      name: form.fullName,
      email: form.email,
      password: form.password,
      thumbnail: thumbnail ?? undefined
    })
    router.push('/admin/dashboard')
  } catch (e) {
    if (e instanceof AuthError) {
      if (e.code === 'EMAIL_TAKEN') errors.email = e.message
      else formError.value = e.message
    } else {
      formError.value = 'Registration failed. Please try again.'
    }
  }
}

function dataUrlToFile(dataUrl: string): Promise<File | null> {
  if (!dataUrl || !dataUrl.startsWith('data:')) return Promise.resolve(null)
  return fetch(dataUrl)
    .then((r) => r.blob())
    .then((blob) => new File([blob], 'avatar.png', { type: blob.type }))
    .catch(() => null)
}
</script>

<template>
  <div class="space-y-5">
    <AlertMessage
      v-if="formError"
      type="error"
      message="Registration error"
      :dismissible="true"
      @dismiss="formError = ''"
    />

    <AvatarUpload v-model="form.avatar" label="Profile picture" />

    <form class="space-y-4" novalidate @submit.prevent="submit">
      <InputField
        v-model="form.fullName"
        label="Full Name"
        placeholder="John Smith"
        :error="errors.fullName"
        required
      />

      <InputField
        v-model="form.username"
        label="Username"
        placeholder="johnsmith2026"
        :error="errors.username"
        :hint="'Min. 6 characters, must contain letters and numbers'"
        required
      />

      <InputField
        v-model="form.email"
        label="Email"
        type="email"
        placeholder="you@example.com"
        :error="errors.email"
        required
      />

      <PasswordInput
        v-model="form.password"
        label="Password"
        placeholder="Minimum 6 characters"
        :error="errors.password"
        required
      >
        <div v-if="form.password" class="mt-2">
          <div class="flex gap-1">
            <span
              v-for="i in 3"
              :key="i"
              class="h-1 flex-1 rounded-full transition-colors"
              :class="i <= strength.level ? (strength.level >= 3 ? 'bg-emerald-500' : strength.level === 2 ? 'bg-amber-500' : 'bg-red-500') : 'bg-gray-200 dark:bg-gray-700'"
            />
          </div>
          <p class="mt-1 text-xs font-medium text-gray-400">Password strength: {{ strength.label }}</p>
        </div>
      </PasswordInput>

      <PasswordInput
        v-model="form.confirm"
        label="Confirm Password"
        placeholder="Re-enter your password"
        :error="errors.confirm"
        required
      />

      <div>
        <label class="mb-1.5 block text-sm font-semibold text-gray-700 dark:text-gray-300">
          Role
        </label>
        <div class="grid grid-cols-2 gap-2">
          <button
            v-for="r in roleOptions"
            :key="r.value"
            type="button"
            class="rounded-xl border px-4 py-2.5 text-sm font-semibold transition-all"
            :class="
              form.role === r.value
                ? 'border-primary-500 bg-primary-50 text-primary-700 dark:bg-primary-900/40 dark:text-primary-200'
                : 'border-gray-200 text-gray-500 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800'
            "
            @click="form.role = r.value"
          >
            {{ r.label }}
          </button>
        </div>
      </div>

      <label class="flex cursor-pointer items-start gap-2.5 text-sm text-gray-600 dark:text-gray-300">
        <input
          v-model="terms"
          type="checkbox"
          class="mt-0.5 h-4 w-4 rounded border-gray-300 accent-primary-600"
        />
        <span>
          I agree with the
          <a href="#" class="font-semibold text-primary-600 hover:underline dark:text-primary-400">Terms</a>
          and
          <a href="#" class="font-semibold text-primary-600 hover:underline dark:text-primary-400">Privacy Policy</a>
        </span>
      </label>

      <Button type="submit" block size="lg" :loading="auth.loading" :disabled="canSubmit">
        {{ auth.loading ? 'Creating account…' : 'Create Account' }}
      </Button>
    </form>

    <p class="pt-1 text-center text-sm text-gray-500 dark:text-gray-400">
      Already have an account?
      <router-link
        to="/login"
        class="font-semibold text-primary-600 transition-colors hover:text-primary-700 dark:text-primary-400"
      >
        Sign in
      </router-link>
    </p>
  </div>
</template>
