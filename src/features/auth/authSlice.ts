import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../../lib/api";
import { clearTokens, writeTokens } from "../../lib/authStorage";

export type AuthStatus = "booting" | "ready";

export type AuthState = {
  user: User | null;
  accessToken: string;
  status: AuthStatus;
};

const initialState: AuthState = {
  user: null,
  accessToken: "",
  status: "ready",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setSession(state, action: PayloadAction<{ user: User; accessToken: string; refreshToken: string }>) {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.status = "ready";
      writeTokens(action.payload.accessToken, action.payload.refreshToken);
    },
    setUser(state, action: PayloadAction<User | null>) {
      state.user = action.payload;
      state.status = "ready";
    },
    clearSession(state) {
      state.user = null;
      state.accessToken = "";
      state.status = "ready";
      clearTokens();
    },
  },
});

export const { setSession, setUser, clearSession } = authSlice.actions;
export const authReducer = authSlice.reducer;
