<script setup lang="ts">
import { ref, watch } from 'vue'
import { Camera, X } from '@lucide/vue'
import { avatarImage } from '@/services/placeholder'

const props = withDefaults(
  defineProps<{
    modelValue?: string
    label?: string
  }>(),
  { modelValue: '', label: 'Profile picture' }
)

const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

const inputRef = ref<HTMLInputElement | null>(null)
const preview = ref(props.modelValue)
const seed = ref(Math.floor(Math.random() * 100))

watch(
  () => props.modelValue,
  (v) => (preview.value = v)
)

function onFile(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return
  if (!file.type.startsWith('image/')) return
  const reader = new FileReader()
  reader.onload = () => {
    preview.value = reader.result as string
    emit('update:modelValue', reader.result as string)
  }
  reader.readAsDataURL(file)
}

function remove() {
  preview.value = ''
  emit('update:modelValue', '')
  if (inputRef.value) inputRef.value.value = ''
}
</script>

<template>
  <div class="flex items-center gap-4">
    <div
      class="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 transition-colors dark:border-gray-600 dark:bg-gray-800"
    >
      <img
        v-if="preview"
        :src="preview"
        alt="Avatar preview"
        class="h-full w-full object-cover"
      />
      <Camera v-else class="h-6 w-6 text-gray-300 dark:text-gray-500" />
      <button
        v-if="preview"
        type="button"
        class="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white shadow transition-transform hover:scale-110"
        aria-label="Remove image"
        @click="remove"
      >
        <X class="h-3 w-3" />
      </button>
    </div>
    <div>
      <p class="text-sm font-semibold text-gray-900 dark:text-white">{{ label }}</p>
      <p class="text-xs text-gray-400">JPG, PNG or GIF. Max 2MB.</p>
      <div class="mt-1.5 flex items-center gap-2">
        <button
          type="button"
          class="rounded-lg bg-primary-50 px-3 py-1.5 text-xs font-semibold text-primary-700 transition-colors hover:bg-primary-100 dark:bg-primary-900/40 dark:text-primary-200"
          @click="inputRef?.click()"
        >
          Upload
        </button>
        <button
          v-if="!preview"
          type="button"
          class="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-500 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
          @click="preview = avatarImage(seed); emit('update:modelValue', avatarImage(seed))"
        >
          Use a generated avatar
        </button>
        <button
          v-if="preview"
          type="button"
          class="rounded-lg px-3 py-1.5 text-xs font-semibold text-red-500 transition-colors hover:bg-red-50 dark:hover:bg-red-900/20"
          @click="remove"
        >
          Remove
        </button>
      </div>
    </div>
    <input ref="inputRef" type="file" accept="image/*" class="hidden" @change="onFile" />
  </div>
</template>
