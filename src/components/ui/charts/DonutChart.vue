<script setup lang="ts">
import { computed } from 'vue'
import { formatNumber } from '@/services/format'

interface Segment {
  label: string
  value: number
  color: string
}

const props = withDefaults(
  defineProps<{
    segments: Segment[]
    size?: number
    thickness?: number
  }>(),
  {
    size: 200,
    thickness: 22
  }
)

const total = computed(() => props.segments.reduce((s, x) => s + x.value, 0))
const R = computed(() => (props.size - props.thickness) / 2)
const C = computed(() => 2 * Math.PI * R.value)
const center = props.size / 2

const arcs = computed<
  { label: string; value: number; color: string; frac: number; dash: number; offset: number }[]
>(() => {
  let acc = 0
  return props.segments.map((seg) => {
    const frac = seg.value / total.value
    const arc = {
      ...seg,
      frac,
      dash: frac * C.value,
      offset: acc * C.value
    }
    acc += frac
    return arc
  })
})
</script>

<template>
  <div class="flex items-center gap-6">
    <svg :width="size" :height="size" :viewBox="`0 0 ${size} ${size}`" class="-rotate-90">
      <circle :cx="center" :cy="center" :r="R" fill="none" stroke-width="4" class="stroke-gray-100 dark:stroke-gray-700" />
      <circle
        v-for="arc in arcs"
        :key="arc.label"
        :cx="center"
        :cy="center"
        :r="R"
        fill="none"
        :stroke="arc.color"
        :stroke-width="thickness"
        stroke-linecap="butt"
        :stroke-dasharray="`${arc.dash} ${C - arc.dash}`"
        :stroke-dashoffset="arc.offset"
      />
      <g class="rotate-90" :transform="`translate(${center}, ${center})`">
        <text text-anchor="middle" :dy="-6" class="fill-gray-400 text-[11px] font-semibold uppercase tracking-wider">Total</text>
        <text text-anchor="middle" :dy="14" class="fill-gray-900 dark:fill-white text-xl font-extrabold">{{ formatNumber(total) }}</text>
      </g>
    </svg>
    <div class="flex flex-col gap-3">
      <div v-for="seg in segments" :key="seg.label" class="flex items-center gap-2.5">
        <span class="h-3 w-3 rounded-full" :style="{ backgroundColor: seg.color }" />
        <span class="text-sm font-medium text-gray-600 dark:text-gray-300">{{ seg.label }}</span>
        <span class="ml-auto text-sm font-bold text-gray-900 dark:text-white">{{ formatNumber(seg.value) }}</span>
        <span class="w-10 text-right text-xs text-gray-400">{{ Math.round((seg.value / total) * 100) }}%</span>
      </div>
    </div>
  </div>
</template>