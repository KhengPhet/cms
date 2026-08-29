import { onBeforeUnmount, onMounted, type Ref } from 'vue'

export function useClickOutside(el: Ref<HTMLElement | null>, onOutside: () => void) {
  const handler = (e: MouseEvent) => {
    if (el.value && !el.value.contains(e.target as Node)) onOutside()
  }
  onMounted(() => document.addEventListener('mousedown', handler))
  onBeforeUnmount(() => document.removeEventListener('mousedown', handler))
}