/// <reference types="vite/client" />
/// <reference types="vitest/globals" />

interface ImportMetaEnv {
  readonly VITE_APP_NAME?: string;
  readonly VITE_AI_ADAPTER?: string;
  readonly VITE_API_BASE_URL?: string;
  readonly VITE_WS_URL?: string;
  readonly VITE_CONFIDENCE_THRESHOLD?: string;
  readonly VITE_CONFIDENCE_HIGH?: string;
  readonly VITE_SEQUENCE_FRAMES?: string;
  readonly VITE_APP_VERSION?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
