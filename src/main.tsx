import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./app/App";
import { AppProviders } from "./app/providers";
import { mergeEnvSource, setEnv } from "./lib/env";
import "./styles/index.css";

setEnv(
  mergeEnvSource(
    {
      VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
      VITE_RAZORPAY_KEY_ID: import.meta.env.VITE_RAZORPAY_KEY_ID,
      VITE_APP_ENV: import.meta.env.VITE_APP_ENV,
    },
    typeof window !== "undefined" ? window.__SLOWMO_ENV__ : undefined,
  ),
);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppProviders>
      <App />
    </AppProviders>
  </StrictMode>,
);
