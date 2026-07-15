<template>
  <div class="conversation-list">
    <div
      v-for="conversation in conversations"
      :key="conversation.id"
      class="conversation-item"
      :class="{ active: conversation.id === currentId }"
      @click="$emit('select', conversation.id)"
    >
      <div class="conversation-info">
        <div class="conversation-title">{{ conversation.title }}</div>
        <div class="conversation-time">{{ formatTime(conversation.updatedAt) }}</div>
      </div>
      <button
        class="delete-btn"
        @click.stop="$emit('delete', conversation.id)"
        title="删除对话"
      >
        ×
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Conversation } from '@/stores/chat'

defineProps<{
  conversations: Conversation[]
  currentId: string | null
}>()

defineEmits<{
  select: [id: string]
  delete: [id: string]
}>()

function formatTime(timestamp: number): string {
  const date = new Date(timestamp)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  
  if (diff < 60000) return '刚刚'
  if (diff < 3600000) return `${Math.floor(diff / 60000)}分钟前`
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}小时前`
  
  return date.toLocaleDateString()
}
</script>

<style scoped>
.conversation-list {
  flex: 1;
  overflow-y: auto;
  padding: 8px;
}

.conversation-item {
  display: flex;
  align-items: center;
  padding: 12px;
  margin-bottom: 4px;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s;
}

.conversation-item:hover {
  background: #f0f0f0;
}

.conversation-item.active {
  background: #e3f2fd;
}

.conversation-info {
  flex: 1;
  overflow: hidden;
}

.conversation-title {
  font-size: 14px;
  color: #333;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.conversation-time {
  font-size: 12px;
  color: #999;
  margin-top: 4px;
}

.delete-btn {
  width: 24px;
  height: 24px;
  border: none;
  background: transparent;
  color: #999;
  font-size: 20px;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.2s;
  border-radius: 4px;
}

.conversation-item:hover .delete-btn {
  opacity: 1;
}

.delete-btn:hover {
  background: #fee;
  color: #f44;
}
</style>
