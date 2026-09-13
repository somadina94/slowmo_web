import { setSession, setUser, clearSession, authReducer } from "./auth/authSlice";
import { checkoutReducer, patchDraft, resetDraft } from "./checkout/checkoutSlice";
import { setConsultMode, setOrderFilter, setRevenueRange, uiReducer } from "./ui/uiSlice";
import { mapPrograms, mapVariants } from "./catalog/hooks";
import { FALLBACK_PACKS, FALLBACK_PROGRAMS } from "../lib/money";
import { makeStore } from "../app/store";
import { createQueryClient } from "../app/providers";

test("auth slice", () => {
  const user = { id: 1, email: "a@b.com", name: "A", phone: "", role: "customer", initials: "A" };
  let state = authReducer(undefined, setSession({ user, accessToken: "a", refreshToken: "b" }));
  expect(state.accessToken).toBe("a");
  expect(state.status).toBe("ready");
  state = authReducer(state, setUser(user));
  expect(state.user?.email).toBe("a@b.com");
  state = authReducer(state, clearSession());
  expect(state.user).toBeNull();
  expect(state.status).toBe("ready");
});

test("checkout and ui slices", () => {
  let draft = checkoutReducer(undefined, patchDraft({ qty: 15, name: "Priya" }));
  expect(draft.sku).toBe("SM-MB-15");
  draft = checkoutReducer(draft, resetDraft());
  expect(draft.qty).toBe(10);
  let ui = uiReducer(undefined, setOrderFilter("hold"));
  ui = uiReducer(ui, setRevenueRange("today"));
  ui = uiReducer(ui, setConsultMode("rx"));
  expect(ui.consultMode).toBe("rx");
  expect(ui.revenueRange).toBe("today");
});

test("catalog mappers", () => {
  expect(mapVariants([])).toEqual(FALLBACK_PACKS);
  expect(mapVariants([{ variants: [] }])).toEqual(FALLBACK_PACKS);
  expect(
    mapVariants([{ variants: [{ sku: "X", qty: 10, price: 1, mrp: 2, label: "L", description: "d" }] }])[0].sku,
  ).toBe("X");
  expect(mapPrograms([])).toEqual(FALLBACK_PROGRAMS);
  expect(mapPrograms([{ key: "k", name: "n", description: "d", duration: "1", icon: "x" }])[0].key).toBe("k");
});

test("store and query client", () => {
  const store = makeStore();
  expect(store.getState().checkout.qty).toBe(10);
  expect(createQueryClient()).toBeTruthy();
});
