/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CONVEX_URL: string;
  readonly VITE_VLY_APP_ID?: string;
  readonly VITE_VLY_MONITORING_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module '@zumer/snapdom';