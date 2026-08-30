<script setup lang="ts">
import { onMounted } from 'vue'
import { useAppStore } from '@/stores/app'
import { useArticlesStore } from '@/stores/articles'
import { useAuthStore } from '@/stores/auth'

const app = useAppStore()
const articles = useArticlesStore()
const auth = useAuthStore()

app.init()

onMounted(() => {
  // Restore the authenticated user from PostgreSQL (GET /api/user/profile).
  // Clears gcms_token / gcms_user if the token is invalid or expired.
  void auth.loadUser()
  articles.fetchAll()
})
</script>

<template>
  <router-view />
</template>