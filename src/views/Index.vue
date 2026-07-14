<template>
  <div class="layout-container">
    <!-- 左侧历史会话侧边栏 -->
    <aside class="sidebar">
      <div class="sidebar-title">历史会话</div>
      <!-- 新建对话按钮，绑定点击事件 -->
      <button class="new-chat-btn" @click="createNewChat">+ 新建对话</button>

      <!-- 动态渲染会话列表，点击切换编辑器内容 -->
      <div class="chat-list">
        <div class="chat-item" v-for="(item, index) in chatList" :key="index" @click="switchChat(item)">
          {{ item.title }}
        </div>
      </div>
    </aside>

    <!-- 右侧主区域：杨静编写的CodeEditor编辑器 -->
    <main class="main-wrapper">
      <div class="area-title">JS代码编辑器</div>
      <!-- 双向绑定编辑器内容 -->
      <CodeEditor v-model="codeContent" />
    </main>
  </div>
</template>

import { ref } from 'vue'
// 导入杨静编写的编辑器组件
import CodeEditor from '@/components/CodeEditor.vue'

// 编辑器初始预置测试JS代码
const codeContent = ref(`// JS测试代码
function sum(a,b) {
  return a + b;
}
console.log(sum(1,2))`)

// 会话列表初始数据（蒋国谦会话管理）
const chatList = ref([
  { title: '会话1：JS代码解析', content: codeContent.value },
  { title: '会话2：函数调试', content: '// 这里是调试代码' }
])

/**
 * 新建对话按钮逻辑
 * 1. 清空编辑器为空白对话
 * 2. 在会话列表顶部新增一条会话
 */
const createNewChat = () => {
  // 重置编辑器内容
  codeContent.value = '// 全新对话，开始编写你的JS代码'
  // 构造新会话对象
  const newChat = {
    title: `会话${chatList.value.length + 1}：新建对话`,
    content: codeContent.value
  }
  // 将新会话插入列表最上方
  chatList.value.unshift(newChat)
}

/**
 * 点击历史会话，切换编辑器内代码
 * @param chatItem 选中的会话对象
 */
const switchChat = (chatItem: { title: string, content: string }) => {
  codeContent.value = chatItem.content
}

<style scoped>
.layout-container {
  display: flex;
  width: 100vw;
  height: 100vh;
}
.sidebar {
  width: 240px;
  background-color: #f5f5f5;
  padding: 16px;
}
.sidebar-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 12px;
}
.new-chat-btn {
  width: 100%;
  padding: 8px;
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  margin-bottom: 16px;
}
.chat-item {
  padding: 8px 10px;
  border-radius: 4px;
  margin-bottom: 6px;
  cursor: pointer;
}
.chat-item:hover {
  background-color: #e5e7eb;
}
.main-wrapper {
  flex: 1;
  padding: 16px;
}
.area-title {
  font-size: 18px;
  margin-bottom: 10px;
}
</style>