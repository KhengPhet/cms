import { defineStore } from 'pinia'
import { settingApi, type SettingsMap } from '@/services/settingApi'

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    loaded: false,
    map: {} as SettingsMap,
    appName: 'P CMS'
  }),
  actions: {
    async fetch(force = false) {
      if (this.loaded && !force) return
      try {
        const map = await settingApi.getAll()
        this.map = map
        this.apply(map)
        this.loaded = true
      } catch {
        // Keep defaults if the backend is unreachable.
      }
    },
    apply(map: SettingsMap) {
      const name = map['site.name']
      if (name) this.appName = name
    },
    async update(settings: SettingsMap) {
      const updated = await settingApi.update(settings)
      this.map = { ...this.map, ...updated }
      this.apply(updated)
      return updated
    }
  }
})
