import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../../lib/api";
import { clearTokens, writeTokens } from "../../lib/authStorage";

export type AuthState = {
  user: User | null;
  accessToken: string;
};

const initialState: AuthState = { user: null, accessToken: "" };

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setSession(state, action: PayloadAction<{ user: User; accessToken: string; refreshToken: string }>) {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      writeTokens(action.payload.accessToken, action.payload.refreshToken);
    },
    setUser(state, action: PayloadAction<User | null>) {
      state.user = action.payload;
    },
    clearSession(state) {
      state.user = null;
      state.accessToken = "";
      clearTokens();
    },
  },
});

export const { setSession, setUser, clearSession } = authSlice.actions;
export const authReducer = authSlice.reducer;
