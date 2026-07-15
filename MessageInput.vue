<template>
  <div class="message-input">
    <textarea
      v-model="inputText"
      @keydown="handleKeydown"
      @input="handleInput"
      placeholder="输入消息... (Enter 发送，Shift+Enter 换行)"
      :disabled="disabled"
      rows="1"
      ref="textareaRef"
    ></textarea>
    <div class="button-group">
      <button
        v-if="isGenerating"
        class="stop-btn"
        @click="handleStop"
      >
        ⏹ 停止
      </button>
      <button
        class="send-btn"
        @click="handleSend"
        :disabled="disabled || !inputText.trim()"
      >
        发送
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'

const props = defineProps<{
  disabled?: boolean
  isGenerating?: boolean
}>()

const emit = defineEmits<{
  send: [content: string]
  stop: []
}>()

const inputText = ref('')
const textareaRef = ref<HTMLTextAreaElement>()
const MAX_HEIGHT = 150

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault()
    handleSend()
  }
}

function handleInput() {
  resizeTextarea()
}

function resizeTextarea() {
  const textarea = textareaRef.value
  if (!textarea) return

  textarea.style.height = 'auto'
  const scrollHeight = textarea.scrollHeight
  
  if (scrollHeight > MAX_HEIGHT) {
    textarea.style.height = `${MAX_HEIGHT}px`
    textarea.style.overflowY = 'auto'
  } else {
    textarea.style.height = `${scrollHeight}px`
    textarea.style.overflowY = 'hidden'
  }
}

function handleSend() {
  const text = inputText.value.trim()
  if (text && !props.disabled) {
    emit('send', text)
    inputText.value = ''
    nextTick(() => {
      if (textareaRef.value) {
        textareaRef.value.style.height = 'auto'
        textareaRef.value.style.overflowY = 'hidden'
      }
    })
  }
}

function handleStop() {
  emit('stop')
}

function focus() {
  nextTick(() => {
    textareaRef.value?.focus()
  })
}

defineExpose({ focus })
</script>

<style scoped>
.message-input {
  display: flex;
  gap: 12px;
  padding: 16px 20px;
  border-top: 1px solid #e5e5e5;
  background: #fff;
  box-sizing: border-box;
  width: 100%;
}

textarea {
  flex: 1;
  padding: 12px;
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  font-size: 14px;
  font-family: inherit;
  resize: none;
  line-height: 1.5;
  box-sizing: border-box;
  min-width: 0;
  min-height: 40px;
  overflow-y: hidden;
}

textarea:focus {
  outline: none;
  border-color: #4a90e2;
}

textarea:disabled {
  background: #f5f5f5;
  cursor: not-allowed;
}

.button-group {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
  align-self: flex-end;
}

.stop-btn {
  padding: 12px 16px;
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.3s;
  white-space: nowrap;
}

.stop-btn:hover {
  background: #dc2626;
}

.send-btn {
  padding: 12px 24px;
  background: #4a90e2;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.3s;
  white-space: nowrap;
}

.send-btn:hover:not(:disabled) {
  background: #357abd;
}

.send-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}
</style>
