/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  readonly VITE_API_KEY: string
  readonly VITE_API_MODEL: string
  readonly VITE_API_MAX_TOKENS: string
  readonly VITE_API_TEMPERATURE: string
  readonly VITE_API_SYSTEM_PROMPT: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
