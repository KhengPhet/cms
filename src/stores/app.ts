import { defineStore } from 'pinia'
import type { LanguageCode } from '@/types'

export const useAppStore = defineStore('app', {
  state: () => ({
    darkMode: false,
    language: 'en' as LanguageCode,
    sidebarCollapsed: false,
    mobileSidebarOpen: false
  }),
  getters: {
    appliedClass: (state) => (state.darkMode ? 'dark' : 'light')
  },
  actions: {
    toggleDark() {
      this.darkMode = !this.darkMode
      this.applyTheme()
    },
    setLanguage(lang: LanguageCode) {
      this.language = lang
      document.documentElement.lang = lang
    },
    toggleSidebar() {
      this.sidebarCollapsed = !this.sidebarCollapsed
    },
    openMobileSidebar() {
      this.mobileSidebarOpen = true
    },
    closeMobileSidebar() {
      this.mobileSidebarOpen = false
    },
    applyTheme() {
      const root = document.documentElement
      if (this.darkMode) root.classList.add('dark')
      else root.classList.remove('dark')
    },
    init() {
      const saved = localStorage.getItem('cms-theme')
      if (saved === 'dark') this.darkMode = true
      this.applyTheme()
      document.documentElement.lang = this.language
    }
  }
})