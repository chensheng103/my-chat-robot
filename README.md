# AI 对话助手

AI 对话助手项目说明文档（课程作业版）
一、项目概述
本项目是基于 Vue3 + TypeScript + Vite 开发的前端 AI 对话系统，为小组综合实训作业。项目兼容本地 Ollama 离线大模型与 OpenAI 标准 API 接口，实现多会话管理、流式打字回复、AI 思考过程展示等完整对话功能，代码采用 TypeScript 强类型约束，使用 Pinia 统一管理全局会话状态，结构清晰、易维护。
二、功能特性
核心对话：AI 流式实时输出回复，支持随时中断生成
会话管理：新建、切换、删除独立对话，聊天记录本地持久化
交互优化：输入框自适应高度、自动聚焦，回车快捷发送消息
拓展功能：AI 思考模式开关，可查看模型推理过程
安全设计：使用环境变量分离 API 密钥，敏感配置不上传代码仓库
页面适配：响应式布局，适配桌面端设备
三、技术栈
表格
分类	技术选型	作用
前端框架	Vue3 + TypeScript	页面开发、类型校验
构建工具	Vite	快速本地启动、项目打包
状态管理	Pinia	统一管理会话、消息全局数据
路由	Vue Router	页面路由跳转
网络请求	Axios + SSE	封装流式对话接口
版本管理	Git	小组多人协同开发
后端兼容	Ollama / OpenAI 兼容接口	本地离线模型、在线大模型调用
四、环境部署与运行指南
1. 前置条件
本地安装 Node.js 16 及以上版本
2. 安装项目依赖
打开项目终端执行命令：
bash
运行
# 进入项目文件夹
cd my-chat-robot
# 安装全部依赖包
npm install
3. 大模型接口配置
复制配置模板生成本地私密配置文件
Windows PowerShell：
powershell
Copy-Item .env.example .env
Mac / Linux：
bash
运行
cp .env.example .env
编辑 .env 文件配置模型信息

方案（在线 OpenAI 类接口）
env
VITE_API_BASE_URL=https://api.deepseek.com
VITE_API_KEY=sk-eeefb1643f8e44ec9e28521b28a80295
VITE_API_MODEL=deepseek-v4-pro
VITE_API_MAX_TOKENS=2000
VITE_API_TEMPERATURE=0.7
VITE_API_SYSTEM_PROMPT=乐于助人的AI对话助手
环境变量说明
表格
配置项	说明
VITE_API_BASE_URL	大模型服务接口地址
VITE_API_KEY	接口访问密钥，Ollama 无需填写
VITE_API_MODEL	指定调用的大模型名称
VITE_API_MAX_TOKENS	限制 AI 单次回复字数上限
VITE_API_TEMPERATURE	控制回答严谨 / 发散程度
VITE_API_SYSTEM_PROMPT	预设 AI 身份与回答规范
安全说明：.env 文件已加入 Git 忽略清单，不会上传代码仓库；。
4. 启动开发服务
bash
运行
npm run dev
执行后访问终端输出的本地链接，即可打开对话页面。
5. 打包部署（生产环境）
bash
运行
npm run build
打包产物存放于 dist 文件夹，可直接部署静态网页。
五、项目目录结构
plaintext
my-chat-robot/
├── src/
│   ├── api/                    # 接口请求封装
│   │   └── chat.ts             # 流式对话SSE核心请求代码
│   ├── components/             # 复用UI组件
│   │   ├── ConversationList.vue # 左侧会话侧边栏（增删切换会话）
│   │   ├── MessageInput.vue     # 自适应高度消息输入框
│   │   └── MessageList.vue      # 聊天消息展示、思考模式渲染
│   ├── config/                 # 全局配置文件
│   │   └── ai-config.ts        # 读取环境变量，统一导出模型配置
│   ├── router/                 # 路由管理
│   ├── stores/                 # Pinia全局状态仓库
│   │   └── chat.ts             # 管理会话、消息、加载状态
│   ├── views/                  # 页面视图
│   │   └── ChatView.vue        # 主对话页面
│   ├── App.vue                 # 项目根组件
│   ├── main.ts                 # 程序入口文件
│   └── style.css               # 全局通用样式
├── .env                        # 本地私密配置（不上传Git）
├── .env.example                # 公开配置模板（提交仓库）
├── .gitignore                  # Git忽略文件配置
├── package.json                # 项目依赖与脚本命令
├── tsconfig.json               # TypeScript类型配置
└── vite.config.ts              # Vite构建工具配置
六、软件操作使用说明
新建对话：点击左侧「新建对话」按钮，生成独立会话，聊天记录相互隔离。
发送提问：底部输入框输入内容，按下回车键或点击发送按钮，AI 实时流式输出回答。
切换会话：点击左侧历史会话条目，页面自动加载对应聊天记录。
删除会话：鼠标悬浮会话名称，点击右侧删除按钮清空整条对话。
停止生成：AI 输出过程中点击「停止生成」，立刻中断接口请求。
思考模式：页面顶部开关控制，开启后可查看 AI 内部推理思考内容。
七、支持的大模型服务
本地离线模型：Ollama 部署 DeepSeek-R1、Llama3 等开源模型（小组作业首选）
在线商用接口：OpenAI GPT 系列、通义千问、文心一言等兼容 OpenAI 格式的大模型
八、小组协同开发规范（作业加分项）
提交代码标准流程
bash
运行
# 1. 保存本地修改
git add .
git commit -m "修改内容说明"
# 2. 拉取远端最新代码
git pull origin feature/group10-code-interpreter
# 3. 无冲突后推送至仓库
git push
代码冲突处理
拉取代码出现冲突时，如需保留本地全部代码，执行命令终止合并：
bash
运行
git merge --abort
手动修复冲突后，按 Ctrl+S 保存文件，再执行 git add . 标记冲突解决，最后提交推送。
3. 禁止操作：不可直接推送存在未解决冲突的代码；严禁提交包含密钥的 .env 文件。
九、注意事项
流式回复依赖服务端 SSE 长连接，Ollama 默认原生支持，第三方接口需确认兼容。
API 密钥禁止硬编码写入代码，统一通过环境变量读取，避免信息泄露。
聊天记录存储在浏览器本地缓存，清空浏览器数据会丢失历史会话。
开发环境建议使用 Node.js 16 及以上版本，防止依赖安装报错。
新增配置、接口功能时，需同步更新 .env.example 与本文档。
