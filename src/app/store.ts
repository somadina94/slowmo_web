import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { authReducer, type AuthState } from "../features/auth/authSlice";
import { checkoutReducer } from "../features/checkout/checkoutSlice";
import { uiReducer } from "../features/ui/uiSlice";
import { readAccessToken } from "../lib/authStorage";

function authPreload(): AuthState {
  const accessToken = readAccessToken();
  return {
    user: null,
    accessToken,
    status: accessToken ? "booting" : "ready",
  };
}

export function makeStore() {
  return configureStore({
    reducer: {
      auth: authReducer,
      checkout: checkoutReducer,
      ui: uiReducer,
    },
    preloadedState: {
      auth: authPreload(),
    },
  });
}

export const store = makeStore();
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
