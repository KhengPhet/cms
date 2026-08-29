<script setup lang="ts">
import { computed, ref } from 'vue'
import { useElementWidth } from '@/composables/useElementWidth'
import { formatNumber } from '@/services/format'

const props = withDefaults(
  defineProps<{
    labels: string[]
    data: number[]
    height?: number
    color?: string
    valuePrefix?: string
  }>(),
  {
    height: 260,
    color: '#4f46e5',
    valuePrefix: ''
  }
)

const el = ref<HTMLElement | null>(null)
const width = useElementWidth(el)
const H = computed(() => props.height)
const PAD = { top: 16, right: 12, bottom: 26, left: 10 }
const innerW = computed(() => Math.max(80, (width.value || 600) - PAD.left - PAD.right))
const innerH = computed(() => H.value - PAD.top - PAD.bottom)

const maxValue = computed(() => Math.max(...props.data, 1))
const barW = computed(() => {
  const n = props.data.length
  const slot = innerW.value / n
  return Math.max(6, Math.min(28, slot * 0.55))
})

const hovered = ref<number | null>(null)

function caret(i: number) {
  return { index: i, value: props.data[i] }
}
</script>

<template>
  <div ref="el" class="w-full">
    <svg v-if="width > 50" :viewBox="`0 0 ${width} ${H}`" :width="width" :height="H">
      <defs>
        <linearGradient id="bar-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" :stop-color="color" />
          <stop offset="100%" :stop-color="color" stop-opacity="0.55" />
        </linearGradient>
      </defs>

      <g v-for="g in [0.25, 0.5, 0.75, 1]" :key="g">
        <line
          :x1="PAD.left"
          :x2="width - PAD.right"
          :y1="PAD.top + innerH * (1 - g)"
          :y2="PAD.top + innerH * (1 - g)"
          stroke="currentColor"
          stroke-opacity="0.08"
          stroke-dasharray="4 4"
        />
      </g>

      <g v-for="(v, i) in data" :key="i">
        <rect
          :x="PAD.left + (i / data.length) * innerW + (innerW / data.length - barW) / 2"
          :y="PAD.top + innerH - (v / maxValue) * innerH"
          :width="barW"
          :height="(v / maxValue) * innerH"
          rx="6"
          fill="url(#bar-grad)"
          :class="['transition-all duration-200', hovered === i ? 'opacity-100' : 'opacity-80']"
          @mouseenter="hovered = i"
          @mouseleave="hovered = null"
        />
        <text
          :x="PAD.left + (i / data.length) * innerW + innerW / data.length / 2"
          :y="H - 8"
          text-anchor="middle"
          class="fill-gray-400 text-[10px]"
        >
          {{ labels[i] }}
        </text>
      </g>

      <g v-if="hovered !== null" :transform="`translate(${Math.min(Math.max(PAD.left + (hovered / data.length) * innerW, 40), width - 70)}, ${PAD.top + innerH - (data[hovered] / maxValue) * innerH - 34})`">
        <rect x="-8" y="-6" width="76" height="24" rx="7" class="fill-gray-900 dark:fill-gray-700" opacity="0.95" />
        <text x="30" y="10" text-anchor="middle" class="fill-white text-[10px] font-semibold">
          {{ valuePrefix }}{{ formatNumber(caret(hovered).value) }}
        </text>
      </g>
    </svg>
  </div>
</template>