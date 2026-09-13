import { env } from "./env";

const CHECKOUT_SCRIPT = "https://checkout.razorpay.com/v1/checkout.js";

export type RazorpayCheckoutPayload = {
  order_id: string;
  amount: number;
  currency?: string;
  key_id: string;
};

export type RazorpaySuccess = {
  razorpay_payment_id: string;
  razorpay_signature: string;
};

export type RazorpayOpenOptions = Record<string, unknown> & {
  key: string;
  amount: number;
  order_id: string;
  currency?: string;
  name?: string;
  description?: string;
  prefill?: { name?: string; email?: string; contact?: string };
  handler: (response: RazorpaySuccess) => void | Promise<void>;
  modal?: { ondismiss?: () => void };
};

type RazorpayCtor = new (opts: RazorpayOpenOptions) => { open: () => void };

function razorpayCtor(): RazorpayCtor | undefined {
  return (globalThis as { Razorpay?: RazorpayCtor }).Razorpay;
}

export function loadRazorpayScript(): Promise<void> {
  if (razorpayCtor()) return Promise.resolve();
  const existing = document.querySelector<HTMLScriptElement>(`script[src="${CHECKOUT_SCRIPT}"]`);
  if (existing) {
    return new Promise((resolve, reject) => {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error("Failed to load Razorpay")), { once: true });
    });
  }
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = CHECKOUT_SCRIPT;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Razorpay"));
    document.body.appendChild(script);
  });
}

export function openRazorpay(options: RazorpayOpenOptions) {
  const Ctor = razorpayCtor();
  if (!Ctor) throw new Error("Razorpay checkout is not loaded");
  new Ctor(options).open();
}

export async function maybePayRazorpay(
  order: { public_id: string; razorpay?: RazorpayCheckoutPayload | null },
  verify: (payload: {
    public_id: string;
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }) => Promise<unknown>,
  opener: (options: RazorpayOpenOptions) => void = openRazorpay,
  prefill?: { name?: string; email?: string; contact?: string },
) {
  if (!order.razorpay) return order.public_id;
  await loadRazorpayScript();
  const checkout = order.razorpay;
  return new Promise<string>((resolve, reject) => {
    opener({
      key: checkout.key_id || env.razorpayKeyId,
      amount: checkout.amount,
      currency: checkout.currency || "INR",
      name: "Slow Mo",
      description: `Order ${order.public_id}`,
      order_id: checkout.order_id,
      prefill,
      handler: async (response) => {
        try {
          await verify({
            public_id: order.public_id,
            razorpay_order_id: checkout.order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          });
          resolve(order.public_id);
        } catch (error) {
          reject(error);
        }
      },
      modal: {
        ondismiss: () => reject(new Error("Payment cancelled")),
      },
    });
  });
}
