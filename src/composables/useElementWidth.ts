import { onBeforeUnmount, onMounted, ref, type Ref } from 'vue'

export function useElementWidth(el: Ref<HTMLElement | null>) {
  const width = ref(0)
  let ro: ResizeObserver | null = null
  let fallback: number | null = null

  const measure = () => {
    if (el.value) width.value = el.value.clientWidth || el.value.getBoundingClientRect().width || 0
  }

  onMounted(() => {
    measure()
    if (typeof ResizeObserver !== 'undefined' && el.value) {
      ro = new ResizeObserver(() => measure())
      ro.observe(el.value)
    } else {
      fallback = window.setInterval(measure, 300)
    }
  })

  onBeforeUnmount(() => {
    ro?.disconnect()
    if (fallback !== null) window.clearInterval(fallback)
  })

  return width
}