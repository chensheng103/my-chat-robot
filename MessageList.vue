<template>
  <div class="message-list" ref="messageListRef">
    <div
      v-for="message in displayedMessages"
      :key="message.id"
      class="message-item"
      :class="message.role"
    >
      <div class="message-avatar">
        {{ message.role === 'user' ? '我' : 'AI' }}
      </div>
      <div class="message-content">
        <div class="message-text">{{ message.content }}</div>
        <div class="message-time">{{ formatTime(message.timestamp) }}</div>
      </div>
    </div>
    
    <div v-if="isGenerating && hasEmptyAssistantMessage" class="message-item assistant">
      <div class="message-avatar">AI</div>
      <div class="message-content">
        <div v-if="currentThinking.length > 0" class="thinking-container">
          <div class="thinking-header">
            <span class="thinking-brain">🧠</span>
            <span class="thinking-title">思考中</span>
          </div>
          <div class="thinking-steps">
            <div
              v-for="(step, index) in currentThinking"
              :key="index"
              class="thinking-step"
              :style="{ animationDelay: `${index * 0.1}s` }"
            >
              <span class="step-bullet">
                <span class="step-number">{{ index + 1 }}</span>
              </span>
              <span class="step-text">{{ step }}</span>
            </div>
          </div>
          <div v-if="showWaitingIndicator" class="waiting-indicator">
            <span class="waiting-text">等待响应</span>
            <span class="waiting-dots">
              <span>.</span><span>.</span><span>.</span>
            </span>
          </div>
        </div>
        <div v-else class="typing-indicator">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, computed } from 'vue'
import type { Message } from '@/stores/chat'

const props = defineProps<{
  messages: Message[]
  isGenerating: boolean
}>()

const messageListRef = ref<HTMLElement>()

const displayedMessages = computed(() => {
  return props.messages.filter(m => m.content.trim() !== '')
})

const hasEmptyAssistantMessage = computed(() => {
  return props.messages.some(m => m.role === 'assistant' && m.content.trim() === '')
})

const currentThinking = computed(() => {
  const lastMessage = props.messages[props.messages.length - 1]
  return lastMessage?.role === 'assistant' && lastMessage.thinking ? lastMessage.thinking : []
})

const showWaitingIndicator = computed(() => {
  return props.isGenerating && currentThinking.value.length > 0
})

watch(() => props.messages, () => {
  nextTick(() => {
    if (messageListRef.value) {
      messageListRef.value.scrollTop = messageListRef.value.scrollHeight
    }
  })
}, { deep: true })

function formatTime(timestamp: number): string {
  const date = new Date(timestamp)
  return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
}
</script>

<style scoped>
.message-list {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

.message-item {
  display: flex;
  margin-bottom: 20px;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.message-item.user {
  flex-direction: row-reverse;
}

.message-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #4a90e2;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: bold;
  flex-shrink: 0;
}

.message-item.assistant .message-avatar {
  background: #10a37f;
}

.message-content {
  max-width: 70%;
  margin: 0 12px;
}

.message-text {
  padding: 12px 16px;
  border-radius: 12px;
  background: #f0f0f0;
  line-height: 1.6;
  word-wrap: break-word;
  white-space: pre-wrap;
}

.message-item.user .message-text {
  background: #4a90e2;
  color: white;
}

.message-time {
  font-size: 12px;
  color: #999;
  margin-top: 4px;
  text-align: right;
}

.message-item.user .message-time {
  text-align: left;
}

.typing-indicator {
  display: flex;
  gap: 4px;
  padding: 12px 16px;
  background: #f0f0f0;
  border-radius: 12px;
}

.typing-indicator span {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #999;
  animation: bounce 1.4s infinite ease-in-out;
}

.typing-indicator span:nth-child(1) {
  animation-delay: -0.32s;
}

.typing-indicator span:nth-child(2) {
  animation-delay: -0.16s;
}

@keyframes bounce {
  0%, 80%, 100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
}

.thinking-container {
  padding: 12px 16px;
  background: linear-gradient(135deg, #f0f9ff 0%, #fef3c7 100%);
  border-radius: 12px;
  border: 1px solid #e0e7ff;
  min-width: 280px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.thinking-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px dashed #cbd5e1;
}

.thinking-brain {
  font-size: 20px;
  animation: brainPulse 2s ease-in-out infinite;
}

@keyframes brainPulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

.thinking-title {
  font-size: 13px;
  font-weight: 600;
  color: #334155;
  letter-spacing: 0.5px;
}

.thinking-steps {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.thinking-step {
  display: flex;
  align-items: center;
  gap: 8px;
  animation: stepFadeIn 0.3s ease-out forwards;
  opacity: 0;
}

@keyframes stepFadeIn {
  from {
    opacity: 0;
    transform: translateX(-10px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.step-bullet {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.step-number {
  font-size: 11px;
  font-weight: 600;
  color: white;
}

.step-text {
  font-size: 13px;
  color: #475569;
  line-height: 1.5;
  flex: 1;
}

.waiting-indicator {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 12px;
  padding-top: 8px;
  border-top: 1px dashed #cbd5e1;
}

.waiting-text {
  font-size: 13px;
  color: #64748b;
}

.waiting-dots {
  display: inline-flex;
  gap: 2px;
}

.waiting-dots span {
  font-size: 18px;
  font-weight: bold;
  color: #3b82f6;
  animation: dotBounce 1.4s infinite ease-in-out both;
}

.waiting-dots span:nth-child(1) {
  animation-delay: -0.32s;
}

.waiting-dots span:nth-child(2) {
  animation-delay: -0.16s;
}

.waiting-dots span:nth-child(3) {
  animation-delay: 0s;
}

@keyframes dotBounce {
  0%, 80%, 100% {
    transform: scale(0);
    opacity: 0.5;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
}

.step-cursor {
  font-size: 16px;
  color: #94a3b8;
  animation: cursorBlink 1s infinite;
}

@keyframes cursorBlink {
  0%, 50% {
    opacity: 1;
  }
  51%, 100% {
    opacity: 0;
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

@keyframes fadeInOut {
  from {
    opacity: 0;
    transform: translateY(-5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
