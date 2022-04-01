/// <reference types="vite/client" />

import { Services } from './services/services.types'

declare module '*.vue' {
   // @ts-ignore
  import type { DefineComponent } from 'vue'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>
  export default component
}



declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $services: Services;
  }
}