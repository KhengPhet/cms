<script setup lang="ts">
import { computed, ref } from 'vue'
import { Plus, Pencil, Trash2, MoreHorizontal, Shield, Ban, CheckCircle2, Download } from '@lucide/vue'
import { users } from '@/services/data'
import { useNotificationsStore } from '@/stores/notifications'
import { useToast } from '@/composables/useToast'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseSelect from '@/components/ui/BaseSelect.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseTable from '@/components/ui/BaseTable.vue'
import StatusBadge from '@/components/ui/StatusBadge.vue'
import ConfirmationModal from '@/components/ui/ConfirmationModal.vue'
import BaseModal from '@/components/ui/BaseModal.vue'
import BaseAvatar from '@/components/ui/BaseAvatar.vue'
import BaseDropdown from '@/components/ui/BaseDropdown.vue'
import { formatDate } from '@/services/format'
import type { User, UserRole, UserStatus } from '@/types'

const notifStore = useNotificationsStore()
const toast = useToast()

const items = ref<User[]>([...users])
const query = ref('')
const roleFilter = ref('')
const statusFilter = ref('')
const page = ref(1)
const PER_PAGE = 6

const roleColors: Record<UserRole, string> = {
  'Super Admin': 'bg-purple-50 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
  Admin: 'bg-red-50 text-red-700 dark:bg-red-900/40 dark:text-red-300',
  Editor: 'bg-sky-50 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300',
  Author: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  User: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
}

const filtered = computed(() => {
  const q = query.value.trim().toLowerCase()
  return items.value.filter((u) => {
    if (q && !(u.name + u.username + u.email).toLowerCase().includes(q)) return false
    if (roleFilter.value && u.role !== roleFilter.value) return false
    if (statusFilter.value && u.status !== statusFilter.value) return false
    return true
  })
})

const paged = computed(() => {
  const start = (page.value - 1) * PER_PAGE
  return filtered.value.slice(start, start + PER_PAGE)
})

const roleOptions = [
  { label: 'All roles', value: '' },
  { label: 'Super Admin', value: 'Super Admin' },
  { label: 'Admin', value: 'Admin' },
  { label: 'Editor', value: 'Editor' },
  { label: 'Author', value: 'Author' },
  { label: 'User', value: 'User' }
]
const statusOptions = [
  { label: 'All statuses', value: '' },
  { label: 'Active', value: 'active' },
  { label: 'Pending', value: 'pending' },
  { label: 'Suspended', value: 'suspended' }
]

const columns = [
  { key: 'user', label: 'User' },
  { key: 'role', label: 'Role' },
  { key: 'status', label: 'Status' },
  { key: 'createdAt', label: 'Created', align: 'right' as const },
  { key: 'actions', label: '', align: 'right' as const }
]

const modalOpen = ref(false)
const editingId = ref<string | null>(null)
const toDelete = ref<string | null>(null)

const form = ref({ name: '', username: '', email: '', role: 'Author' as UserRole, status: 'active' as UserStatus })

function openNew() {
  editingId.value = null
  form.value = { name: '', username: '', email: '', role: 'Author', status: 'active' }
  modalOpen.value = true
}

function openEdit(u: User) {
  editingId.value = u.id
  form.value = { name: u.name, username: u.username, email: u.email, role: u.role, status: u.status }
  modalOpen.value = true
}

function save() {
  if (!form.value.name.trim() || !form.value.email.trim()) {
    toast.error('Name and email are required')
    return
  }
  if (editingId.value) {
    const u = items.value.find((x) => x.id === editingId.value)
    if (u) Object.assign(u, form.value)
    toast.success('User updated')
  } else {
    items.value.unshift({
      id: 'u' + Date.now(),
      name: form.value.name,
      username: form.value.username || form.value.name.toLowerCase().replace(/\s+/g, ''),
      email: form.value.email,
      avatar: '',
      role: form.value.role,
      status: form.value.status,
      createdAt: new Date().toISOString().slice(0, 10),
      savedArticles: [],
      comments: []
    })
    toast.success('User created')
  }
  notifStore.addActivity({
    id: 'l' + Date.now(),
    user: 'Sokha Mony',
    avatar: users[0].avatar,
    action: editingId.value ? 'Edited user' : 'Created user',
    entity: form.value.name,
    ip: '203.0.113.10',
    date: new Date().toISOString()
  })
  modalOpen.value = false
}

function commitDelete() {
  if (toDelete.value) {
    items.value = items.value.filter((u) => u.id !== toDelete.value)
    toast.success('User deleted')
    toDelete.value = null
  }
}

function toggleSuspend(u: User) {
  u.status = u.status === 'suspended' ? 'active' : 'suspended'
  toast.success(`${u.name} ${u.status === 'suspended' ? 'suspended' : 'reactivated'}`)
}

function setRole(u: User, role: UserRole) {
  u.role = role
  toast.success(`${u.name} is now ${role}`)
}
</script>

<template>
  <div class="space-y-5">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div class="flex items-center gap-3">
        <p class="text-sm text-gray-500 dark:text-gray-400">{{ items.length }} users · {{ items.filter((u) => u.status === 'active').length }} active</p>
        <span class="flex items-center gap-1 rounded-full bg-purple-50 px-2.5 py-1 text-xs font-bold text-purple-600 dark:bg-purple-900/30 dark:text-purple-300">
          <Shield class="h-3.5 w-3.5" /> Role-based access
        </span>
      </div>
      <div class="flex items-center gap-2">
        <BaseButton variant="outline" size="sm"><Download class="h-4 w-4" /> Export</BaseButton>
        <BaseButton @click="openNew"><Plus class="h-4 w-4" /> Add user</BaseButton>
      </div>
    </div>

    <div class="grid gap-3 rounded-2xl border border-gray-100 bg-white p-4 md:grid-cols-3 dark:border-gray-700 dark:bg-gray-800">
      <BaseInput v-model="query" icon="search" placeholder="Search name, username or email…" />
      <BaseSelect v-model="roleFilter" :options="roleOptions" placeholder="All roles" />
      <BaseSelect v-model="statusFilter" :options="statusOptions" placeholder="All statuses" />
    </div>

    <BaseTable :columns="columns" :items="paged">
      <template #cell-user="{ row }">
        <div class="flex items-center gap-3">
          <BaseAvatar :src="(row as any).avatar" :name="(row as any).name" size="md" />
          <div>
            <p class="text-sm font-bold text-gray-900 dark:text-white">{{ (row as any).name }}</p>
            <p class="text-xs text-gray-400">@{{ (row as any).username }} · {{ (row as any).email }}</p>
          </div>
        </div>
      </template>
      <template #cell-role="{ row }">
        <span :class="['rounded-full px-2.5 py-1 text-[11px] font-bold', roleColors[(row as any).role as UserRole]]">
          {{ (row as any).role }}
        </span>
      </template>
      <template #cell-status="{ row }">
        <StatusBadge :status="(row as any).status" kind="user" />
      </template>
      <template #cell-createdAt="{ row }">
        <span class="whitespace-nowrap text-xs text-gray-400">{{ formatDate((row as any).createdAt) }}</span>
      </template>
      <template #cell-actions="{ row }">
        <div class="flex items-center justify-end gap-1">
          <button class="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-primary-50 hover:text-primary-600 dark:hover:bg-primary-900/40" title="Edit" @click="openEdit(row as any)">
            <Pencil class="h-4 w-4" />
          </button>
          <button
            class="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-amber-50 hover:text-amber-600 dark:hover:bg-amber-900/30"
            :title="(row as any).status === 'suspended' ? 'Activate' : 'Suspend'"
            @click="toggleSuspend(row as any)"
          >
            <Ban v-if="(row as any).status !== 'suspended'" class="h-4 w-4" />
            <CheckCircle2 v-else class="h-4 w-4" />
          </button>
          <button class="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/30" title="Delete" @click="toDelete = (row as any).id">
            <Trash2 class="h-4 w-4" />
          </button>
          <BaseDropdown align="right" width="w-44">
            <template #trigger>
              <span class="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700">
                <MoreHorizontal class="h-4 w-4" />
              </span>
            </template>
            <p class="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-gray-400">Set role</p>
            <button
              v-for="r in (['Super Admin', 'Admin', 'Editor', 'Author', 'User'] as UserRole[])"
              :key="r"
              class="flex w-full items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-700"
              :class="(row as any).role === r ? 'text-primary-600 dark:text-primary-400' : ''"
              @click="setRole(row as any, r)"
            >
              <Shield class="h-3.5 w-3.5" /> {{ r }}
            </button>
          </BaseDropdown>
        </div>
      </template>
    </BaseTable>

    <div class="flex justify-center">
      <BasePagination v-model:current="page" :total="filtered.length" :per-page="PER_PAGE" />
    </div>

    <div class="rounded-2xl border border-gray-100 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
      <h3 class="mb-3 text-sm font-extrabold text-gray-900 dark:text-white">Permission matrix</h3>
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs">
          <thead>
            <tr class="border-b border-gray-100 dark:border-gray-700">
              <th class="px-3 py-2 font-bold text-gray-500">Role</th>
              <th v-for="p in ['Articles', 'Media', 'Users', 'Comments', 'Settings']" :key="p" class="px-3 py-2 text-center font-bold text-gray-500">{{ p }}</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50 dark:divide-gray-700/50">
            <tr v-for="r in ['Super Admin', 'Admin', 'Editor', 'Author', 'User']" :key="r">
              <td class="px-3 py-2.5 font-bold text-gray-800 dark:text-gray-200">{{ r }}</td>
              <td v-for="p in 5" :key="p" class="px-3 py-2.5 text-center">
                <span
                  :class="r === 'User' && p === 5 ? 'text-red-400' : r === 'User' && p > 1 ? 'text-gray-300' : r === 'Author' && p > 2 ? 'text-amber-400' : 'text-emerald-500'"
                  class="font-bold"
                >
                  {{ r === 'User' || (r === 'Author' && p > 2) ? '·' : '✓' }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <BaseModal :open="modalOpen" :title="editingId ? 'Edit user' : 'Add user'" @close="modalOpen = false">
      <div class="space-y-4">
        <BaseInput v-model="form.name" label="Full name" required placeholder="Jane Doe" />
        <div class="grid grid-cols-2 gap-3">
          <BaseInput v-model="form.username" label="Username" placeholder="janedoe" />
          <BaseInput v-model="form.email" label="Email" type="email" required placeholder="jane@example.com" />
        </div>
        <div class="grid grid-cols-2 gap-3">
          <BaseSelect v-model="form.role" :options="roleOptions.filter((o) => o.value).map((o) => ({ label: o.value, value: o.value }))" label="Role" />
          <BaseSelect v-model="form.status" :options="statusOptions.filter((o) => o.value).map((o) => ({ label: o.value, value: o.value }))" label="Status" />
        </div>
      </div>
      <template #footer>
        <div class="flex justify-end gap-2">
          <BaseButton variant="outline" size="sm" @click="modalOpen = false">Cancel</BaseButton>
          <BaseButton size="sm" @click="save">{{ editingId ? 'Save changes' : 'Create user' }}</BaseButton>
        </div>
      </template>
    </BaseModal>

    <ConfirmationModal
      :open="!!toDelete"
      title="Delete user?"
      message="This permanently removes the user account and revokes their access immediately."
      confirm-label="Delete"
      @confirm="commitDelete"
      @cancel="toDelete = null"
    />
  </div>
</template>