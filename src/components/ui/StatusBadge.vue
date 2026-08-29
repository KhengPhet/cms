<script setup lang="ts">
import { computed } from 'vue'
import BaseBadge from './BaseBadge.vue'

const props = defineProps<{
  status: string
  kind?: 'article' | 'user' | 'comment' | 'generic'
}>()

type Tone = 'gray' | 'primary' | 'red' | 'green' | 'amber' | 'blue' | 'purple' | 'pink'

const map: Record<string, { label: string; tone: Tone }> = {
  published: { label: 'Published', tone: 'green' },
  draft: { label: 'Draft', tone: 'amber' },
  review: { label: 'In review', tone: 'blue' },
  archived: { label: 'Archived', tone: 'gray' },
  active: { label: 'Active', tone: 'green' },
  suspended: { label: 'Suspended', tone: 'red' },
  pending: { label: 'Pending', tone: 'amber' },
  hidden: { label: 'Hidden', tone: 'gray' },
  visible: { label: 'Published', tone: 'green' },
  reported: { label: 'Reported', tone: 'red' }
}

const current = computed(() => map[props.status] ?? { label: props.status, tone: 'gray' as Tone })
</script>

<template>
  <BaseBadge :tone="current.tone" dot :size="kind === 'article' ? 'md' : 'sm'">
    {{ current.label }}
  </BaseBadge>
</template>