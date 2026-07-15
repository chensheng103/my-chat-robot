<template>
  <div>
    <h3>JS代码编辑器测试</h3>
    <!-- v-model双向绑定 -->
    <CodeEditor v-model="code" />
    <div style="margin-top:10px">
      <p>页面同步的代码数据：</p >
      <pre>{{ code }}</pre>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import CodeEditor from '@/components/CodeEditor.vue'
const code = ref(`// 测试JS代码
function sum(a,b) {
  return a + b;
}
console.log(sum(1,2))`)
</script>