/// <reference types="vite/client" />

import type { ElectronApi } from '../electron/preload';

declare global {
  interface Window {
    api: ElectronApi;
  }
}

declare module '*.png' {
  const src: string;
  export default src;
}
