<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { Users, UserCheck, PenTool, ShieldCheck, Trash2 } from '@lucide/vue'
import { userApi, type User } from '@/services/userApi'
import { useToast } from '@/composables/useToast'
import { getUserThumbnailUrl } from '@/utils/getImageUrl'
import { handleUnauthorized } from '@/services/api'
import { useRouter } from 'vue-router'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseSelect from '@/components/ui/BaseSelect.vue'
import BaseTable from '@/components/ui/BaseTable.vue'
import BaseAvatar from '@/components/ui/BaseAvatar.vue'
import StatusBadge from '@/components/ui/StatusBadge.vue'
import ConfirmationModal from '@/components/ui/ConfirmationModal.vue'
import { formatDate } from '@/services/format'

const toast = useToast()
const router = useRouter()

const users = ref<User[]>([])
const search = ref('')
const roleFilter = ref('all')
const loading = ref(true)
const error = ref('')
const toDelete = ref<User | null>(null)

const roleOptions = [
  { label: 'All roles', value: 'all' },
  { label: 'User', value: 'user' },
  { label: 'Author', value: 'author' },
  { label: 'Admin', value: 'admin' }
]

const columns = [
  { key: 'user', label: 'User' },
  { key: 'role', label: 'Role' },
  { key: 'status', label: 'Status' },
  { key: 'created', label: 'Created' },
  { key: 'actions', label: '', align: 'right' as const }
]

// Statistics (computed from the loaded users).
const totalUsers = computed(() => users.value.length)
const activeUsers = computed(() => users.value.length)
const totalAuthors = computed(
  () => users.value.filter((u) => u.role.toLowerCase() === 'author').length
)
const totalAdmins = computed(
  () => users.value.filter((u) => u.role.toLowerCase() === 'admin').length
)

// Search by name, username or email (client-side, on the already-loaded users).
const filteredUsers = computed(() => {
  const keyword = search.value.toLowerCase().trim()
  return users.value.filter((user) => {
    if (keyword && !(
      user.name.toLowerCase().includes(keyword) ||
      user.username.toLowerCase().includes(keyword) ||
      user.email.toLowerCase().includes(keyword)
    )) {
      return false
    }
    if (roleFilter.value !== 'all' && user.role.toLowerCase() !== roleFilter.value) {
      return false
    }
    return true
  })
})

function avatarFor(user: User): string {
  return user.thumbnail ? getUserThumbnailUrl(user.thumbnail) : ''
}

function roleColor(role: string): string {
  const r = role.toLowerCase()
  if (r === 'admin') return 'bg-red-50 text-red-700 dark:bg-red-900/40 dark:text-red-300'
  if (r === 'author') return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
  return 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
}

async function loadUsers() {
  loading.value = true
  error.value = ''
  try {
    users.value = await userApi.getAll()
  } catch (err) {
    console.error('Failed to load users.', err)
    const status = (err as { status?: number }).status
    if (status === 401) {
      handleUnauthorized(401)
      router.push('/login')
    }
    error.value = 'Failed to load users.'
  } finally {
    loading.value = false
  }
}

async function confirmDelete() {
  if (!toDelete.value) return
  const target = toDelete.value
  toDelete.value = null
  try {
    await userApi.delete(target.id)
    users.value = users.value.filter((u) => u.id !== target.id)
    toast.success(`${target.name} deleted`)
  } catch (err) {
    console.error('Failed to delete user.', err)
    toast.error('Failed to delete user')
  }
}

function requestDelete(user: User) {
  toDelete.value = user
}

onMounted(async () => {
  await loadUsers()
})
</script>

<template>
  <div class="space-y-5">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h2 class="text-xl font-extrabold text-gray-900 dark:text-white">User Management</h2>
        <p class="text-sm text-gray-500 dark:text-gray-400">Manage accounts stored in PostgreSQL.</p>
      </div>
    </div>

    <!-- Statistics -->
    <div class="grid grid-cols-2 gap-3 md:grid-cols-4">
      <div class="card-surface p-4">
        <div class="flex items-center gap-3">
          <div class="flex items-center justify-center w-10 h-10 text-purple-600 rounded-xl bg-purple-50 dark:bg-purple-900/30 dark:text-purple-300">
            <Users class="w-5 h-5" />
          </div>
          <div>
            <p class="text-2xl font-extrabold text-gray-900 dark:text-white">{{ totalUsers }}</p>
            <p class="text-xs text-gray-400">Total Users</p>
          </div>
        </div>
      </div>
      <div class="card-surface p-4">
        <div class="flex items-center gap-3">
          <div class="flex items-center justify-center w-10 h-10 text-green-600 rounded-xl bg-green-50 dark:bg-green-900/30 dark:text-green-300">
            <UserCheck class="w-5 h-5" />
          </div>
          <div>
            <p class="text-2xl font-extrabold text-gray-900 dark:text-white">{{ activeUsers }}</p>
            <p class="text-xs text-gray-400">Active Users</p>
          </div>
        </div>
      </div>
      <div class="card-surface p-4">
        <div class="flex items-center gap-3">
          <div class="flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-300">
            <PenTool class="w-5 h-5" />
          </div>
          <div>
            <p class="text-2xl font-extrabold text-gray-900 dark:text-white">{{ totalAuthors }}</p>
            <p class="text-xs text-gray-400">Authors</p>
          </div>
        </div>
      </div>
      <div class="card-surface p-4">
        <div class="flex items-center gap-3">
          <div class="flex items-center justify-center w-10 h-10 text-red-600 rounded-xl bg-red-50 dark:bg-red-900/30 dark:text-red-300">
            <ShieldCheck class="w-5 h-5" />
          </div>
          <div>
            <p class="text-2xl font-extrabold text-gray-900 dark:text-white">{{ totalAdmins }}</p>
            <p class="text-xs text-gray-400">Admins</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Search + filter -->
    <div class="card-surface grid gap-3 p-4 md:grid-cols-3">
      <BaseInput v-model="search" icon="search" placeholder="Search name, username or email…" />
      <BaseSelect v-model="roleFilter" :options="roleOptions"/>
    </div>

    <!-- Error state -->
    <div v-if="error" class="p-5 text-sm font-semibold text-center text-red-600 border border-red-200 rounded-2xl bg-red-50 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-300">
      {{ error }}
      <button class="ml-2 underline" @click="loadUsers">Retry</button>
    </div>

    <!-- Table -->
    <BaseTable
      :columns="columns"
      :items="filteredUsers"
      :loading="loading"
      empty-text="No users found."
    >
      <template #cell-user="{ row }">
        <div class="flex items-center gap-3">
          <BaseAvatar :src="avatarFor(row as User)" :name="(row as User).name" size="md" />
          <div>
            <p class="text-sm font-bold text-gray-900 dark:text-white">{{ (row as User).name }}</p>
            <p class="text-xs text-gray-400">@{{ (row as User).username }} · {{ (row as User).email }}</p>
          </div>
        </div>
      </template>
      <template #cell-role="{ row }">
        <span :class="['rounded-full px-2.5 py-1 text-[11px] font-bold capitalize', roleColor((row as User).role)]">
          {{ (row as User).role }}
        </span>
      </template>
      <template #cell-status>
        <StatusBadge status="active" kind="user" />
      </template>
      <template #cell-created="{ row }">
        <span class="text-xs text-gray-400 whitespace-nowrap">{{ formatDate((row as User).created_at) }}</span>
      </template>
      <template #cell-actions="{ row }">
        <div class="flex items-center justify-end gap-1">
          <button
            class="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/30"
            title="Delete"
            @click="requestDelete(row as User)"
          >
            <Trash2 class="w-4 h-4" />
          </button>
        </div>
      </template>
      <template #empty>
        <p v-if="loading" class="text-sm text-gray-400">Loading users…</p>
        <p v-else class="text-sm text-gray-400">
          {{
            filteredUsers.length === 0 && (search || roleFilter !== 'all')
              ? 'No users match your search.'
              : 'No users found.'
          }}
        </p>
      </template>
    </BaseTable>

    <ConfirmationModal
      :open="!!toDelete"
      title="Delete user?"
      :message="`Delete ${toDelete?.name ?? ''}? This permanently removes the account from PostgreSQL.`"
      confirm-label="Delete"
      @confirm="confirmDelete"
      @cancel="toDelete = null"
    />
  </div>
</template>
