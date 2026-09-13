import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { makeStore } from "../../app/store";
import { renderApp } from "../../test/render";
import { DashboardShell, displayInitials, isNavActive, pathTitle } from "./DashboardShell";
import { adminGroups } from "../../pages/admin/AdminPages";
import { logoutRequest } from "../../lib/api";

jest.mock("../../lib/api", () => {
  const actual = jest.requireActual("../../lib/api");
  return {
    ...actual,
    api: {
      get: jest.fn().mockResolvedValue({ data: {} }),
      post: jest.fn().mockResolvedValue({ data: {} }),
      patch: jest.fn().mockResolvedValue({ data: {} }),
    },
    logoutRequest: jest.fn().mockResolvedValue(undefined),
  };
});

test("dashboard titles and nav state", () => {
  expect(pathTitle("/admin/orders")).toBe("Orders");
  expect(pathTitle("/admin/orders/SM-1")).toBe("Order details");
  expect(pathTitle("/account/orders/SM-1")).toBe("Order details");
  expect(pathTitle("/admin/consults")).toBe("Consult queue");
  expect(pathTitle("/admin/dispatch")).toBe("Dispatch");
  expect(pathTitle("/admin/analytics")).toBe("Analytics");
  expect(pathTitle("/admin/customers")).toBe("Customers");
  expect(pathTitle("/admin/inventory")).toBe("Inventory");
  expect(pathTitle("/admin/team")).toBe("Team");
  expect(pathTitle("/admin")).toBe("");
  expect(pathTitle("/account")).toBe("");
  expect(isNavActive("/admin", "/admin", true)).toBe(true);
  expect(isNavActive("/admin/orders", "/admin", true)).toBe(false);
  expect(isNavActive("/admin/orders", "/admin/orders")).toBe(true);
  expect(isNavActive("/admin/orders/x", "/admin/orders")).toBe(true);
  expect(adminGroups().length).toBe(2);
  expect(adminGroups({ orders: 2, consults: 1 })[0].items[1].badge).toBe(2);
  expect(displayInitials({ initials: "mi", name: "Meera Iyer" })).toBe("MI");
  expect(displayInitials({ name: "Priya Sharma" })).toBe("PS");
  expect(displayInitials({ name: "Meera" })).toBe("ME");
  expect(displayInitials(null)).toBe("U");
  render(
    <Provider store={makeStore()}>
      <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
        <MemoryRouter>
          <DashboardShell groups={adminGroups()}>guest</DashboardShell>
        </MemoryRouter>
      </QueryClientProvider>
    </Provider>,
  );
  expect(screen.getByText("account")).toBeInTheDocument();
});

test("dashboard shell logout and trigger", async () => {
  renderApp("/admin", "founder");
  expect(screen.getAllByLabelText("Avatar MI").length).toBeGreaterThan(0);
  fireEvent.click(screen.getByText("Toggle Sidebar"));
  fireEvent.click(screen.getAllByText("slow mo™")[0]);
  fireEvent.click(screen.getByText("Home"));
  expect(screen.getByText(/take it slow/)).toBeInTheDocument();
  renderApp("/admin", "founder");
  fireEvent.click(screen.getByText("Log out"));
  await waitFor(() => expect(screen.getByText(/take it slow|Welcome back/)).toBeInTheDocument());
  renderApp("/admin", "founder");
  (logoutRequest as jest.Mock).mockRejectedValueOnce(new Error("offline"));
  fireEvent.click(screen.getByText("Log out"));
  await waitFor(() => expect(screen.getByText(/take it slow|Welcome back/)).toBeInTheDocument());
});
