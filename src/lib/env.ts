export type AppEnv = {
  apiBaseUrl: string;
  razorpayKeyId: string;
  appEnv: string;
};

export type RuntimeEnv = {
  VITE_API_BASE_URL?: string;
  VITE_RAZORPAY_KEY_ID?: string;
  VITE_APP_ENV?: string;
};

declare global {
  interface Window {
    __SLOWMO_ENV__?: RuntimeEnv;
  }
}

function pick(value: string | undefined): string {
  return (value || "").trim();
}

/** Runtime container env wins over Vite build-time values. */
export function mergeEnvSource(
  vite: Partial<Record<string, string>>,
  runtime: RuntimeEnv | undefined,
): Partial<Record<string, string>> {
  return {
    VITE_API_BASE_URL: pick(runtime?.VITE_API_BASE_URL) || pick(vite.VITE_API_BASE_URL),
    VITE_RAZORPAY_KEY_ID: pick(runtime?.VITE_RAZORPAY_KEY_ID) || pick(vite.VITE_RAZORPAY_KEY_ID),
    VITE_APP_ENV: pick(runtime?.VITE_APP_ENV) || pick(vite.VITE_APP_ENV),
  };
}

export function readEnv(source: Partial<Record<string, string>> = {}): AppEnv {
  const appEnv = pick(source.VITE_APP_ENV) || "dev";
  const fromSource = pick(source.VITE_API_BASE_URL);
  const apiBaseUrl = fromSource || (appEnv === "prod" ? "" : "http://localhost:5012/api/v1");
  return {
    apiBaseUrl,
    razorpayKeyId: pick(source.VITE_RAZORPAY_KEY_ID),
    appEnv,
  };
}

export let env = readEnv();

export function setEnv(source: Partial<Record<string, string>>): AppEnv {
  env = readEnv(source);
  return env;
}
