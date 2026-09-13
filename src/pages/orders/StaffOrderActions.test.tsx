import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { makeStore } from "../../app/store";
import { setSession } from "../../features/auth/authSlice";
import { api } from "../../lib/api";
import { StaffOrderActions } from "./StaffOrderActions";
import type { OrderDto } from "../../features/orders/hooks";

jest.mock("../../lib/api", () => ({
  api: { get: jest.fn(), post: jest.fn(), patch: jest.fn() },
}));

const mockedApi = api as jest.Mocked<typeof api>;

const base: OrderDto = {
  public_id: "SM-4",
  status: "consult",
  total: 3390,
  ship_name: "A",
  ship_phone: "1",
  consult: { name: "A", phone: "1", email: "a@b.com", reason: "", slot: "", status: "scheduled", notes: "" },
  rx_file: { id: 3, filename: "rx.png", mime: "image/png", size: 10, status: "pending_verify" },
};

function renderActions(order: OrderDto) {
  const store = makeStore();
  store.dispatch(
    setSession({
      user: { id: 1, email: "meera@slowmo.co", name: "Meera", phone: "", role: "founder", initials: "MI" },
      accessToken: "a",
      refreshToken: "b",
    }),
  );
  const client = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } });
  return render(
    <Provider store={store}>
      <QueryClientProvider client={client}>
        <StaffOrderActions order={order} />
      </QueryClientProvider>
    </Provider>,
  );
}

test("staff order actions", async () => {
  mockedApi.post.mockResolvedValue({ data: {} });
  mockedApi.patch.mockResolvedValue({ data: {} });
  renderActions(base);
  fireEvent.click(screen.getByText("Mark Confirmed"));
  fireEvent.click(screen.getByText("Complete consult"));
  fireEvent.click(screen.getByText("Accept Rx"));
  fireEvent.click(screen.getByText("Reject Rx"));
  await waitFor(() => expect(mockedApi.post).toHaveBeenCalled());
  cleanup();
  renderActions({
    ...base,
    status: "confirmed",
    consult: { ...base.consult!, status: "completed" },
    rx_file: { ...base.rx_file!, status: "issued" },
    shipment: undefined,
  });
  fireEvent.click(screen.getByText("Create shipment"));
  cleanup();
  renderActions({
    ...base,
    status: "dispatched",
    consult: { ...base.consult!, status: "completed" },
    rx_file: { ...base.rx_file!, status: "issued" },
    shipment: { stage: "packed", awb: "", carrier: "stub", pickup_id: "", events: [] },
  });
  fireEvent.click(screen.getByText("Move to Picked"));
  fireEvent.click(screen.getByText("Schedule pickup"));
  await waitFor(() => expect(mockedApi.patch).toHaveBeenCalled());
  mockedApi.post.mockImplementation(() => new Promise(() => undefined));
  cleanup();
  renderActions({
    ...base,
    status: "dispatched",
    consult: undefined,
    rx_file: undefined,
    shipment: { stage: "transit", awb: "1", carrier: "stub", pickup_id: "P", events: [] },
  });
  fireEvent.click(screen.getByText("Mark Delivered"));
  expect(await screen.findAllByLabelText("Loading")).toBeTruthy();
});
