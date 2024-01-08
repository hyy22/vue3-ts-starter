/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_APP_NAME: string;
  readonly VITE_API_BASE_URL: string;
  readonly VITE_API_TIME_OUT: number;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
