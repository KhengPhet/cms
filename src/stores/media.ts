import { defineStore } from 'pinia'
import { media as demoMedia } from '@/services/data'
import type { MediaItem } from '@/types'

export const useMediaStore = defineStore('media', {
  state: () => ({
    items: [...demoMedia] as MediaItem[]
  }),
  getters: {
    images: (s) => s.items.filter((m) => m.type === 'image'),
    byId: (s) => (id: string) => s.items.find((m) => m.id === id) ?? null
  },
  actions: {
    addItem(item: MediaItem) {
      this.items.unshift(item)
    },
    deleteItem(id: string) {
      this.items = this.items.filter((m) => m.id !== id)
    }
  }
})