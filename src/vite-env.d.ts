/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_RAZORPAY_KEY_ID: string;
  readonly VITE_APP_ENV: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module "*.png" {
  const src: string;
  export default src;
}
