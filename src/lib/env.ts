export type AppEnv = {
  apiBaseUrl: string;
  razorpayKeyId: string;
  appEnv: string;
};

export function readEnv(source: Partial<Record<string, string>> = {}): AppEnv {
  return {
    apiBaseUrl: source.VITE_API_BASE_URL || "http://localhost:5012/api/v1",
    razorpayKeyId: source.VITE_RAZORPAY_KEY_ID || "",
    appEnv: source.VITE_APP_ENV || "dev",
  };
}

export let env = readEnv();

export function setEnv(source: Partial<Record<string, string>>): AppEnv {
  env = readEnv(source);
  return env;
}
