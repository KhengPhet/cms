<script setup lang="ts">
import { onMounted } from 'vue'
import { useAppStore } from '@/stores/app'
import { useArticlesStore } from '@/stores/articles'

const app = useAppStore()
const articles = useArticlesStore()

app.init()

onMounted(() => {
  articles.fetchAll()
})
</script>

<template>
  <router-view />
</template>
