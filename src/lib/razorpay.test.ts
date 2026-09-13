import { loadRazorpayScript, maybePayRazorpay, openRazorpay } from "./razorpay";
import { notifyError } from "./toast";
import { setEnv } from "./env";

jest.mock("./toast", () => ({
  notifyError: jest.fn(),
  notifySuccess: jest.fn(),
  errorMessage: (e: unknown) => String(e),
}));

afterEach(() => {
  delete (globalThis as { Razorpay?: unknown }).Razorpay;
  document.body.innerHTML = "";
  document.head.querySelectorAll('script[src*="checkout.razorpay.com"]').forEach((node) => node.remove());
});

test("openRazorpay requires checkout constructor", () => {
  expect(() => openRazorpay({ key: "k", amount: 1, order_id: "o", handler: () => undefined })).toThrow(/not loaded/);
  (globalThis as { Razorpay?: unknown }).Razorpay = class {
    constructor(_opts: Record<string, unknown>) {
      return undefined;
    }
    open() {
      return undefined;
    }
  };
  openRazorpay({ key: "k", amount: 1, order_id: "o", handler: () => undefined });
});

test("loadRazorpayScript resolves when already present", async () => {
  (globalThis as { Razorpay?: unknown }).Razorpay = class {
    open() {
      return undefined;
    }
  };
  await expect(loadRazorpayScript()).resolves.toBeUndefined();
});

test("loadRazorpayScript injects script and waits for load", async () => {
  const promise = loadRazorpayScript();
  const script = document.querySelector<HTMLScriptElement>('script[src*="checkout.razorpay.com"]');
  expect(script).toBeTruthy();
  (globalThis as { Razorpay?: unknown }).Razorpay = class {
    open() {
      return undefined;
    }
  };
  script!.onload?.(new Event("load"));
  await expect(promise).resolves.toBeUndefined();
});

test("loadRazorpayScript rejects on script error", async () => {
  const promise = loadRazorpayScript();
  const script = document.querySelector<HTMLScriptElement>('script[src*="checkout.razorpay.com"]');
  script!.onerror?.(new Event("error"));
  await expect(promise).rejects.toThrow(/Failed to load Razorpay/);
});

test("loadRazorpayScript reuses existing script tag", async () => {
  const existing = document.createElement("script");
  existing.src = "https://checkout.razorpay.com/v1/checkout.js";
  document.body.appendChild(existing);
  const promise = loadRazorpayScript();
  (globalThis as { Razorpay?: unknown }).Razorpay = class {
    open() {
      return undefined;
    }
  };
  existing.dispatchEvent(new Event("load"));
  await expect(promise).resolves.toBeUndefined();
});

test("loadRazorpayScript rejects when existing script errors", async () => {
  const existing = document.createElement("script");
  existing.src = "https://checkout.razorpay.com/v1/checkout.js";
  document.body.appendChild(existing);
  const promise = loadRazorpayScript();
  existing.dispatchEvent(new Event("error"));
  await expect(promise).rejects.toThrow(/Failed to load Razorpay/);
});

test("maybePayRazorpay skips when no razorpay payload", async () => {
  await expect(maybePayRazorpay({ public_id: "SM-1" }, async () => null)).resolves.toBe("SM-1");
});

test("maybePayRazorpay verifies and resolves", async () => {
  setEnv({ VITE_RAZORPAY_KEY_ID: "fallback_key" });
  (globalThis as { Razorpay?: unknown }).Razorpay = class {
    open() {
      return undefined;
    }
  };
  const verify = jest.fn().mockResolvedValue(null);
  const id = await maybePayRazorpay(
    { public_id: "SM-2", razorpay: { order_id: "o", amount: 1, key_id: "" } },
    verify,
    (opts) => {
      void opts.handler({ razorpay_payment_id: "p", razorpay_signature: "s" });
    },
  );
  expect(id).toBe("SM-2");
  expect(verify).toHaveBeenCalledWith({
    public_id: "SM-2",
    razorpay_order_id: "o",
    razorpay_payment_id: "p",
    razorpay_signature: "s",
  });
});

test("maybePayRazorpay rejects on verify failure and dismiss", async () => {
  (globalThis as { Razorpay?: unknown }).Razorpay = class {
    open() {
      return undefined;
    }
  };
  await expect(
    maybePayRazorpay(
      { public_id: "SM-3", razorpay: { order_id: "o", amount: 1, key_id: "k" } },
      async () => {
        throw new Error("bad");
      },
      (opts) => {
        void opts.handler({ razorpay_payment_id: "p", razorpay_signature: "s" });
      },
    ),
  ).rejects.toThrow("bad");

  await expect(
    maybePayRazorpay(
      { public_id: "SM-4", razorpay: { order_id: "o", amount: 1, key_id: "k", currency: "INR" } },
      async () => null,
      (opts) => {
        opts.modal?.ondismiss?.();
      },
    ),
  ).rejects.toThrow(/cancelled/);
  expect(notifyError).not.toHaveBeenCalled();
});
