const ACCESS = "slowmo_access";
const REFRESH = "slowmo_refresh";

export function readAccessToken(storage: Pick<Storage, "getItem"> = localStorage): string {
  return storage.getItem(ACCESS) || "";
}

export function readRefreshToken(storage: Pick<Storage, "getItem"> = localStorage): string {
  return storage.getItem(REFRESH) || "";
}

export function writeTokens(access: string, refresh: string, storage: Pick<Storage, "setItem"> = localStorage): void {
  storage.setItem(ACCESS, access);
  storage.setItem(REFRESH, refresh);
}

export function clearTokens(storage: Pick<Storage, "removeItem"> = localStorage): void {
  storage.removeItem(ACCESS);
  storage.removeItem(REFRESH);
}
