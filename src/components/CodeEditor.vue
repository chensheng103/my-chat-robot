<template>
  <div class="editor-wrap">
    <!-- JS代码编辑面板容器 -->
    <div ref="editorDom" class="editor-box"></div>
    <!-- 一键复制按钮（开发任务2要求） -->
    <div class="editor-btn-area">
      <button @click="copyCode">一键复制全部代码</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, onBeforeUnmount } from 'vue'
// 引入编辑器核心与样式
import * as monaco from 'monaco-editor'
import 'monaco-editor/esm/vs/editor/editor.main.css'

// ========== 双向绑定逻辑（开发任务3）==========
const props = defineProps<{
  modelValue: string
}>()
const emit = defineEmits(['update:modelValue'])

// DOM容器
const editorDom = ref<HTMLDivElement>()
// 编辑器实例
let editorInstance: monaco.editor.IStandaloneCodeEditor | null = null

// 初始化编辑器
const initEditor = () => {
  if (!editorDom.value) return
  editorInstance = monaco.editor.create(editorDom.value, {
    value: props.modelValue,
    language: 'javascript', // 语法高亮核心配置（任务2）
    theme: 'vs',
    automaticLayout: true,
    tabSize: 2, // 自动缩进尺寸
    formatOnType: true, // 输入时自动缩进格式化（任务2）
    lineNumbers: 'on',
    minimap: { enabled: false },
    wordWrap: 'on'
  })

  // 编辑器输入变更 → 同步给父组件（双向绑定正向）
  editorInstance.onDidChangeModelContent(() => {
    const code = editorInstance!.getValue()
    emit('update:modelValue', code)
  })
}

// 一键复制代码函数（任务2）
const copyCode = async () => {
  if (!editorInstance) return
  const code = editorInstance.getValue()
  await navigator.clipboard.writeText(code)
  alert('代码复制成功！')
}

// 父组件数据更新 → 同步编辑器（双向绑定反向）
watch(() => props.modelValue, (newVal) => {
  if (editorInstance && editorInstance.getValue() !== newVal) {
    editorInstance.setValue(newVal)
  }
})

onMounted(() => initEditor())
// 销毁释放内存
onBeforeUnmount(() => editorInstance?.dispose())
</script>

<style scoped>
.editor-wrap {
  border: 1px solid #ccc;
  border-radius: 6px;
  overflow: hidden;
}
.editor-box {
  width: 100%;
  height: 400px;
}
.editor-btn-area {
  padding: 8px 12px;
  background: #f5f5f5;
}
button {
  padding: 5px 16px;
  background: #409eff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>