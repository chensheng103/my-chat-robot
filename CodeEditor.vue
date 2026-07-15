<template>
  <div class="editor-wrap">
    <!-- 编辑器挂载容器 -->
    <div class="editor-box" ref="editorDom"></div>

    <!-- 功能按钮区 -->
    <div class="editor-btn-area">
      <button @click="copyCode">一键复制全部代码</button>
      <button class="run-btn" @click="runCode">运行代码</button>
      <button class="clear-btn" @click="clearResult">清空结果</button>
    </div>

    <!-- 运行输出控制台 -->
    <div class="result-console">
      <h4>运行输出控制台</h4>
      <div v-if="errorMsg" class="error-text">{{ errorMsg }}</div>
      <div v-for="item in logList" class="log-text" :key="item">{{ item }}</div>
      <div v-if="!errorMsg && logList.length === 0" class="empty-tip">暂无运行输出</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, onBeforeUnmount } from 'vue'
// 引入编辑器核心与样式（修正dist路径）
import * as monaco from 'monaco-editor'
import 'monaco-editor/min/vs/editor/editor.main.css'

// ========== 双向绑定逻辑 ==========
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
    language: 'javascript', // JS语法高亮
    theme: 'vs',
    automaticLayout: true,
    tabSize: 2, // 自动缩进尺寸
    formatOnType: true, // 输入自动格式化缩进
    lineNumbers: 'on',
    minimap: { enabled: false },
    wordWrap: 'on'
  })

  // 编辑器输入变更 → 同步父组件（双向绑定正向）
  editorInstance.onDidChangeModelContent(() => {
    const code = editorInstance!.getValue()
    emit('update:modelValue', code)
  })
}

// 一键复制代码
const copyCode = async () => {
  if (!editorInstance) return
  const code = editorInstance.getValue()
  await navigator.clipboard.writeText(code)
  alert('代码复制成功！')
}

// 运行代码核心函数
const runCode = () => {
  errorMsg.value = ""
  logList.value = []
  if (!editorInstance) {
    errorMsg.value = '编辑器未初始化'
    return
  }
  const code = editorInstance.getValue().trim()
  if (!code) {
    errorMsg.value = '请先在编辑器内输入JS代码'
    return
  }
  try {
    // 修复作用域问题，用户所有代码全部放入函数内部
    const execFn = new Function(`
      const logs = []
      const console = {
        log: (...args) => logs.push(args.map(String).join(' '))
      }
      ${code}
      return { logs }
    `)
    const { logs } = execFn()
    logs.forEach(logItem => logList.value.push(logItem))
  } catch (err: any) {
    errorMsg.value = `代码执行错误：${err.message}`
  }
}

// 清空控制台输出
const clearResult = () => {
  errorMsg.value = ""
  logList.value = []
}

// 运行输出数据
const errorMsg = ref<string>('')
const logList = ref<string[]>([])

// 父组件数据更新 → 同步编辑器（双向绑定反向）
watch(
  () => props.modelValue,
  (newVal) => {
    if (editorInstance && editorInstance.getValue() !== newVal) {
      editorInstance.setValue(newVal)
    }
  }
)

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
.run-btn {
  background: #1677ff;
  color: white;
  border: none;
  padding: 5px 16px;
  border-radius: 4px;
  cursor: pointer;
  margin-left: 10px;
}
.clear-btn {
  background: #666;
  color: white;
  border: none;
  padding: 5px 16px;
  border-radius: 4px;
  cursor: pointer;
  margin-left: 6px;
}
/* 结果控制台 */
.result-console {
  margin-top: 15px;
  background-color: #1e1e1e;
  padding: 14px;
  border-radius: 6px;
  min-height: 160px;
}
.result-console h4 {
  color: #ccc;
  margin: 0 0 10px 0;
}
.error-text {
  color: #ff4d4f;
  line-height: 1.7;
}
.log-text {
  color: #fff;
  line-height: 1.7;
}
.empty-tip {
  color: #999;
}
</style>