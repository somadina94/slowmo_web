import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/store";
import { meRequest, refreshRequest } from "../../lib/api";
import { readAccessToken, readRefreshToken } from "../../lib/authStorage";
import { clearSession, setSession, setUser } from "./authSlice";

/** Restores Redux session from persisted tokens after a full page reload. */
export function AuthBootstrap() {
  const dispatch = useAppDispatch();
  const status = useAppSelector((state) => state.auth.status);

  useEffect(() => {
    if (status !== "booting") return;

    void (async () => {
      const access = readAccessToken();
      const refresh = readRefreshToken();
      if (!access && !refresh) {
        dispatch(clearSession());
        return;
      }

      try {
        const user = await meRequest({ silent: true });
        dispatch(setUser(user));
        return;
      } catch {
        /* try refresh below */
      }

      if (!refresh) {
        dispatch(clearSession());
        return;
      }

      try {
        const pair = await refreshRequest(refresh, { silent: true });
        dispatch(
          setSession({
            user: pair.user,
            accessToken: pair.access_token,
            refreshToken: pair.refresh_token,
          }),
        );
      } catch {
        dispatch(clearSession());
      }
    })();
  }, [dispatch, status]);

  return null;
}
