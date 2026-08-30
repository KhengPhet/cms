<script setup lang="ts">
import { ref } from "vue";
import { useI18n } from "@/composables/useI18n";
import { useAppStore } from "@/stores/app";
import { useSettingsStore } from "@/stores/settings";
import { LANGUAGES } from "@/services/i18n";
import { useClickOutside } from "@/composables/useClickOutside";
import { useAuthStore } from "@/stores/auth";
import { imageErrorHandler, PLACEHOLDER_IMAGE } from "@/utils/getImageUrl";
import { Search, Menu, X, ChevronDown } from "@lucide/vue";
import router from "@/router";

const { t } = useI18n();
const app = useAppStore();
const settings = useSettingsStore();
const auth = useAuthStore();

const mobileOpen = ref(false);
const langOpen = ref(false);
const langRoot = ref<HTMLElement | null>(null);
useClickOutside(langRoot, () => (langOpen.value = false));

const navItems = [
  { label: "nav.home", to: "/" },
  { label: "nav.national", to: "/national" },
  { label: "nav.international", to: "/international" },
  { label: "nav.politics", to: "/category/politics" },
  { label: "nav.technology", to: "/category/technology" },
  { label: "nav.business", to: "/category/business" },
  { label: "nav.sports", to: "/category/sports" },
  { label: "nav.entertainment", to: "/category/entertainment" },
  { label: "nav.education", to: "/category/education" },
  { label: "nav.contact", to: "/contact" },
];

function goSearch() {
  router.push({ path: "/search" });
}
</script>

<template>
  <header class="sticky top-0 z-50">
    <div class="border-b border-gray-100 bg-white/95 backdrop-blur dark:border-gray-700 dark:bg-gray-900/95" >
      <div class="mx-auto flex w-[90%] items-center gap-4 px-4 py-3">
        <button
          class="p-2 text-gray-600 transition-colors rounded-lg hover:bg-gray-100 lg:hidden dark:text-gray-300 dark:hover:bg-gray-800"
          @click="mobileOpen = !mobileOpen"
        >
          <Menu v-if="!mobileOpen" class="w-6 h-6" />
          <X v-else class="w-6 h-6" />
        </button>

        <a
          href="/"
          class="flex shrink-0 items-center gap-2.5"
          @click.prevent="router.push('/')"
        >
          <img
            src="/p-cms.png"
            alt="logo"
            class="object-cover w-10 h-10 rounded-xl"
          />
          <div class="leading-tight">
            <span
              class="block text-lg font-extrabold tracking-tight text-gray-900 dark:text-white"
              >{{ settings.appName }}</span
            >
          </div>
        </a>
        <nav class="hidden flex-1 items-center justify-center gap-1 px-4 lg:flex">
          <router-link
            v-for="item in navItems"
            :key="item.label"
            :to="item.to"
            class="whitespace-nowrap border-b-2 px-2.5 py-2.5 text-sm font-semibold transition-colors xl:px-3"
            :class="
              $route.path === item.to
                ? 'border-primary-600 text-primary-700 dark:border-primary-400 dark:text-primary-400'
                : 'border-transparent text-gray-600 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400'
            "
          >
            {{ t(item.label) }}
          </router-link>
        </nav>

        <div class="flex items-center gap-2 ml-auto">
          <div class="relative hidden md:block">
            <input
              placeholder="Search…"
              class="w-48 py-2 pr-4 text-sm transition-all border border-gray-200 rounded-full bg-gray-50 pl-9 focus:w-64 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
              @keydown.enter="goSearch"
            />
            <Search
              class="absolute w-4 h-4 text-gray-400 -translate-y-1/2 left-3 top-1/2"
            />
          </div>

          <button
            class="p-2 text-gray-600 transition-colors rounded-lg hover:bg-gray-100 md:hidden dark:text-gray-300 dark:hover:bg-gray-800"
            @click="goSearch"
          >
            <Search class="w-5 h-5" />
          </button>

          <div ref="langRoot" class="relative hidden sm:block">
            <button
              class="flex items-center gap-1.5 rounded-lg border border-gray-200 px-2.5 py-2 text-xs font-bold text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800"
              @click="langOpen = !langOpen"
            >
              {{
                LANGUAGES.find(
                  (l) => l.code === app.language
                )?.code.toUpperCase()
              }}
              <ChevronDown
                :class="[
                  'h-3 w-3 transition-transform',
                  langOpen ? 'rotate-180' : '',
                ]"
              />
            </button>
            <Transition name="dropdown">
              <div
                v-if="langOpen"
                class="absolute right-0 z-50 mt-2 w-44 origin-top-right rounded-xl border border-gray-100 bg-white p-1.5 shadow-card dark:border-gray-700 dark:bg-gray-800"
              >
                <button
                  v-for="l in LANGUAGES"
                  :key="l.code"
                  class="flex items-center justify-between w-full px-3 py-2 text-sm font-medium transition-colors rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                  :class="
                    app.language === l.code
                      ? 'text-primary-600 dark:text-primary-400'
                      : 'text-gray-700 dark:text-gray-200'
                  "
                  @click="
                    app.setLanguage(l.code);
                    langOpen = false;
                  "
                >
                  <span>{{ l.native }}</span>
                  <span class="text-xs text-gray-400">{{ l.label }}</span>
                </button>
              </div>
            </Transition>
          </div>

          <router-link
            v-if="!auth.isAuthenticated"
            to="/login"
            class="hidden px-4 py-2 text-sm font-bold text-white transition-colors rounded-lg bg-primary-600 hover:bg-primary-700 sm:block"
          >
            {{ t("auth.login") }}
          </router-link>
          <router-link
            v-else
            to="/profile"
            class="items-center hidden gap-2 py-1 pl-1 pr-3 transition-colors border border-gray-200 rounded-full hover:bg-gray-50 sm:flex dark:border-gray-600 dark:hover:bg-gray-800"
          >
            <img
              v-if="auth.user"
              :src="auth.user.avatar || PLACEHOLDER_IMAGE"
              class="w-8 h-8 rounded-full"
              alt="avatar"
              @error="imageErrorHandler"
            />
            <span
              v-if="auth.user"
              class="text-sm font-semibold text-gray-700 dark:text-gray-200"
            >
              {{ auth.user.name.split(" ")[0] }}
            </span>
          </router-link>
        </div>
      </div>
    </div>

    <Transition name="mobile">
      <div
        v-if="mobileOpen"
        class="px-4 pt-3 pb-6 bg-white border-t border-gray-100 shadow-card lg:hidden dark:border-gray-700 dark:bg-gray-900"
      >
        <router-link
          v-for="item in navItems"
          :key="item.label"
          :to="item.to"
          class="block rounded-lg px-3 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-800"
          @click="mobileOpen = false"
        >
          {{ t(item.label) }}
        </router-link>
        <div
          class="flex flex-col gap-2 pt-3 mt-3 border-t border-gray-100 dark:border-gray-700"
        >
          <router-link
            v-if="!auth.isAuthenticated"
            to="/login"
            class="rounded-lg bg-primary-600 px-3 py-2.5 text-center text-sm font-bold text-white transition-colors hover:bg-primary-700"
            @click="mobileOpen = false"
          >
            {{ t("auth.login") }}
          </router-link>
          <div class="flex items-center gap-2">
            <button
              v-for="l in LANGUAGES"
              :key="l.code"
              class="flex-1 px-3 py-2 text-xs font-bold border rounded-lg"
              :class="
                app.language === l.code
                  ? 'border-primary-600 bg-primary-50 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300'
                  : 'border-gray-200 text-gray-600 dark:border-gray-600 dark:text-gray-300'
              "
              @click="app.setLanguage(l.code)"
            >
              {{ l.native }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </header>
</template>

<style scoped>
.dropdown-enter-active,
.dropdown-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
.mobile-enter-active,
.mobile-leave-active {
  transition: opacity 0.2s ease;
}
.mobile-enter-from,
.mobile-leave-to {
  opacity: 0;
}
</style>