import axios, { AxiosInstance } from "axios";
import { clearTokens, readAccessToken } from "./authStorage";
import { env } from "./env";
import { notifyError } from "./toast";

export function createApi(baseURL = env.apiBaseUrl, getToken: () => string = readAccessToken): AxiosInstance {
  const client = axios.create({ baseURL });
  client.interceptors.request.use((config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });
  client.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        clearTokens();
      }
      notifyError(error);
      return Promise.reject(error);
    },
  );
  return client;
}

export const api = createApi();

export type User = {
  id: number;
  email: string;
  name: string;
  phone: string;
  role: string;
  initials: string;
};

export type TokenPair = {
  access_token: string;
  refresh_token: string;
  user: User;
};

export type LoginChallenge = {
  requires_2fa: boolean;
  challenge_id: string;
  email_hint: string;
  message: string;
  debug_code?: string | null;
};

export async function loginRequest(email: string, password: string, staff = false): Promise<LoginChallenge> {
  const path = staff ? "/auth/staff/login" : "/auth/login";
  const { data } = await api.post<LoginChallenge>(path, { email, password });
  return data;
}

export async function verifyLoginRequest(challengeId: string, code: string): Promise<TokenPair> {
  const { data } = await api.post<TokenPair>("/auth/verify-login", { challenge_id: challengeId, code });
  return data;
}

export async function forgotPasswordRequest(email: string): Promise<{ message: string }> {
  const { data } = await api.post<{ message: string }>("/auth/forgot-password", { email });
  return data;
}

export async function resetPasswordRequest(token: string, password: string): Promise<{ message: string }> {
  const { data } = await api.post<{ message: string }>("/auth/reset-password", { token, password });
  return data;
}

export async function registerRequest(payload: {
  email: string;
  password: string;
  name: string;
  phone?: string;
}): Promise<TokenPair> {
  const { data } = await api.post<TokenPair>("/auth/register", payload);
  return data;
}

export async function meRequest(): Promise<User> {
  const { data } = await api.get<User>("/auth/me");
  return data;
}

export async function logoutRequest(refreshToken: string): Promise<void> {
  await api.post("/auth/logout", { refresh_token: refreshToken });
}
