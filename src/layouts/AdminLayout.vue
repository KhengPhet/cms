<script setup lang="ts">
import AdminSidebar from '@/components/admin/AdminSidebar.vue'
import AdminTopbar from '@/components/admin/AdminTopbar.vue'
import ToastContainer from '@/components/ui/ToastContainer.vue'
import { useAppStore } from '@/stores/app'

const app = useAppStore()
</script>

<template>
  <div class="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-950 dark:text-gray-100">
    <AdminSidebar />
    <div
      :class="[
        'flex min-h-screen flex-col transition-all duration-300',
        app.sidebarCollapsed ? 'lg:pl-[72px]' : 'lg:pl-[260px]'
      ]"
    >
      <AdminTopbar />
      <main class="flex-1 p-4 lg:p-6">
        <router-view v-slot="{ Component }">
          <transition name="page" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </main>
      <footer class="px-6 py-4 text-center text-xs text-gray-400">
        © {{ new Date().getFullYear() }} Global CMS Platform — Admin Panel
      </footer>
    </div>
    <ToastContainer />
  </div>
</template>

<style scoped>
.page-enter-active,
.page-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.page-enter-from {
  opacity: 0;
  transform: translateY(8px);
}
.page-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>