import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { cleanup, render } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { AppRoutes } from "../app/App";
import { makeStore } from "../app/store";
import { setSession } from "../features/auth/authSlice";
import { patchDraft } from "../features/checkout/checkoutSlice";
import { CheckoutDraft } from "../lib/checkout";

type Role = false | "founder" | "customer";

export function renderApp(path = "/", role: Role = false, draft?: Partial<CheckoutDraft>) {
  cleanup();
  const store = makeStore();
  if (role) {
    store.dispatch(
      setSession({
        user: {
          id: 1,
          email: role === "founder" ? "meera@slowmo.co" : "priya@example.com",
          name: role === "founder" ? "Meera Iyer" : "Priya Sharma",
          phone: "",
          role,
          initials: role === "founder" ? "MI" : "PS",
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
