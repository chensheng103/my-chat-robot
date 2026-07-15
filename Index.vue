<template>
  <div class="layout-container">
    <!--左侧历史会话侧边栏-->
    <aside class="sidebar">
      <div class="sidebar-title">历史会话</div>
      <!--新建对话按钮-->
      <button class="new-chat-btn" @click="createNewChat">+ 新建对话</button>

      <!--会话列表改为动态渲染，点击可切换 -->
      <div class="chat-list">
        <div class="chat-item" v-for="(item, index) in chatList" :key="index" @click="switchChat(item)">
          {{ item.title }}
        </div>
      </div>
    </aside>

    <!--右侧主区域：代码编辑器-->
    <main class="main-wrapper">
      <section class="code-editor-area">
        <div class="area-title">JS代码编辑器</div>
        <!--修正v-model绑定变量名-->
        <CodeEditor v-model="codeContent" />
        <div style="margin-top:10px">
          <p>编辑器内实时代码：</p >
          <pre>{{ codeContent }}</pre>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
// 导入杨静编写的编辑器组件
import CodeEditor from '@/components/CodeEditor.vue'

// 编辑器初始预置测试JS代码
const codeContent = ref(`// JS测试示例代码
function sum(a,b){
  return a + b
}
console.log(sum(1,2))`)

// 会话列表初始数据
const chatList = ref([
  { title: '会话1：JS代码解析', content: codeContent.value },
  { title: '会话2：函数调试', content: '// 调试专用代码' }
])

/**
 * 新建对话按钮逻辑
 * 1. 清空编辑器为空白对话
 * 2. 在会话列表顶部新增一条会话
 */
const createNewChat = () => {
  // 重置编辑器内容
  codeContent.value = '// 全新对话，编写你的JS代码'
  // 构造新会话对象
  const newChat = {
    title: `会话${chatList.value.length + 1}：新建对话`,
    content: codeContent.value
  }
  // 将会话插入列表最上方
  chatList.value.unshift(newChat)
}

/**
 * 点击历史会话，切换编辑器内代码
 * @param chatItem 选中的会话对象
 */
const switchChat = (chatItem: { title: string, content: string }) => {
  codeContent.value = chatItem.content
}
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
.layout-container {
  display: flex;
  width: 100vw;
  height: 100vh;
}
.sidebar {
  width: 240px;
  background: #2c2c2c;
  color: #ffffff;
  padding: 16px;
}
.sidebar-title {
  font-size: 18px;
  margin-bottom: 12px;
}
.new-chat-btn {
  width: 100%;
  padding: 8px;
  background: #409eff;
  color: white;
  border: none;
  border-radius: 4px;
  margin-bottom: 16px;
  cursor: pointer;
}
.chat-item {
  padding: 8px 6px;
  border-radius: 4px;
  margin-bottom: 6px;
}
.chat-item:hover {
  background: #444;
}
.main-wrapper {
  flex: 1;
  padding: 20px;
  background: #f5f5f5;
}
.area-title {
  font-size: 16px;
  margin-bottom: 10px;
}
</style>