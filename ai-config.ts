/**
 * 大模型配置文件
 * 配置信息从环境变量中读取
 */

export interface AIModelConfig {
  // API 基础地址
  baseURL: string
  // API Key
  apiKey: string
  // 模型名称
  model: string
  // 最大令牌数
  maxTokens?: number
  // 温度参数
  temperature?: number
  // 系统提示词
  systemPrompt?: string
}

/**
 * 从环境变量读取配置
 * 请在项目根目录的 .env 文件中配置环境变量
 */
export const aiConfig: AIModelConfig = {
  baseURL: import.meta.env.VITE_API_BASE_URL,
  apiKey: import.meta.env.VITE_API_KEY,
  model: import.meta.env.VITE_API_MODEL,
  maxTokens: parseInt(import.meta.env.VITE_API_MAX_TOKENS) || 2000,
  temperature: parseFloat(import.meta.env.VITE_API_TEMPERATURE) || 0.7,
  systemPrompt: import.meta.env.VITE_API_SYSTEM_PROMPT
}

/**
 * 修改配置的方法
 */
export function updateAIConfig(newConfig: Partial<AIModelConfig>) {
  Object.assign(aiConfig, newConfig)
}
