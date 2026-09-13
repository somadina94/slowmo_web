import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { cleanup, render } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { AppRoutes } from "../app/App";
import { makeStore } from "../app/store";
import { clearSession, setSession } from "../features/auth/authSlice";
import { patchDraft } from "../features/checkout/checkoutSlice";
import { clearTokens } from "../lib/authStorage";
import { CheckoutDraft } from "../lib/checkout";

type Role = false | "founder" | "customer" | "admin" | "ops" | "clinician";

export function renderApp(path = "/", role: Role = false, draft?: Partial<CheckoutDraft>) {
  cleanup();
  clearTokens();
  const store = makeStore();
  store.dispatch(clearSession());
  if (role) {
    const staff = role !== "customer";
    store.dispatch(
      setSession({
        user: {
          id: 1,
          email: staff ? "meera@slowmo.co" : "priya@example.com",
          name: staff ? "Meera Iyer" : "Priya Sharma",
          phone: "",
          role,
          initials: staff ? "MI" : "PS",
        },
        accessToken: "a",
        refreshToken: "b",
      }),
    );
  }
  if (draft) store.dispatch(patchDraft(draft));
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return {
    store,
    ...render(
      <Provider store={store}>
        <QueryClientProvider client={client}>
          <MemoryRouter initialEntries={[path]}>
            <AppRoutes />
          </MemoryRouter>
        </QueryClientProvider>
      </Provider>,
    ),
  };
}
