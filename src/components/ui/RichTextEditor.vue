<script setup lang="ts">
import { onMounted, ref } from 'vue'
import {
  Bold,
  Italic,
  Underline,
  Heading2,
  List,
  ListOrdered,
  Quote,
  Link2,
  Code,
  ImagePlus,
  Video,
  Undo,
  Redo
} from '@lucide/vue'

const props = withDefaults(
  defineProps<{
    modelValue?: string
    placeholder?: string
    minHeight?: number
  }>(),
  {
    modelValue: '',
    placeholder: 'Start writing your article…',
    minHeight: 340
  }
)

const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

const editor = ref<HTMLDivElement | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)

onMounted(() => {
  if (editor.value && !editor.value.innerHTML) editor.value.innerHTML = props.modelValue
})

function exec(command: string, value?: string) {
  editor.value?.focus()
  document.execCommand(command, false, value ?? '')
  emitChange()
}

function tool(action: string, value?: string): (e: MouseEvent) => void {
  return (e: MouseEvent) => {
    e.preventDefault()
    exec(action, value)
  }
}

function promptLink(e: MouseEvent) {
  e.preventDefault()
  const url = window.prompt('Enter link URL', 'https://')
  if (url) {
    exec('createLink', url)
    exec('unlink')
    exec('createLink', url)
  }
}

function insertCode(e: MouseEvent) {
  e.preventDefault()
  const sel = window.getSelection()
  if (sel && sel.toString()) {
    exec('formatBlock', 'PRE')
    emitChange()
  } else {
    exec('insertHTML', '<pre><code>// insert code here\ncode goes here</code></pre>')
  }
}

function onImageUpload(e: Event) {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = () => {
      exec('insertImage', String(reader.result))
      emitChange()
    }
    reader.readAsDataURL(file)
  }
  target.value = ''
}

function embedVideo(e: MouseEvent) {
  e.preventDefault()
  const url = window.prompt('Enter video URL (YouTube / Vimeo)', 'https://www.youtube.com/watch?v=')
  if (url) {
    const html = `<div class="editor-video"><span class="video-tag">▶ VIDEO EMBED</span><br/><small>${url}</small></div>`
    exec('insertHTML', html)
  }
}

function emitChange() {
  emit('update:modelValue', editor.value?.innerHTML ?? '')
}

const buttons = [
  { id: 'bold', icon: Bold, hint: 'Bold', onMouseDown: tool('bold'), active: false },
  { id: 'italic', icon: Italic, hint: 'Italic', onMouseDown: tool('italic'), active: false },
  { id: 'underline', icon: Underline, hint: 'Underline', onMouseDown: tool('underline'), active: false },
  { id: 'h2', icon: Heading2, hint: 'Heading', onMouseDown: tool('formatBlock', 'H2'), active: false },
  { id: 'ul', icon: List, hint: 'Bullet list', onMouseDown: tool('insertUnorderedList'), active: false },
  { id: 'ol', icon: ListOrdered, hint: 'Numbered list', onMouseDown: tool('insertOrderedList'), active: false },
  { id: 'quote', icon: Quote, hint: 'Blockquote', onMouseDown: tool('formatBlock', 'BLOCKQUOTE'), active: false }
]

function buttonClass(b: { active: boolean }) {
  return b.active
    ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/50 dark:text-primary-300'
    : 'text-gray-500 hover:bg-gray-100 hover:text-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200'
}
</script>

<template>
  <div class="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-600">
    <div class="flex flex-wrap items-center gap-0.5 border-b border-gray-200 bg-gray-50 px-2 py-1.5 dark:border-gray-600 dark:bg-gray-800">
      <button
        v-for="b in buttons"
        :key="b.id"
        type="button"
        :title="b.hint"
        :class="['rounded-lg p-2 transition-colors', buttonClass(b)]"
        @mousedown="b.onMouseDown($event)"
      >
        <component :is="b.icon" class="h-4 w-4" />
      </button>
      <span class="mx-1 h-5 w-px bg-gray-200 dark:bg-gray-600" />
      <button
        type="button"
        title="Insert link"
        class="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200"
        @mousedown="promptLink"
      >
        <Link2 class="h-4 w-4" />
      </button>
      <button
        type="button"
        title="Code block"
        class="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200"
        @mousedown="insertCode"
      >
        <Code class="h-4 w-4" />
      </button>
      <button
        type="button"
        title="Upload image"
        class="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200"
        @click="fileInput?.click()"
      >
        <ImagePlus class="h-4 w-4" />
      </button>
      <button
        type="button"
        title="Embed video"
        class="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200"
        @mousedown="embedVideo"
      >
        <Video class="h-4 w-4" />
      </button>
      <span class="mx-1 h-5 w-px bg-gray-200 dark:bg-gray-600" />
      <button
        type="button"
        title="Undo"
        class="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200"
        @click="exec('undo')"
      >
        <Undo class="h-4 w-4" />
      </button>
      <button
        type="button"
        title="Redo"
        class="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200"
        @click="exec('redo')"
      >
        <Redo class="h-4 w-4" />
      </button>
    </div>
    <div
      ref="editor"
      contenteditable
      :data-placeholder="placeholder"
      class="editor-content w-full resize-y overflow-y-auto bg-white px-5 py-4 text-sm leading-relaxed text-gray-800 outline-none dark:bg-gray-800 dark:text-gray-100"
      :style="{ minHeight: minHeight + 'px' }"
      @input="emitChange"
    />
    <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="onImageUpload" />
  </div>
</template>

<style scoped>
.editor-content:empty::before {
  content: attr(data-placeholder);
  color: #9ca3af;
  pointer-events: none;
}
.editor-content :deep(h2) {
  font-size: 1.35rem;
  font-weight: 700;
  margin: 1rem 0 0.5rem;
  color: #111827;
}
.dark .editor-content :deep(h2) {
  color: #f9fafb;
}
.editor-content :deep(p) {
  margin: 0.6rem 0;
}
.editor-content :deep(blockquote) {
  border-left: 3px solid #4f46e5;
  padding-left: 1rem;
  margin: 1rem 0;
  font-style: italic;
  color: #4b5563;
}
.dark .editor-content :deep(blockquote) {
  color: #d1d5db;
}
.editor-content :deep(pre) {
  background: #f3f4f6;
  padding: 1rem;
  border-radius: 0.75rem;
  overflow-x: auto;
  font-family: ui-monospace, monospace;
  font-size: 0.8rem;
}
.dark .editor-content :deep(pre) {
  background: #1f2937;
  color: #e5e7eb;
}
.editor-content :deep(img) {
  max-width: 100%;
  border-radius: 0.75rem;
  margin: 1rem 0;
}
.editor-content :deep(.editor-video) {
  border: 1px dashed #c7d2fe;
  background: #eef2ff;
  color: #4f46e5;
  border-radius: 0.75rem;
  padding: 1.5rem;
  margin: 1rem 0;
  text-align: center;
  font-weight: 600;
}
.dark .editor-content :deep(.editor-video) {
  border-color: #4338ca;
  background: #312e81;
  color: #c7d2fe;
}
</style>