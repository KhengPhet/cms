<script setup lang="ts">
import { computed, ref } from 'vue'
import { useElementWidth } from '@/composables/useElementWidth'
import { formatNumber } from '@/services/format'

interface ChartSeries {
  name: string
  color: string
  data: number[]
}

const props = withDefaults(
  defineProps<{
    labels: string[]
    series: ChartSeries[]
    height?: number
    valuePrefix?: string
  }>(),
  {
    height: 280,
    valuePrefix: ''
  }
)

const el = ref<HTMLElement | null>(null)
const width = useElementWidth(el)
const H = computed(() => props.height)
const PAD = { top: 18, right: 16, bottom: 28, left: 44 }
const innerW = computed(() => Math.max(80, (width.value || 600) - PAD.left - PAD.right))
const innerH = computed(() => H.value - PAD.top - PAD.bottom)

const allValues = computed(() => props.series.flatMap((s) => s.data))
const maxValue = computed(() => {
  const m = Math.max(...allValues.value, 1)
  const mag = Math.pow(10, Math.floor(Math.log10(m)))
  return Math.ceil(m / mag) * mag
})

const gridLines = computed(() => {
  const lines: { y: number; value: number }[] = []
  for (let i = 0; i <= 4; i++) {
    const value = (maxValue.value / 4) * i
    const y = PAD.top + innerH.value - (value / maxValue.value) * innerH.value
    lines.push({ y, value })
  }
  return lines
})

function pointsFor(data: number[]): [number, number][] {
  const n = data.length
  return data.map((v, i) => {
    const x = n === 1 ? PAD.left + innerW.value / 2 : PAD.left + (i / (n - 1)) * innerW.value
    const y = PAD.top + innerH.value - (v / maxValue.value) * innerH.value
    return [x, y]
  })
}

function linePath(data: number[]): string {
  const pts = pointsFor(data)
  return pts.map(([x, y], i) => `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`).join(' ')
}

function areaPath(data: number[]): string {
  const pts = pointsFor(data)
  const baseY = PAD.top + innerH.value
  const line = pts.map(([x, y], i) => `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`).join(' ')
  const last = pts[pts.length - 1]
  const first = pts[0]
  return `${line} L ${last[0].toFixed(1)} ${baseY} L ${first[0].toFixed(1)} ${baseY} Z`
}

const hovered = ref<{ index: number; x: number; y: number } | null>(null)

function onMouseMove(e: MouseEvent) {
  const rect = (e.currentTarget as SVGSVGElement).getBoundingClientRect()
  const mx = e.clientX - rect.left - PAD.left
  const idx = Math.round((mx / innerW.value) * (props.labels.length - 1))
  const clamped = Math.max(0, Math.min(props.labels.length - 1, idx))
  const [x, y] = pointsFor(props.series[0].data)[clamped]
  hovered.value = { index: clamped, x, y }
}
</script>

<template>
  <div ref="el" class="w-full">
    <svg
      v-if="width > 50"
      :viewBox="`0 0 ${width} ${H}`"
      :width="width"
      :height="H"
      @mousemove="onMouseMove"
      @mouseleave="hovered = null"
    >
      <defs>
        <linearGradient v-for="(s, i) in series" :id="`grad-${i}`" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" :stop-color="s.color" stop-opacity="0.28" />
          <stop offset="100%" :stop-color="s.color" stop-opacity="0.01" />
        </linearGradient>
      </defs>

      <g v-for="g in gridLines" :key="g.y">
        <line :x1="PAD.left" :x2="width - PAD.right" :y1="g.y" :y2="g.y" stroke="currentColor" stroke-opacity="0.08" stroke-dasharray="4 4" />
        <text :x="PAD.left - 8" :y="g.y + 4" text-anchor="end" class="fill-gray-400 text-[10px]">
          {{ valuePrefix }}{{ formatNumber(g.value) }}
        </text>
      </g>

      <g v-for="(s, si) in series" :key="s.name">
        <path :d="areaPath(s.data)" :fill="`url(#grad-${si})`" />
        <path :d="linePath(s.data)" fill="none" :stroke="s.color" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round" />
        <g v-for="([x, y], i) in pointsFor(s.data)" :key="i">
          <circle :cx="x" :cy="y" r="6" :fill="s.color" fill-opacity="0.15" />
          <circle :cx="x" :cy="y" r="3" :fill="s.color" />
        </g>
      </g>

      <text
        v-for="(l, i) in labels"
        :key="l"
        :x="pointsFor(series[0].data)[i][0]"
        :y="H - 8"
        text-anchor="middle"
        class="fill-gray-400 text-[10px]"
      >
        {{ l }}
      </text>

      <g v-if="hovered" :transform="`translate(${Math.min(Math.max(hovered.x, 60), width - 70)}, ${Math.max(hovered.y - 52, 4)})`">
        <rect x="-6" y="-8" width="66" height="48" rx="8" class="fill-gray-900 dark:fill-gray-700" opacity="0.95" />
        <text x="26" y="6" text-anchor="middle" class="fill-gray-300 text-[10px] font-semibold">{{ labels[hovered.index] }}</text>
        <template v-for="(s, si) in series" :key="si">
          <rect x="1" y="12 + si * 16" width="6" height="6" rx="1.5" :fill="s.color" />
          <text x="10" :y="18 + si * 16" class="fill-white text-[9px] font-semibold">
            {{ valuePrefix }}{{ formatNumber(s.data[hovered.index]) }}
          </text>
        </template>
      </g>
    </svg>
  </div>
</template>