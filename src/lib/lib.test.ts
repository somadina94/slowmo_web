import {
  api,
  createApi,
  loginRequest,
  logoutRequest,
  meRequest,
  refreshRequest,
  registerRequest,
  verifyLoginRequest,
  forgotPasswordRequest,
  resetPasswordRequest,
} from "./api";
import { clearTokens, readAccessToken, readRefreshToken, writeTokens } from "./authStorage";
import {
  buildOrderPayload,
  canContinueConsult,
  canSubmitAddress,
  CHECKOUT_DEFAULTS,
  firstName,
  skuForQty,
  STATES,
  stepFromPath,
} from "./checkout";
import { mergeEnvSource, readEnv } from "./env";
import { discount, FALLBACK_PACKS, FALLBACK_PROGRAMS, formatInr, packByQty, programByKey } from "./money";
import { emptyAnswers, quizDone, toggleAnswer } from "./quiz";
import { greeting, isStaffRole, statusClass, STATUS_LABEL } from "./status";
import { cn } from "./utils";

const memory = {
  data: {} as Record<string, string>,
  getItem(key: string) {
    return this.data[key] || null;
  },
  setItem(key: string, value: string) {
    this.data[key] = value;
  },
  removeItem(key: string) {
    delete this.data[key];
  },
};

describe("lib", () => {
  test("class names merge", () => {
    expect(cn("px-2", "px-4")).toBe("px-4");
  });

  test("env fallbacks", () => {
    expect(readEnv({}).apiBaseUrl).toContain("localhost");
    expect(readEnv({ VITE_API_BASE_URL: "https://x", VITE_RAZORPAY_KEY_ID: "k", VITE_APP_ENV: "prod" }).appEnv).toBe(
      "prod",
    );
    expect(readEnv({ VITE_APP_ENV: "prod" }).apiBaseUrl).toBe("");
    expect(
      mergeEnvSource(
        { VITE_API_BASE_URL: "http://localhost:5012/api/v1", VITE_APP_ENV: "prod" },
        { VITE_API_BASE_URL: "https://api.slowmo.jahbyte.com/api/v1" },
      ).VITE_API_BASE_URL,
    ).toBe("https://api.slowmo.jahbyte.com/api/v1");
    expect(mergeEnvSource({ VITE_API_BASE_URL: "https://from-vite" }, undefined).VITE_API_BASE_URL).toBe(
      "https://from-vite",
    );
    expect(
      mergeEnvSource({ VITE_RAZORPAY_KEY_ID: "vite-key" }, { VITE_RAZORPAY_KEY_ID: "rt-key" }).VITE_RAZORPAY_KEY_ID,
    ).toBe("rt-key");
    expect(mergeEnvSource({ VITE_APP_ENV: "dev" }, { VITE_APP_ENV: "prod" }).VITE_APP_ENV).toBe("prod");
  });

  test("money helpers", () => {
    expect(formatInr(3390)).toContain("3,390");
    expect(packByQty(FALLBACK_PACKS, 30).sku).toBe("SM-MB-30");
    expect(packByQty([], 10).sku).toBe("SM-MB-10");
    expect(discount(FALLBACK_PACKS[0])).toBe(500);
    expect(programByKey(FALLBACK_PROGRAMS, null)).toBeUndefined();
    expect(programByKey(FALLBACK_PROGRAMS, "sleep30")?.name).toBe("Sleep 30");
  });

  test("checkout helpers", () => {
    expect(STATES).toHaveLength(10);
    expect(stepFromPath("/program")).toBe(2);
    expect(stepFromPath("/consult")).toBe(3);
    expect(stepFromPath("/address")).toBe(4);
    expect(stepFromPath("/confirmation")).toBe(5);
    expect(stepFromPath("/preorder")).toBe(1);
    expect(skuForQty(15)).toBe("SM-MB-15");
    expect(skuForQty(30)).toBe("SM-MB-30");
    expect(skuForQty(10)).toBe("SM-MB-10");
    expect(firstName("")).toBe("friend");
    expect(firstName("Priya Sharma")).toBe("Priya");
    expect(canContinueConsult(CHECKOUT_DEFAULTS, "rx")).toBe(false);
    expect(
      canContinueConsult(
        { ...CHECKOUT_DEFAULTS, consultName: "A", consultPhone: "1", consultEmail: "a@b.com" },
        "book",
      ),
    ).toBe(true);
    expect(canContinueConsult({ ...CHECKOUT_DEFAULTS, rxFileId: 1 }, "rx")).toBe(true);
    expect(canSubmitAddress(CHECKOUT_DEFAULTS)).toBe(false);
    expect(
      canSubmitAddress({
        ...CHECKOUT_DEFAULTS,
        name: "A",
        phone: "1",
        address: "x",
        city: "y",
        pincode: "1",
        ageConfirmed: true,
      }),
    ).toBe(true);
    expect(
      buildOrderPayload({ ...CHECKOUT_DEFAULTS, program: "sleep30", programSkipped: true }).program_key,
    ).toBeNull();
    expect(buildOrderPayload({ ...CHECKOUT_DEFAULTS, rxFileId: 9 }).consult).toBeNull();
    expect(buildOrderPayload(CHECKOUT_DEFAULTS).consult).toBeTruthy();
  });

  test("quiz and status", () => {
    const next = toggleAnswer([[], [], []], 0, 1);
    expect(next[0]).toEqual([1]);
    expect(toggleAnswer([[1], [], []], 0, 1)[0]).toEqual([]);
    expect(emptyAnswers()).toHaveLength(3);
    expect(quizDone(3)).toBe(true);
    expect(quizDone(0)).toBe(false);
    expect(STATUS_LABEL.consult).toContain("consult");
    expect(statusClass("consult")).toBe("status-consult");
    expect(statusClass("pending_payment")).toBe("status-consult");
    expect(statusClass("confirmed")).toBe("status-confirmed");
    expect(statusClass("dispatched")).toBe("status-dispatched");
    expect(statusClass("delivered")).toBe("status-delivered");
    expect(statusClass("hold")).toBe("status-hold");
    expect(isStaffRole("founder")).toBe(true);
    expect(isStaffRole("customer")).toBe(false);
    expect(greeting("Meera Iyer", 8)).toContain("morning");
    expect(greeting("", 13)).toContain("afternoon");
    expect(greeting("A", 20)).toContain("evening");
  });

  test("auth storage", () => {
    writeTokens("a", "b", memory);
    expect(readAccessToken(memory)).toBe("a");
    expect(readRefreshToken(memory)).toBe("b");
    clearTokens(memory);
    expect(readAccessToken(memory)).toBe("");
  });

  test("api client interceptors", async () => {
    const calls: string[] = [];
    const client = createApi("http://x", () => "tok");
    client.defaults.adapter = async (config) => {
      calls.push(String(config.headers?.Authorization));
      if (config.url === "/fail") {
        return Promise.reject({ response: { status: 401 }, config, isAxiosError: true });
      }
      if (config.url === "/silent-fail") {
        return Promise.reject({ response: { status: 401 }, config: { ...config, silent: true }, isAxiosError: true });
      }
      if (config.url === "/boom") {
        return Promise.reject({ response: { status: 500 }, config, isAxiosError: true });
      }
      if (config.url === "/bare") {
        return Promise.reject({ isAxiosError: true });
      }
      return { data: { ok: true }, status: 200, statusText: "ok", headers: {}, config };
    };
    await client.get("/ok");
    expect(calls[0]).toContain("Bearer tok");
    await expect(client.get("/fail")).rejects.toBeTruthy();
    await expect(client.get("/silent-fail")).rejects.toBeTruthy();
    await expect(client.get("/boom")).rejects.toBeTruthy();
    await expect(client.get("/bare")).rejects.toBeTruthy();
    const bare = createApi("http://x", () => "");
    bare.defaults.adapter = async (config) => ({ data: {}, status: 200, statusText: "ok", headers: {}, config });
    await bare.get("/ok");
    const fromEnv = createApi(undefined, () => "");
    let seenBase = "";
    fromEnv.defaults.adapter = async (config) => {
      seenBase = String(config.baseURL || "");
      return { data: {}, status: 200, statusText: "ok", headers: {}, config };
    };
    await fromEnv.get("/ok");
    expect(seenBase).toBeTruthy();
    writeTokens("z", "y");
    expect(readAccessToken()).toBe("z");
    expect(readRefreshToken()).toBe("y");
    clearTokens();
    expect(readAccessToken()).toBe("");
    expect(readRefreshToken()).toBe("");
  });

  test("auth request helpers", async () => {
    const { setEnv } = await import("./env");
    expect(setEnv({ VITE_API_BASE_URL: "http://x", VITE_RAZORPAY_KEY_ID: "k", VITE_APP_ENV: "prod" }).appEnv).toBe(
      "prod",
    );
    const pair = {
      access_token: "a",
      refresh_token: "b",
      user: { id: 1, email: "a", name: "A", phone: "", role: "customer", initials: "A" },
    };
    const challenge = {
      requires_2fa: true,
      challenge_id: "c",
      email_hint: "a***@b.com",
      message: "m",
      debug_code: "123456",
    };
    (api.post as jest.Mock) = jest
      .fn()
      .mockResolvedValueOnce({ data: challenge })
      .mockResolvedValueOnce({ data: challenge })
      .mockResolvedValueOnce({ data: pair })
      .mockResolvedValueOnce({ data: { message: "ok" } })
      .mockResolvedValueOnce({ data: { message: "ok" } })
      .mockResolvedValueOnce({ data: pair })
      .mockResolvedValueOnce({ data: pair })
      .mockResolvedValueOnce({});
    (api.get as jest.Mock) = jest.fn().mockResolvedValue({ data: pair.user });
    await loginRequest("a@b.com", "x");
    await loginRequest("a@b.com", "x", true);
    await verifyLoginRequest("c", "123456");
    await forgotPasswordRequest("a@b.com");
    await resetPasswordRequest("tok", "password1");
    await registerRequest({ email: "a@b.com", password: "x", name: "A" });
    await meRequest();
    await refreshRequest("r");
    await logoutRequest("r");
    expect(api.post).toHaveBeenCalled();
  });
});

jest.mock("axios", () => {
  const actual = jest.requireActual("axios");
  return {
    ...actual,
    create: () => {
      const handlers: { req?: (c: any) => any; resOk?: (r: any) => any; resErr?: (e: any) => any } = {};
      return {
        interceptors: {
          request: {
            use: (fn: any) => {
              handlers.req = fn;
            },
          },
          response: {
            use: (ok: any, err: any) => {
              handlers.resOk = ok;
              handlers.resErr = err;
            },
          },
        },
        defaults: { adapter: undefined as any },
        async get(url: string) {
          return this.request({ url, headers: {} });
        },
        async post(url: string) {
          return this.request({ url, headers: {} });
        },
        async request(config: any) {
          const next = handlers.req ? handlers.req(config) : config;
          try {
            const result = this.defaults.adapter
              ? await this.defaults.adapter(next)
              : { data: {}, status: 200, headers: {}, config: next };
            return handlers.resOk ? handlers.resOk(result) : result;
          } catch (error) {
            if (handlers.resErr) return handlers.resErr(error);
            throw error;
          }
        },
      };
    },
  };
});
