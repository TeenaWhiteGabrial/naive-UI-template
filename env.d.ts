/// <reference types="vite/client" />
declare module '@arco-design/color'

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}
