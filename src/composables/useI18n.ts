import { computed } from 'vue'
import { useAppStore } from '@/stores/app'
import { translate } from '@/services/i18n'

export function useI18n() {
  const app = useAppStore()
  const t = (key: string) => translate(app.language, key)
  const lang = computed(() => app.language)
  return { t, lang }
}