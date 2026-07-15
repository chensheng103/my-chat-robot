一、项目概述
本教学文档配套基于 Vue3 + TypeScript + Vite 开发的 AI 对话助手实训项目，完整复刻主流 AI 对话产品核心交互，兼容 Ollama 本地离线大模型与 OpenAI 标准流式接口。项目覆盖前端工程化、组合式 API、Pinia 全局状态、SSE 流式传输、组件化拆分、环境变量安全配置等核心前端知识点，适合 Vue 全栈综合实训教学与课程作业验收。
二、技术栈明细
表格
技术
指定版本
核心用途
Vue 3
^3.4.0
前端页面核心框架，使用 Composition API 开发
TypeScript
~5.4.0
强类型约束，规避运行时错误，提升代码规范性
Pinia
^2.1.0
Vue 官方新一代状态管理，统一管理会话、消息全局数据
Vue Router
^4.3.0
页面路由跳转管理
Vite
^5.4.0
项目构建工具，极速热更新、打包部署
Axios
^1.6.0
HTTP 基础请求封装，配合 Fetch 处理 SSE 流式响应
UUID
^9.0.0
生成会话、消息唯一 ID，区分不同对话数据
三、完整项目目录结构
plaintext

my-chat-robot/
├── src/
│   ├── api/                    # 接口分层（解耦UI与网络请求）
│   │   └── chat.ts            # 聊天核心接口，封装SSE流式读取、中断请求逻辑
│   │
│   ├── components/             # 可复用UI组件（高内聚低耦合）
│   │   ├── MessageList.vue    # 消息渲染组件：用户/AI消息、思考步骤展示、加载动画
│   │   ├── MessageInput.vue   # 底部输入框：自适应高度、回车发送、自动聚焦
│   │   └── ConversationList.vue # 左侧会话侧边栏：新建/切换/删除会话
│   │
│   ├── config/                 # 全局静态配置层
│   │   └── ai-config.ts       # 读取环境变量，统一导出大模型全部配置参数
│   │
│   ├── router/                 # 路由管理模块
│   │   └── index.ts           # 项目路由定义、路由守卫
│   │
│   ├── stores/                 # Pinia状态仓库（全局唯一数据源）
│   │   └── chat.ts            # 管理会话列表、当前对话、消息队列、思考模式开关
│   │
│   ├── views/                  # 页面级视图（整合多个组件）
│   │   └── ChatView.vue       # 主对话页面，整合侧边栏、消息区、输入框三大模块
│   │
│   ├── App.vue                # 项目根入口组件
│   ├── main.ts                # 全局入口文件，注册Vue插件、挂载应用
│   └── vite-env.d.ts          # Vite环境变量TS类型声明文件
│
├── .env                       # 本地私有配置（存放API密钥，禁止提交Git）
├── .env.example               # 公开配置模板（无敏感信息，可上传仓库）
├── package.json               # 项目依赖、启动/打包脚本命令
├── tsconfig.json              # TypeScript编译、类型校验规则配置
├── vite.config.ts             # Vite服务、打包、代理配置
├── README.md                  # 项目部署使用文档
└── TEACHING.md                # 本项目教学说明文档

￼
四、需求清单（分优先级，作业验收标准）
4.1 核心基础需求（P0 必做，占分核心）
表格
￼
￼
￼
序号
需求描述
优先级
完成状态
1
使用 Vite 搭建 Vue3+TS 标准工程
P0
✅ 已完成
2
对接大模型流式对话接口，实现 AI 问答
P0
✅ 已完成
3
抽离独立配置文件，统一管理模型 API 参数
P0
✅ 已完成
4
新建空白独立对话会话
P0
✅ 已完成
5
点击切换不同会话，隔离聊天记录
P0
✅ 已完成
6
删除不需要的会话，同步清空历史消息
P0
✅ 已完成
4.2 用户体验优化需求（P1/P2 加分功能）
表格
￼
￼
￼
序号
需求描述
优先级
完成状态
7
SSE 流式逐字输出 AI 回复，模拟打字效果
P0
✅ 已完成
8
全局开关控制「思考模式」启用 / 关闭
P1
✅ 已完成
9
思考模式下分步展示 AI 推理过程，带动画
P1
✅ 已完成
10
生成过程提供停止按钮，随时中断请求
P1
✅ 已完成
11
输入框加载页面自动聚焦，无需手动点击
P2
✅ 已完成
12
输入文本自动撑开高度，超出限制出现滚动条
P2
✅ 已完成
13
AI 加载中动态点阵等待动画
P2
✅ 已完成
五、核心功能详细教学拆解
5.1 大模型流式对话（本项目重难点）
功能描述
用户提交提问后，后端通过 SSE 长连接分段返回 AI 回答，前端实时逐字符渲染到页面，模拟真人打字效果；支持主动中断请求，不会阻塞页面。
核心技术要点
1. 采用浏览器原生 Fetch + ReadableStream 处理流式数据，轻量化无额外依赖；
2. AbortController 控制器绑定请求，实现一键停止生成；
3. TextDecoder 解析二进制流，拆分 SSE 标准data:片段，增量拼接回复内容。
关键示范代码
typescript
￼
￼
运行
￼
￼
// src/api/chat.ts 流式请求核心逻辑

export async function streamChatMessage(
  messages
: ChatMessage[],
  config
: AIModelConfig,
  
onStream: (text: string) => void,
  abortController
: AbortController

) {
  
const url = config.baseURL + "/chat/completions"
  
const response = await fetch(url, {
    method
: "POST",
    headers
: {
      
"Content-Type": "application/json",
      Authorization
: `Bearer ${config.apiKey}`
    
},
    body
: JSON.stringify({
      model
: config.model,
      messages
,
      stream
: true, // 开启流式返回
      max_tokens
: config.maxTokens,
      temperature
: config.temperature
    
}),
    signal
: abortController.signal // 绑定中断信号
  
})

  
// 读取二进制数据流
  
const reader = response.body?.getReader()
  
const decoder = new TextDecoder("utf-8")
  
while (true) {
    
const { done, value } = await reader.read()
    
if (done) break
    
// 解析分段数据
    
const chunk = decoder.decode(value)
    
const lines = chunk.split("\n").filter(line => line.trim())
    
for (const line of lines) {
      
if (line.startsWith("data: ")) {
        
const jsonStr = line.slice(6)
        
if (jsonStr === "[DONE]") continue
        
const data = JSON.parse(jsonStr)
        
const deltaText = data.choices?.[0]?.delta?.content || ""
        deltaText 
&& onStream(deltaText) // 回调渲染增量文字
      
}
    
}
  
}

}

5.2 多会话全局状态管理
功能描述
每个会话完全独立，拥有专属消息列表、标题、创建时间；所有会话数据统一存放在 Pinia 仓库，组件跨页面共享状态。
核心技术要点
1. 定义标准化 TS 接口约束会话、消息数据结构；
2. UUID 生成全局唯一 ID，避免会话 / 消息 ID 冲突；
3. 切换会话自动筛选对应历史消息，新建会话默认以首条提问为标题。
标准化 TS 数据结构
typescript

运行

// src/stores/chat.ts 类型定义

export interface Conversation {
  id
: string          // 会话唯一标识
  title
: string       // 会话标题
  messages
: Message[] // 当前会话全部聊天记录
  createdAt
: number   // 创建时间戳
  updatedAt
: number   // 最后更新时间戳

}


export interface Message {
  id
: string
  role
: "user" | "assistant" // 用户消息 / AI回复
  content
: string            // 对话正文
  timestamp
: number
  thinking
?: string[]        // AI思考步骤数组（思考模式专用）

}


5.3 AI 思考模式（拓展交互亮点）
功能描述
开启后 AI 回复前分步展示推理逻辑，缓解用户等待焦虑；步骤定时逐行弹出，自带过渡动画。
实现逻辑拆解
1. 正则提取用户提问关键词，自动生成贴合问题的推理步骤；
2. 定时器分段推送思考文本，控制展示间隔；
3. 最小思考时长限制，避免步骤一闪而过。
核心代码片段
typescript

运行

// 自动根据用户问题生成思考步骤

function generateThinkingSteps(userInput: string): string[] {
  
const coreWord = userInput.match(/(代码|算法|知识点|教程)/)?.[0] || "问题"
  
return [
    
`接收用户提问：${userInput}`,
    
`识别用户需求，核心主题为${coreWord}`,
    
`检索对应知识库内容`,
    
`整理逻辑结构，组织通顺回答文本`
  
]

}


// 定时渲染思考步骤

let stepIndex = 0

const timer = setInterval(() => {
  
if (stepIndex >= thinkingSteps.length) {
    
clearInterval(timer)
    
return
  
}
  currentAiMsg
.thinking?.push(thinkingSteps[stepIndex])
  stepIndex
++

}, 300)

5.4 停止生成功能
技术要点
AbortController 作为请求控制器，调用.abort()即可终止网络流，捕获中断异常不抛出错误，页面保留已输出文字。
typescript

运行

// 仓库中定义控制器

const abortController = ref<AbortController | null>(null)


// 发送消息时初始化控制器

async function sendChat(text: string) {
  abortController
.value = new AbortController()
  
try {
    
await streamChatMessage(msgList, aiConfig, appendText, abortController.value!)
  
} catch (err) {
    
// 用户手动中断，无需报错
    
if ((err as Error).name !== "AbortError") {
      
console.error("请求失败", err)
    
}
  
}

}


// 停止按钮触发函数

function stopGenerate() {
  abortController
.value?.abort()

}

5.5 自适应高度输入框
功能要点
文本框初始单行，输入内容自动增高，设置最大高度阈值，超出后垂直滚动。
typescript

运行

// MessageInput.vue 自适应高度逻辑

const MAX_INPUT_HEIGHT = 160

const textareaRef = ref<HTMLTextAreaElement | null>(null)


function adjustTextareaHeight() {
  
const el = textareaRef.value
  
if (!el) return
  el
.style.height = "auto"
  
const realHeight = el.scrollHeight
  
if (realHeight > MAX_INPUT_HEIGHT) {
    el
.style.height = `${MAX_INPUT_HEIGHT}px`
    el
.style.overflowY = "auto"
  
} else {
    el
.style.height = `${realHeight}px`
    el
.style.overflowY = "hidden"
  
}

}


六、环境变量配置教学（安全开发重点）
6.1 配置操作步骤
1. 复制模板文件生成本地私有配置（Windows PowerShell）
powershell
Copy-Item .env.example .env


Mac/Linux 命令：
bash
运行

cp .env.example .env


2. 编辑.env填入模型服务参数
env

VITE_API_BASE_URL=https://api.deepseek.com
VITE_API_KEY=sk-eeefb1643f8e44ec9e28521b28a80295
VITE_API_MODEL=deepseek-v4-pro
VITE_API_MAX_TOKENS=2000
VITE_API_TEMPERATURE=0.7
VITE_API_SYSTEM_PROMPT=你是DeepSeek代码解释助手，解答编程相关问题，输出附带完整可运行代码

6.2 环境变量参数说明表
表格

变量名
含义

6.3 配置读取文件 ai-config.ts
统一封装环境变量，全局直接导入使用，避免重复书写import.meta.env
typescript

运行

// src/config/ai-config.ts

export interface AIModelConfig {
  baseURL
: string
  apiKey
: string
  model
: string
  maxTokens
: number
  temperature
: number
  systemPrompt
: string

}


export const aiConfig: AIModelConfig = {
  baseURL
: import.meta.env.VITE_API_BASE_URL || "",
  apiKey
: import.meta.env.VITE_API_KEY || "",
  model
: import.meta.env.VITE_API_MODEL || "deepseek-r1",
  maxTokens
: Number(import.meta.env.VITE_API_MAX_TOKENS) || 2000,
  temperature
: Number(import.meta.env.VITE_API_TEMPERATURE) || 0.7,
  systemPrompt
: import.meta.env.VITE_API_SYSTEM_PROMPT || "你是AI助手"

}

6.4 安全开发规范（教学考点）
1. .env包含密钥，写入.gitignore，禁止提交至代码仓库；
2. .env.example仅保留参数名、无敏感数据，必须同步提交给小组组员；
3. 严禁将密钥硬编码写入任意.ts/.vue源码，防止信息泄露。
七、项目启动、打包命令
bash

运行

# 1. 初次拉取代码后安装全部依赖

npm install


# 2. 启动本地开发服务（热更新，调试页面）

npm run dev


# 3. 打包生产静态文件（dist文件夹，可部署网页）

npm run build


八、核心前端学习知识点（课程考核重点）
8.1 Vue3 Composition API（项目全程使用）
1. 基础响应式：ref（基础类型）、reactive（对象数组）；
2. 计算属性computed、侦听器watch监听数据变化；
3. 组件通信：defineProps接收父组件参数、defineEmits向父组件触发事件；
4. defineExpose子组件对外暴露方法，父组件通过 ref 调用。
8.2 Pinia 状态管理（替代 Vuex，Vue 官方推荐）
1. 使用defineStore创建独立模块仓库；
2. 响应式变量、同步 / 异步业务函数统一封装；
3. 任意组件导入useChatStore()即可全局读写会话数据，无需多层传参。
typescript
运行
// Pinia仓库基础模板

export const useChatStore = defineStore("chat", () => {
  
// 全局响应式数据
  
const conversationList = ref<Conversation[]>([])
  
const currentConvId = ref<string | null>(null)

  
// 业务方法
  
function createNewConversation() {}
  
function deleteConversation(id: string) {}
  
async function sendUserMessage(text: string) {}

  
return { conversationList, currentConvId, createNewConversation, deleteConversation, sendUserMessage }

})

8.3 SSE 流式传输（网络拓展知识点）
原生 Fetch 处理长连接二进制流，前端增量渲染分段数据，无需第三方流式库；掌握 AbortController 中断网络请求，处理异步异常。
8.4 CSS 动画交互
通过@keyframes定义关键帧动画，实现加载点阵、思考步骤渐入效果：
css

/* AI加载等待动画 */

@keyframes dot-bounce {
  
0%, 80%, 100% { transform: scale(0.4); opacity: 0.4; }
  
40% { transform: scale(1); opacity: 1; }

}

.wait-dot span {
  
animation: dot-bounce 1.4s infinite ease-in-out;

}

8.5 Vite 环境变量机制
Vite 自动读取.env系列文件，通过import.meta.env读取配置，区分开发 / 生产环境，实现敏感配置与业务代码解耦。

文档版本：V1.0
最后更新日期：2026 年 07 月 15 日
