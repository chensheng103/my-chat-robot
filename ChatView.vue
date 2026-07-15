<template>
  <div class="chat-container">
    <!-- 左侧会话列表 -->
    <div class="sidebar">
      <div class="sidebar-header">
        <button class="new-chat-btn" @click="createNewConversation">
          + 新建对话
        </button>
      </div>
      <ConversationList
        :conversations="chatStore.conversations"
        :current-id="chatStore.currentConversationId"
        @select="handleSelectConversation"
        @delete="handleDeleteConversation"
      />
    </div>

    <!-- 右侧对话区域 -->
    <div class="chat-main">
      <div v-if="!chatStore.currentConversation" class="empty-state">
        <div class="empty-content">
          <h2>欢迎使用 AI 对话助手</h2>
          <p>点击左侧"新建对话"开始聊天</p>
        </div>
      </div>

      <template v-else>
        <!-- 消息列表 -->
        <MessageList
          :messages="chatStore.currentConversation.messages"
          :is-generating="chatStore.isGenerating"
        />

        <!-- 思考模式开关 -->
        <div class="thinking-toggle">
          <label class="toggle-switch">
            <input
              type="checkbox"
              :checked="chatStore.thinkingModeEnabled"
              @change="chatStore.toggleThinkingMode"
              :disabled="chatStore.isGenerating"
            />
            <span class="toggle-slider"></span>
          </label>
          <span class="toggle-label">🧠 思考模式</span>
        </div>

        <!-- 输入区域 -->
        <MessageInput
          ref="messageInputRef"
          :disabled="chatStore.isGenerating"
          :is-generating="chatStore.isGenerating"
          @send="handleSendMessage"
          @stop="handleStopGenerating"
        />
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useChatStore } from '@/stores/chat'
import MessageList from '@/components/MessageList.vue'
import MessageInput from '@/components/MessageInput.vue'
import ConversationList from '@/components/ConversationList.vue'

const chatStore = useChatStore()
const messageInputRef = ref<InstanceType<typeof MessageInput>>()

// 创建新会话
function createNewConversation() {
  chatStore.createConversation()
  messageInputRef.value?.focus()
}

// 选择会话
function handleSelectConversation(id: string) {
  chatStore.switchConversation(id)
  messageInputRef.value?.focus()
}

// 删除会话
function handleDeleteConversation(id: string) {
  if (confirm('确定要删除这个对话吗？')) {
    chatStore.deleteConversation(id)
  }
}

// 发送消息
async function handleSendMessage(content: string) {
  try {
    await chatStore.sendMessage(content)
    messageInputRef.value?.focus()
  } catch (error) {
    alert('发送消息失败，请检查网络连接和 API 配置')
  }
}

// 停止生成
function handleStopGenerating() {
  chatStore.stopGenerating()
  messageInputRef.value?.focus()
}
</script>

<style scoped>
.chat-container {
  display: flex;
  height: 100vh;
  width: 100%;
  background: #f5f5f5;
  overflow: hidden;
}

.sidebar {
  width: 260px;
  background: #fff;
  border-right: 1px solid #e5e5e5;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
}

.sidebar-header {
  padding: 16px;
  border-bottom: 1px solid #e5e5e5;
}

.new-chat-btn {
  width: 100%;
  padding: 12px;
  background: #4a90e2;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.3s;
}

.new-chat-btn:hover {
  background: #357abd;
}

.chat-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #fff;
  min-width: 0;
}

.empty-state {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.empty-content {
  text-align: center;
  color: #999;
}

.empty-content h2 {
  font-size: 24px;
  margin-bottom: 12px;
  color: #333;
}

.empty-content p {
  font-size: 14px;
}

.thinking-toggle {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 20px;
  background: #f8fafc;
  border-top: 1px solid #e5e5e5;
}

.toggle-switch {
  position: relative;
  display: inline-block;
  width: 44px;
  height: 24px;
  cursor: pointer;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: 0.3s;
  border-radius: 24px;
}

.toggle-slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: 0.3s;
  border-radius: 50%;
}

.toggle-switch input:checked + .toggle-slider {
  background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%);
}

.toggle-switch input:checked + .toggle-slider:before {
  transform: translateX(20px);
}

.toggle-switch input:disabled + .toggle-slider {
  opacity: 0.5;
  cursor: not-allowed;
}

.toggle-label {
  font-size: 13px;
  color: #64748b;
  user-select: none;
}
</style>
