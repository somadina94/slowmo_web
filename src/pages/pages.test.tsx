import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderApp } from "../test/render";
import { maybePayRazorpay, openRazorpay, submitCheckout } from "./preorder/StepAddress";
import { finishAuth } from "./auth/AuthPages";
import { iconNames, Icon } from "../components/icons";
import { AyushBadge } from "../components/AyushBadge";
import { MoonMark } from "../components/MoonMark";
import { Sparkles } from "../components/Sparkles";
import { scrollToId } from "../components/Nav";
import { submitQuiz, useOrder, usePlaceOrder, useUploadRx, useVerifyPayment } from "../features/orders/hooks";
import {
  api,
  loginRequest,
  registerRequest,
  verifyLoginRequest,
  forgotPasswordRequest,
  resetPasswordRequest,
} from "../lib/api";
import { App } from "../app/App";
import { AppProviders } from "../app/providers";
import { useAdminMutation, useAdminQuery, useAdminRequest } from "../features/admin/hooks";
import { useRxObjectUrl } from "../features/orders/hooks";

jest.mock("../lib/api", () => {
  const actual = jest.requireActual("../lib/api");
  return {
    ...actual,
    api: {
      get: jest.fn(),
      post: jest.fn(),
      patch: jest.fn(),
    },
    loginRequest: jest.fn(),
    verifyLoginRequest: jest.fn(),
    forgotPasswordRequest: jest.fn(),
    resetPasswordRequest: jest.fn(),
    registerRequest: jest.fn(),
    logoutRequest: jest.fn().mockResolvedValue(undefined),
  };
});

const mockedApi = api as jest.Mocked<typeof api>;

const fullOrder = {
  id: 7,
  public_id: "SM-1",
  status: "dispatched",
  payment_method: "prepaid",
  payment_status: "paid",
  total: 3390,
  subtotal: 3890,
  discount: 500,
  program_key: "sleep30",
  program_skipped: false,
  age_confirmed: true,
  razorpay_order_id: "order_1",
  razorpay_payment_id: "pay_1",
  ship_name: "Priya Sharma",
  ship_phone: "9990001111",
  ship_email: "priya@example.com",
  ship_address: "12 Church Street",
  ship_city: "Bengaluru",
  ship_pincode: "560001",
  ship_state: "Karnataka",
  placed_at: "2026-09-12T10:00:00+00:00",
  items: [{ sku: "SM-MB-10", name: "Slow Mo Gummies · 10 pack", qty: 10, price: 3390, mrp: 3890 }],
  consult: {
    name: "Priya",
    phone: "999",
    email: "p@e.com",
    reason: "insomnia",
    slot: "Morning (9AM–12PM)",
    status: "completed",
    notes: "cleared",
  },
  rx_file: { id: 1, filename: "rx.png", mime: "image/png", size: 12, status: "issued" },
  prescription: { code: "RX-SM-1", dose: "1/day", duration: "30 days", status: "issued" },
  shipment: {
    stage: "transit",
    awb: "AWB1",
    carrier: "stub",
    pickup_id: "PU1",
    events: [{ stage: "packed", note: "packed at hub", created_at: "2026-09-12T11:00:00+00:00" }],
  },
  razorpay: { order_id: "order_1", amount: 339000, currency: "INR", key_id: "k" },
};

const sparseOrder = {
  public_id: "SM-2",
  status: "mystery",
  payment_method: "cod",
  payment_status: "cod",
  total: 0,
  program_skipped: true,
  age_confirmed: false,
  ship_name: "",
  ship_phone: "",
  placed_at: "not-a-date",
};

afterEach(() => {
  delete (globalThis as { Razorpay?: unknown }).Razorpay;
});

beforeEach(() => {
  mockedApi.get.mockImplementation(async (url: string) => {
    if (url === "/products")
      return {
        data: [
          { variants: [{ sku: "SM-MB-10", qty: 10, price: 3390, mrp: 3890, label: "10", description: "starter" }] },
        ],
      };
    if (url === "/programs")
      return { data: [{ key: "sleep30", name: "Sleep 30", description: "d", duration: "30", icon: "moon" }] };
    if (String(url).startsWith("/files/rx/")) return { data: new Blob(["img"], { type: "image/png" }) };
    if (url === "/orders")
      return { data: [{ public_id: "SM-1", status: "mystery", total: 3390, ship_name: "Priya", ship_phone: "1" }] };
    if (url === "/orders/SM-404") throw new Error("missing");
    if (url === "/orders/SM-SLOW") return new Promise(() => undefined);
    if (url === "/orders/SM-2") return { data: sparseOrder };
    if (url === "/orders/SM-3")
      return {
        data: {
          ...sparseOrder,
          public_id: "SM-3",
          shipment: { stage: "packed", awb: "", carrier: "stub", pickup_id: "" },
        },
      };
    if (String(url).startsWith("/orders/"))
      return { data: { ...fullOrder, public_id: String(url).slice("/orders/".length) } };
    if (String(url).includes("/admin/overview"))
      return {
        data: {
          greeting: "Good morning, Meera.",
          kpis: [
            { label: "A", value: "1", delta: "+1", type: "up" },
            { label: "B", value: "2", delta: "-1", type: "down" },
          ],
          recent: [{ id: "SM-1", name: "A", status: "consult", total: 1 }],
        },
      };
    if (String(url).includes("/admin/orders"))
      return { data: { orders: [{ id: "SM-1", name: "A", status: "weird", total: 1, city: "Bengaluru" }] } };
    if (String(url).includes("/admin/consults"))
      return { data: { consults: [{ id: "SM-1", name: "A", phone: "1", note: "x" }] } };
    if (String(url).includes("/admin/dispatch"))
      return { data: { columns: [{ key: "packed", label: "Packed", cards: [{ id: "SM-1", name: "A", city: "X" }] }] } };
    if (String(url).includes("/admin/analytics")) return { data: { kpis: [{ label: "Rev", value: "1" }] } };
    if (String(url).includes("/admin/customers"))
      return { data: { customers: [{ name: "A", email: "a@b.com", city: "X" }] } };
    if (String(url).includes("/admin/inventory"))
      return { data: { skus: [{ sku: "SM-MB-10", stock: 1, level: "hi" }], days_remaining: 18 } };
    if (String(url).includes("/admin/counts")) return { data: { orders: 2, consults: 1 } };
    return { data: {} };
  });
  mockedApi.post.mockResolvedValue({
    data: { public_id: "SM-9", razorpay: null, id: 1, filename: "rx.pdf", result: "fit" },
  });
  mockedApi.patch.mockResolvedValue({ data: {} });
});

test("landing interactions", async () => {
  renderApp("/");
  document.querySelectorAll(".nav-links .nav-link").forEach((link) => fireEvent.click(link));
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 60));
  });
  fireEvent.click(screen.getAllByText(/Preorder now/)[0]);
  fireEvent.click(screen.getByText(/Preorder —/));
  renderApp("/");
  fireEvent.click(screen.getByText("Falling asleep"));
  fireEvent.click(screen.getByText("Falling asleep"));
  fireEvent.click(screen.getByText("Falling asleep"));
  fireEvent.click(screen.getByText("Next"));
  fireEvent.click(screen.getByText("← Back"));
  fireEvent.click(screen.getByText("Next"));
  fireEvent.click(screen.getByText("Most nights"));
  fireEvent.click(screen.getByText("Next"));
  fireEvent.click(screen.getByText("Melatonin"));
  fireEvent.click(screen.getByText("See results"));
  expect(screen.getByText(/looks like a fit/)).toBeInTheDocument();
  fireEvent.click(screen.getByText("Preorder & book consult"));
  renderApp("/");
  fireEvent.click(screen.getByText("Falling asleep"));
  fireEvent.click(screen.getByText("Next"));
  fireEvent.click(screen.getByText("Most nights"));
  fireEvent.click(screen.getByText("Next"));
  fireEvent.click(screen.getByText("Melatonin"));
  fireEvent.click(screen.getByText("See results"));
  fireEvent.click(screen.getByText("Retake"));
  fireEvent.click(screen.getByText("Is Vijaya extract legal in India?"));
  fireEvent.click(screen.getByText("Is Vijaya extract legal in India?"));
  fireEvent.click(screen.getByText("Why do I need a consult?"));
  fireEvent.click(screen.getByText("Preorder & talk to a doctor"));
});

test("preorder product and program", () => {
  renderApp("/preorder");
  fireEvent.click(screen.getByText("15 pack"));
  fireEvent.click(screen.getByText("30 pack"));
  fireEvent.click(screen.getByText(/Continue to wellness program/));
  renderApp("/program");
  expect(screen.getByText("Pick a wellness program.")).toBeInTheDocument();
  fireEvent.click(screen.getByText("Continue"));
  fireEvent.click(screen.getByText("Sleep 30"));
  fireEvent.click(screen.getByText("Continue"));
  renderApp("/program");
  fireEvent.click(screen.getByText("Skip program →"));
});

test("consult and address", async () => {
  renderApp("/consult");
  fireEvent.change(screen.getByPlaceholderText("Full name"), { target: { value: "A" } });
  fireEvent.change(screen.getByPlaceholderText("Phone"), { target: { value: "1" } });
  fireEvent.change(screen.getByPlaceholderText("Email"), { target: { value: "a@b.com" } });
  fireEvent.change(screen.getByPlaceholderText("Sleep issue (optional)"), { target: { value: "x" } });
  fireEvent.click(screen.getByText("Morning (9AM–12PM)"));
  fireEvent.click(screen.getByText("Upload prescription"));
  const empty = document.querySelector("input[type=file]") as HTMLInputElement;
  fireEvent.change(empty, { target: { files: [] } });
  const file = new File(["x"], "rx.pdf", { type: "application/pdf" });
  fireEvent.change(empty, { target: { files: [file] } });
  await waitFor(() => expect(mockedApi.post).toHaveBeenCalled());
  expect(await screen.findByText(/PDF ready/)).toBeInTheDocument();
  mockedApi.post.mockRejectedValueOnce(new Error("upload failed"));
  const image = new File(["img"], "rx.png", { type: "image/png" });
  fireEvent.change(empty, { target: { files: [image] } });
  await waitFor(() => expect(mockedApi.post).toHaveBeenCalled());
  mockedApi.post.mockResolvedValue({
    data: { public_id: "SM-9", razorpay: null, id: 1, filename: "rx.pdf", result: "fit" },
  });
  fireEvent.change(empty, { target: { files: [image] } });
  await waitFor(() => expect(screen.getByAltText(/Prescription preview|rx/)).toBeInTheDocument());
  fireEvent.change(empty, { target: { files: [new File(["img2"], "rx2.png", { type: "image/png" })] } });
  fireEvent.click(screen.getByText("Book a consult"));
  fireEvent.click(screen.getByText("Continue"));
});

test("address submit", async () => {
  renderApp("/address");
  fireEvent.click(screen.getByText(/Confirm preorder/));
  fireEvent.change(screen.getByPlaceholderText("Full name"), { target: { value: "A" } });
  fireEvent.change(screen.getByPlaceholderText("Phone"), { target: { value: "1" } });
  fireEvent.change(screen.getByPlaceholderText("Email"), { target: { value: "a@b.com" } });
  fireEvent.change(screen.getByPlaceholderText("Address"), { target: { value: "line" } });
  fireEvent.change(screen.getByPlaceholderText("City"), { target: { value: "Bengaluru" } });
  fireEvent.change(screen.getByPlaceholderText("PIN code"), { target: { value: "560001" } });
  fireEvent.change(screen.getByDisplayValue("Karnataka"), { target: { value: "Delhi" } });
  fireEvent.click(screen.getByText("Cash on Delivery"));
  fireEvent.click(screen.getByText("UPI / Card / NetBanking"));
  fireEvent.click(screen.getByLabelText(/I confirm I am 21/));
  mockedApi.post.mockResolvedValue({
    data: { public_id: "SM-9", razorpay: { order_id: "o", amount: 1, key_id: "k" }, id: 1, filename: "rx.pdf" },
  });
  (globalThis as { Razorpay?: unknown }).Razorpay = class {
    constructor(opts: { handler: (r: { razorpay_payment_id: string; razorpay_signature: string }) => void }) {
      void opts.handler({ razorpay_payment_id: "p", razorpay_signature: "s" });
    }
    open() {
      return undefined;
    }
  };
  fireEvent.click(screen.getByText(/Confirm preorder/));
  await waitFor(() => expect(screen.getByText(/slow days/)).toBeInTheDocument());
});

test("confirmation and 404", () => {
  renderApp("/confirmation");
  expect(screen.getByText(/slow days/)).toBeInTheDocument();
  fireEvent.click(screen.getByText("Back to home"));
  renderApp("/nope");
  expect(screen.getByText(/take it slow/)).toBeInTheDocument();
});

test("auth pages", async () => {
  (loginRequest as jest.Mock).mockRejectedValueOnce(new Error("x"));
  renderApp("/login");
  fireEvent.change(screen.getByPlaceholderText("Email"), { target: { value: "a@b.com" } });
  fireEvent.change(screen.getByPlaceholderText("Password"), { target: { value: "pw" } });
  fireEvent.click(screen.getByText("Staff login"));
  fireEvent.click(screen.getByText("Continue"));
  await waitFor(() => expect(screen.getByText("Invalid credentials")).toBeInTheDocument());
  (loginRequest as jest.Mock).mockResolvedValue({
    requires_2fa: true,
    challenge_id: "ch1",
    email_hint: "a***@b.com",
    message: "code",
    debug_code: "123456",
  });
  fireEvent.click(screen.getByText("Continue"));
  await waitFor(() => expect(screen.getByText(/Check your email/)).toBeInTheDocument());
  fireEvent.change(screen.getByPlaceholderText("000000"), { target: { value: "12ab34xx" } });
  fireEvent.change(screen.getByPlaceholderText("000000"), { target: { value: "123456" } });
  (verifyLoginRequest as jest.Mock).mockRejectedValueOnce(new Error("bad"));
  fireEvent.click(screen.getByText(/Verify/));
  await waitFor(() => expect(screen.getByText(/Invalid or expired code/)).toBeInTheDocument());
  (verifyLoginRequest as jest.Mock).mockResolvedValue({
    access_token: "a",
    refresh_token: "b",
    user: { id: 1, email: "a", name: "A", phone: "", role: "customer", initials: "A" },
  });
  fireEvent.click(screen.getByText(/Verify/));
  await waitFor(() => expect(verifyLoginRequest).toHaveBeenCalled());
  renderApp("/login");
  (loginRequest as jest.Mock).mockResolvedValue({
    requires_2fa: true,
    challenge_id: "ch2",
    email_hint: "a***@b.com",
    message: "code",
  });
  fireEvent.change(screen.getByPlaceholderText("Email"), { target: { value: "a@b.com" } });
  fireEvent.change(screen.getByPlaceholderText("Password"), { target: { value: "pw" } });
  fireEvent.click(screen.getByText("Continue"));
  await waitFor(() => expect(screen.getByText(/Check your email/)).toBeInTheDocument());
  fireEvent.click(screen.getByText(/different account/));
  await waitFor(() => expect(screen.getByText("Continue")).toBeInTheDocument());
  (registerRequest as jest.Mock).mockRejectedValueOnce(new Error("x"));
  renderApp("/register");
  fireEvent.change(screen.getByPlaceholderText("Full name"), { target: { value: "A" } });
  fireEvent.change(screen.getByPlaceholderText("Email"), { target: { value: "a@b.com" } });
  fireEvent.change(screen.getByPlaceholderText("Password"), { target: { value: "pw" } });
  fireEvent.click(screen.getByText("Register"));
  await waitFor(() => expect(screen.getByText("x")).toBeInTheDocument());
  (registerRequest as jest.Mock).mockResolvedValue({
    access_token: "a",
    refresh_token: "b",
    user: { id: 1, email: "a", name: "A", phone: "", role: "founder", initials: "A" },
  });
  fireEvent.click(screen.getByText("Register"));
  await waitFor(() => expect(registerRequest).toHaveBeenCalledTimes(2));
  (forgotPasswordRequest as jest.Mock).mockResolvedValue({ message: "ok" });
  renderApp("/forgot-password");
  fireEvent.change(screen.getByPlaceholderText("Email"), { target: { value: "a@b.com" } });
  fireEvent.click(screen.getByText(/Send reset/));
  await waitFor(() => expect(screen.getByText(/If that email is registered/)).toBeInTheDocument());
  (forgotPasswordRequest as jest.Mock).mockRejectedValueOnce(new Error("x"));
  renderApp("/forgot-password");
  fireEvent.change(screen.getByPlaceholderText("Email"), { target: { value: "b@b.com" } });
  fireEvent.click(screen.getByText(/Send reset/));
  await waitFor(() => expect(screen.getByText(/If that email is registered/)).toBeInTheDocument());
  renderApp("/reset-password");
  fireEvent.change(screen.getByPlaceholderText(/New password/), { target: { value: "password1" } });
  fireEvent.click(screen.getByText(/Update password/));
  await waitFor(() => expect(screen.getByText(/Missing reset token/)).toBeInTheDocument());
  renderApp("/reset-password?token=tok");
  fireEvent.change(screen.getByPlaceholderText(/New password/), { target: { value: "password1" } });
  (resetPasswordRequest as jest.Mock).mockRejectedValueOnce(new Error("x"));
  fireEvent.click(screen.getByText(/Update password/));
  await waitFor(() => expect(screen.getByText(/Could not reset/)).toBeInTheDocument());
  (resetPasswordRequest as jest.Mock).mockResolvedValue({ message: "ok" });
  fireEvent.click(screen.getByText(/Update password/));
  await waitFor(() => expect(resetPasswordRequest).toHaveBeenCalled());
});

test("account and admin", async () => {
  renderApp("/account", "customer");
  expect(await screen.findByText("Your account")).toBeInTheDocument();
  fireEvent.click(screen.getByText("Priya Sharma"));
  fireEvent.click(screen.getByText("Toggle Sidebar"));
  fireEvent.click(screen.getByText("Log out"));
  renderApp("/account", "customer");
  fireEvent.click(screen.getByText(/Preorder —/));
  renderApp("/account");
  expect(screen.getByText("Welcome back.")).toBeInTheDocument();
  renderApp("/account/orders/SM-1");
  expect(screen.getByText("Welcome back.")).toBeInTheDocument();
  renderApp("/admin", "customer");
  expect(screen.getByText(/take it slow/)).toBeInTheDocument();
  renderApp("/", "founder");
  fireEvent.click(screen.getByText(/Preorder —/));
  renderApp("/", "founder");
  fireEvent.click(screen.getByText("Dashboard"));
  renderApp("/admin", "founder");
  expect(await screen.findByText(/Good morning/)).toBeInTheDocument();
  renderApp("/admin/orders", "founder");
  expect(await screen.findByText("Bengaluru")).toBeInTheDocument();
  fireEvent.click(await screen.findByText("hold"));
  renderApp("/admin/consults", "founder");
  fireEvent.click(await screen.findByText("Call now"));
  renderApp("/admin/dispatch", "founder");
  expect(await screen.findByText("Packed")).toBeInTheDocument();
  expect(await screen.findByText("A")).toBeInTheDocument();
  renderApp("/admin/analytics", "founder");
  expect(await screen.findByText("Rev")).toBeInTheDocument();
  renderApp("/admin/customers", "founder");
  expect(await screen.findByText("A · X")).toBeInTheDocument();
  renderApp("/admin/inventory", "founder");
  expect(await screen.findByText(/SM-MB-10/)).toBeInTheDocument();
  renderApp("/admin/orders", "founder");
  fireEvent.click(await screen.findByRole("link", { name: "SM-1" }));
  expect(await screen.findByText("Shipping address")).toBeInTheDocument();
  expect(screen.getByText("Issued prescription")).toBeInTheDocument();
  expect(screen.getByText("RX-SM-1")).toBeInTheDocument();
  expect(screen.getByText("packed at hub")).toBeInTheDocument();
  expect(await screen.findByAltText("rx.png")).toBeInTheDocument();
  fireEvent.click(screen.getByText("Mark Delivered"));
  renderApp("/admin/orders/SM-2", "founder");
  expect(await screen.findByText("No consult on this order.")).toBeInTheDocument();
  expect(screen.getByText("No line items.")).toBeInTheDocument();
  expect(screen.getByText("No shipment yet.")).toBeInTheDocument();
  renderApp("/admin/orders/SM-3", "founder");
  expect(await screen.findByText("No tracking events yet.")).toBeInTheDocument();
  renderApp("/admin/orders/SM-404", "founder");
  expect(await screen.findByText("This order could not be found.")).toBeInTheDocument();
  fireEvent.click(screen.getByText("Back"));
  renderApp("/admin/orders/SM-SLOW", "founder");
  expect(await screen.findByText("Loading order…")).toBeInTheDocument();
  renderApp("/account/orders/SM-1", "customer");
  expect(await screen.findByText("12 Church Street")).toBeInTheDocument();
  renderApp("/account", "customer");
  fireEvent.click(await screen.findByRole("link", { name: "SM-1" }));
  expect(await screen.findByText("Shipping address")).toBeInTheDocument();
  mockedApi.get.mockResolvedValue({ data: {} });
  renderApp("/admin", "founder");
  expect((await screen.findAllByText("Dashboard")).length).toBeGreaterThan(0);
  renderApp("/admin/orders", "founder");
  renderApp("/admin/consults", "founder");
  renderApp("/admin/dispatch", "founder");
  renderApp("/admin/analytics", "founder");
  renderApp("/admin/customers", "founder");
  renderApp("/admin/inventory", "founder");
  expect(await screen.findByText(/Stock lasts 0/)).toBeInTheDocument();
  renderApp("/admin", false);
  expect(screen.getByText("Welcome back.")).toBeInTheDocument();
});

test("helpers, hooks, and chrome", async () => {
  (globalThis as { Razorpay?: unknown }).Razorpay = class {
    constructor(opts: { handler: (r: { razorpay_payment_id: string; razorpay_signature: string }) => void }) {
      void opts.handler({ razorpay_payment_id: "p", razorpay_signature: "s" });
    }
    open() {
      return undefined;
    }
  };
  openRazorpay({ key: "k", amount: 1, order_id: "o", handler: () => undefined });
  await submitCheckout(
    false,
    async () => ({ public_id: "skip" }),
    async () => null,
    jest.fn(),
    jest.fn(),
  );
  const onDone = jest.fn();
  await submitCheckout(
    true,
    async () => ({ public_id: "SM-GO" }),
    async () => null,
    jest.fn(),
    onDone,
  );
  expect(onDone).toHaveBeenCalled();
  const payDone = jest.fn();
  await submitCheckout(
    true,
    async () => ({ public_id: "SM-PAY", razorpay: { order_id: "o", amount: 1, key_id: "k" } }),
    async () => null,
    jest.fn(),
    payDone,
  );
  expect(payDone).toHaveBeenCalled();
  await submitCheckout(
    true,
    async () => {
      throw new Error("place failed");
    },
    async () => null,
    jest.fn(),
    jest.fn(),
  );
  const id = await maybePayRazorpay({ public_id: "SM-1" }, async () => null);
  expect(id).toBe("SM-1");
  const handler = jest.fn();
  await maybePayRazorpay(
    { public_id: "SM-2", razorpay: { order_id: "o", amount: 1, key_id: "k" } },
    async () => null,
    (opts) => {
      void opts.handler({ razorpay_payment_id: "p", razorpay_signature: "s" });
      handler();
    },
  );
  expect(handler).toHaveBeenCalled();
  finishAuth({ access_token: "a", refresh_token: "b", user: { role: "ops" } }, jest.fn(), jest.fn());
  finishAuth({ access_token: "a", refresh_token: "b", user: { role: "customer" } }, jest.fn(), jest.fn());
  iconNames.forEach((name) => {
    const Cmp = Icon[name as keyof typeof Icon];
    render(<Cmp />);
  });
  render(<AyushBadge />);
  render(<AyushBadge variant="dark" />);
  render(<MoonMark />);
  render(<Sparkles items={[{ top: "1%", left: "1%" }]} />);
  document.body.innerHTML = '<div id="product"></div>';
  scrollToId("product");
  scrollToId("missing");
  mockedApi.post.mockResolvedValue({ data: { result: "fit" } });
  await expect(submitQuiz([[0]])).resolves.toBe("fit");

  function HookProbe() {
    const verify = useVerifyPayment();
    const place = usePlaceOrder();
    const upload = useUploadRx();
    const mutate = useAdminMutation("/admin/x", ["admin-x"]);
    const req = useAdminRequest();
    useAdminQuery(["idle"], "/idle", false);
    useAdminQuery(["live"], "/admin/counts", true);
    useOrder();
    useOrder("SM-1");
    useRxObjectUrl();
    useRxObjectUrl(1);
    return (
      <div>
        <button
          onClick={() =>
            void verify.mutateAsync({
              public_id: "SM-1",
              razorpay_order_id: "o",
              razorpay_payment_id: "p",
              razorpay_signature: "s",
            })
          }
        >
          verify
        </button>
        <button onClick={() => void place.mutateAsync({} as never)}>place</button>
        <button onClick={() => void upload.mutateAsync(new File(["x"], "a.pdf"))}>upload</button>
        <button onClick={() => void mutate.mutateAsync()}>admin</button>
        <button onClick={() => void req.mutateAsync({ path: "/admin/x" })}>req</button>
      </div>
    );
  }
  const client = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } });
  render(
    <QueryClientProvider client={client}>
      <HookProbe />
    </QueryClientProvider>,
  );
  fireEvent.click(screen.getByText("verify"));
  fireEvent.click(screen.getByText("place"));
  fireEvent.click(screen.getByText("upload"));
  fireEvent.click(screen.getByText("admin"));
  fireEvent.click(screen.getByText("req"));
  await waitFor(() => expect(mockedApi.post).toHaveBeenCalled());

  render(
    <AppProviders>
      <App />
    </AppProviders>,
  );
});
