import { api } from '@/services/api'

export interface SettingsMap {
  [key: string]: string
}

export interface SettingsResponse {
  success: boolean
  data: SettingsMap
  message?: string
}

export const settingApi = {
  async getAll(): Promise<SettingsMap> {
    const res = await api.get<SettingsResponse>('/api/settings', { auth: true })
    return res?.data ?? {}
  },

  async update(settings: SettingsMap): Promise<SettingsMap> {
    const res = await api.put<SettingsResponse>('/api/settings', { settings }, { auth: true })
    return res?.data ?? {}
  }
}
