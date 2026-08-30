<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { Save, Globe, Search, Link2, Languages, Upload, Check, ChevronRight } from '@lucide/vue'
import { useNotificationsStore } from '@/stores/notifications'
import { useToast } from '@/composables/useToast'
import { LANGUAGES } from '@/services/i18n'
import { settingApi, type SettingsMap } from '@/services/settingApi'
import { useSettingsStore } from '@/stores/settings'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseCard from '@/components/ui/BaseCard.vue'
import SocialIcon from '@/components/public/SocialIcon.vue'

const notifStore = useNotificationsStore()
const toast = useToast()
const settingsStore = useSettingsStore()

const general = reactive({
  name: 'P CMS Platform',
  tagline: 'Trusted news. Everywhere.',
  description: 'A modern content management system delivering national and international news, articles and media.',
  email: 'contact@globalcms.com'
})

const seo = reactive({
  metaTitle: 'P CMS Platform — National & International News',
  metaDescription: 'Breaking news, in-depth analysis and trusted reporting from across the country and around the world.',
  keywords: 'news, world news, national news, international, technology, politics, business, sports, P CMS'
})

const social = reactive({
  facebook: 'https://facebook.com/globalcms',
  telegram: 'https://t.me/globalcms',
  youtube: 'https://youtube.com/@globalcms',
  twitter: 'https://x.com/globalcms'
})

const defaultLanguage = ref<'en' | 'km' | 'zh'>('en')
const saving = ref<string | null>(null)

const KEY = {
  siteName: 'site.name',
  siteTagline: 'site.tagline',
  siteDescription: 'site.description',
  siteEmail: 'site.email',
  seoTitle: 'seo.meta_title',
  seoDescription: 'seo.meta_description',
  seoKeywords: 'seo.keywords',
  fb: 'social.facebook',
  tg: 'social.telegram',
  yt: 'social.youtube',
  tw: 'social.twitter',
  lang: 'language.default'
}

function applySettings(map: SettingsMap) {
  const g = map[KEY.siteName]; if (g) general.name = g
  const t = map[KEY.siteTagline]; if (t) general.tagline = t
  const d = map[KEY.siteDescription]; if (d) general.description = d
  const e = map[KEY.siteEmail]; if (e) general.email = e
  const m = map[KEY.seoTitle]; if (m) seo.metaTitle = m
  const md = map[KEY.seoDescription]; if (md) seo.metaDescription = md
  const mk = map[KEY.seoKeywords]; if (mk) seo.keywords = mk
  const fb = map[KEY.fb]; if (fb) social.facebook = fb
  const tg = map[KEY.tg]; if (tg) social.telegram = tg
  const yt = map[KEY.yt]; if (yt) social.youtube = yt
  const tw = map[KEY.tw]; if (tw) social.twitter = tw
  const lang = map[KEY.lang]
  if (lang === 'en' || lang === 'km' || lang === 'zh') defaultLanguage.value = lang
}

async function save(type: string) {
  saving.value = type
  const payload: SettingsMap = {}
  if (type === 'General') {
    payload[KEY.siteName] = general.name
    payload[KEY.siteTagline] = general.tagline
    payload[KEY.siteDescription] = general.description
    payload[KEY.siteEmail] = general.email
  } else if (type === 'SEO') {
    payload[KEY.seoTitle] = seo.metaTitle
    payload[KEY.seoDescription] = seo.metaDescription
    payload[KEY.seoKeywords] = seo.keywords
  } else if (type === 'Social') {
    payload[KEY.fb] = social.facebook
    payload[KEY.tg] = social.telegram
    payload[KEY.yt] = social.youtube
    payload[KEY.tw] = social.twitter
  } else if (type === 'Language') {
    payload[KEY.lang] = defaultLanguage.value
  }
  try {
    const updated = await settingApi.update(payload)
    applySettings(updated)
    settingsStore.apply(updated)
    toast.success(`${type} settings saved`)
    notifStore.addActivity({
      id: 'l' + Date.now(),
      user: 'Sokha Mony',
      avatar: '',
      action: 'Updated settings',
      entity: type + ' settings',
      ip: '203.0.113.10',
      date: new Date().toISOString()
    })
  } catch (err) {
    toast.error(err instanceof Error ? err.message : 'Failed to save settings')
  } finally {
    saving.value = null
  }
}

onMounted(async () => {
  try {
    const map = await settingApi.getAll()
    applySettings(map)
  } catch {
    // Settings not yet saved — keep defaults.
  }
})

</script>

<template>
  <div class="mx-auto max-w-5xl space-y-6">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h2 class="text-xl font-extrabold text-gray-900 dark:text-white">Website Settings</h2>
        <p class="text-sm text-gray-500 dark:text-gray-400">Manage how your site looks, ranks and connects with readers.</p>
      </div>
      <div class="flex items-center gap-2 text-xs font-bold text-gray-400">
        <span class="h-2 w-2 rounded-full bg-emerald-500" /> All systems operational
      </div>
    </div>

    <div class="grid gap-6 lg:grid-cols-3">
      <div class="lg:col-span-2 space-y-6">
        <BaseCard>
          <div class="mb-4 flex items-center gap-2">
            <Globe class="h-4 w-4 text-primary-600 dark:text-primary-400" />
            <h3 class="text-base font-extrabold text-gray-900 dark:text-white">General</h3>
          </div>
          <div class="space-y-4">
            <BaseInput v-model="general.name" label="Website name" />
            <BaseInput v-model="general.tagline" label="Tagline" />
            <BaseInput v-model="general.description" label="Description" textarea :rows="3" />
            <BaseInput v-model="general.email" label="Contact email" type="email" />
            <div>
              <label class="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">Logo</label>
              <div class="flex items-center gap-4 rounded-xl border border-dashed border-gray-200 p-4 dark:border-gray-600">
                <svg width="56" height="56" viewBox="0 0 48 48" class="rounded-xl">
                  <rect width="48" height="48" rx="12" fill="#4f46e5" />
                  <path d="M13 14h22v6H13z" fill="#fff" />
                  <path d="M18 24h12v4H18z" fill="#c7d2fe" />
                  <path d="M18 31h12v4H18z" fill="#c7d2fe" />
                </svg>
                <div class="flex-1">
                  <p class="text-sm font-semibold text-gray-700 dark:text-gray-300">current-logo.svg</p>
                  <p class="text-xs text-gray-400">SVG · 512×512</p>
                </div>
                <BaseButton variant="outline" size="sm"><Upload class="h-4 w-4" /> Replace</BaseButton>
              </div>
            </div>
            <div class="flex justify-end">
              <BaseButton :loading="saving === 'General'" :disabled="saving !== null" @click="save('General')"><Save class="h-4 w-4" /> Save changes</BaseButton>
            </div>
          </div>
        </BaseCard>

        <BaseCard>
          <div class="mb-4 flex items-center gap-2">
            <Search class="h-4 w-4 text-primary-600 dark:text-primary-400" />
            <h3 class="text-base font-extrabold text-gray-900 dark:text-white">SEO</h3>
          </div>
          <div class="space-y-4">
            <div class="rounded-xl bg-gray-50 p-3 dark:bg-gray-700/40">
              <p class="text-xs font-semibold text-gray-500 dark:text-gray-300">Preview</p>
              <p class="mt-1 text-sm font-bold text-primary-600">{{ seo.metaTitle }}</p>
              <p class="mt-0.5 text-xs text-gray-500 dark:text-gray-400">{{ seo.metaDescription.slice(0, 120) }}…</p>
            </div>
            <BaseInput v-model="seo.metaTitle" label="Meta title" :hint="`${seo.metaTitle.length} / 60 characters`" />
            <BaseInput v-model="seo.metaDescription" label="Meta description" textarea :rows="3" :hint="`${seo.metaDescription.length} / 160 characters`" />
            <BaseInput v-model="seo.keywords" label="Keywords" placeholder="comma, separated, keywords" />
            <div class="flex justify-end">
              <BaseButton :loading="saving === 'SEO'" :disabled="saving !== null" @click="save('SEO')"><Save class="h-4 w-4" /> Save SEO</BaseButton>
            </div>
          </div>
        </BaseCard>
      </div>

      <div class="space-y-6">
        <BaseCard>
          <div class="mb-4 flex items-center gap-2">
            <Link2 class="h-4 w-4 text-primary-600 dark:text-primary-400" />
            <h3 class="text-base font-extrabold text-gray-900 dark:text-white">Social links</h3>
          </div>
          <div class="space-y-3">
            <div>
              <label class="mb-1 flex items-center gap-1.5 text-xs font-bold text-gray-500 dark:text-gray-400">
                <SocialIcon name="facebook" :size="14" class="text-blue-600" /> Facebook
              </label>
              <input v-model="social.facebook" class="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs focus:border-primary-400 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white" />
            </div>
            <div>
              <label class="mb-1 flex items-center gap-1.5 text-xs font-bold text-gray-500 dark:text-gray-400">
                <SocialIcon name="telegram" :size="14" class="text-sky-500" /> Telegram
              </label>
              <input v-model="social.telegram" class="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs focus:border-primary-400 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white" />
            </div>
            <div>
              <label class="mb-1 flex items-center gap-1.5 text-xs font-bold text-gray-500 dark:text-gray-400">
                <SocialIcon name="youtube" :size="14" class="text-red-600" /> YouTube
              </label>
              <input v-model="social.youtube" class="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs focus:border-primary-400 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white" />
            </div>
            <div>
              <label class="mb-1 flex items-center gap-1.5 text-xs font-bold text-gray-500 dark:text-gray-400">
                <SocialIcon name="twitter" :size="14" class="text-sky-500" /> X (Twitter)
              </label>
              <input v-model="social.twitter" class="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs focus:border-primary-400 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white" />
            </div>
            <BaseButton variant="success" size="sm" block :loading="saving === 'Social'" :disabled="saving !== null" @click="save('Social')"><Save class="h-4 w-4" /> Save social</BaseButton>
          </div>
        </BaseCard>

        <BaseCard>
          <div class="mb-4 flex items-center gap-2">
            <Languages class="h-4 w-4 text-primary-600 dark:text-primary-400" />
            <h3 class="text-base font-extrabold text-gray-900 dark:text-white">Languages</h3>
          </div>
          <p class="mb-3 text-xs text-gray-400">Choose the default interface language.</p>
          <div class="space-y-2">
            <button
              v-for="l in LANGUAGES"
              :key="l.code"
              class="flex w-full items-center justify-between rounded-lg border px-3 py-2.5 text-sm font-semibold transition-colors"
              :class="defaultLanguage === l.code ? 'border-primary-500 bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300' : 'border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800'"
              @click="defaultLanguage = l.code"
            >
              <span>{{ l.native }} <span class="ml-1 text-xs font-normal text-gray-400">({{ l.label }})</span></span>
              <Check v-if="defaultLanguage === l.code" class="h-4 w-4" />
            </button>
          </div>
          <BaseButton variant="outline" size="sm" block class="mt-3" :loading="saving === 'Language'" :disabled="saving !== null" @click="save('Language')"><Save class="h-4 w-4" /> Save language</BaseButton>
          <button class="mt-2 flex w-full items-center justify-center gap-1 text-xs font-bold text-primary-600 hover:underline dark:text-primary-400">
            Manage translations <ChevronRight class="h-3.5 w-3.5" />
          </button>
        </BaseCard>
      </div>
    </div>
  </div>
</template>