import axios from 'axios'
import { aiConfig, AIModelConfig } from '@/config/ai-config'

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

export interface ChatCompletionResponse {
  id: string
  object: string
  created: number
  model: string
  choices: {
    index: number
    message: {
      role: string
      content: string
    }
    finish_reason: string
  }[]
  usage: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
}

/**
 * 发送聊天消息到大模型 API
 * 支持流式和非流式响应，支持取消
 */
export async function sendChatMessage(
  messages: ChatMessage[],
  config: AIModelConfig = aiConfig,
  onStream?: (chunk: string) => void,
  abortController?: AbortController
): Promise<string> {
  const apiMessages = [
    { role: 'system', content: config.systemPrompt || '你是一个有帮助的AI助手。' },
    ...messages
  ]

  try {
    console.log('aiConfig:', config);
    if (onStream) {
      const response = await fetch(`${config.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.apiKey}`
        },
        body: JSON.stringify({
          model: config.model,
          messages: apiMessages,
          max_tokens: config.maxTokens,
          temperature: config.temperature,
          stream: true
        }),
        signal: abortController?.signal
      })

      if (!response.ok) {
        throw new Error(`API 请求失败: ${response.status}`)
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let fullContent = ''

      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value)
          const lines = chunk.split('\n').filter(line => line.trim() !== '')

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6)
              if (data === '[DONE]') continue

              try {
                const parsed = JSON.parse(data)
                const content = parsed.choices[0]?.delta?.content || ''
                if (content) {
                  fullContent += content
                  onStream(content)
                }
              } catch (e) {
                // 忽略解析错误
              }
            }
          }
        }
      }

      return fullContent
    }

    const response = await axios.post<ChatCompletionResponse>(
      `${config.baseURL}/chat/completions`,
      {
        model: config.model,
        messages: apiMessages,
        max_tokens: config.maxTokens,
        temperature: config.temperature
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.apiKey}`
        },
        signal: abortController?.signal
      }
    )

    return response.data.choices[0].message.content
  } catch (error: any) {
    if (error.name !== 'AbortError') {
      console.error('API 调用错误:', error)
    }
    throw error
  }
}
