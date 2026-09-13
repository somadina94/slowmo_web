import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { authReducer } from "../features/auth/authSlice";
import { checkoutReducer } from "../features/checkout/checkoutSlice";
import { uiReducer } from "../features/ui/uiSlice";

export function makeStore() {
  return configureStore({
    reducer: {
      auth: authReducer,
      checkout: checkoutReducer,
      ui: uiReducer,
    },
  });
}

export const store = makeStore();
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
