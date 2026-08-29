<script setup lang="ts">
import PublicNavbar from '@/components/public/PublicNavbar.vue'
import PublicFooter from '@/components/public/PublicFooter.vue'
import ToastContainer from '@/components/ui/ToastContainer.vue'
</script>

<template>
  <div class="min-h-screen bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-100">
    <PublicNavbar />
    <main class="min-h-[60vh]">
      <router-view />
    </main>
    <PublicFooter />
    <ToastContainer />
  </div>
</template>