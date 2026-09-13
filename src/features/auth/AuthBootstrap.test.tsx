import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { makeStore } from "../../app/store";
import { RequireAuth, RequireStaff } from "../../app/guards";
import { clearTokens, writeTokens } from "../../lib/authStorage";
import { AuthBootstrap } from "./AuthBootstrap";

jest.mock("../../lib/api", () => ({
  meRequest: jest.fn(),
  refreshRequest: jest.fn(),
}));

const { meRequest, refreshRequest } = jest.requireMock("../../lib/api") as {
  meRequest: jest.Mock;
  refreshRequest: jest.Mock;
};

afterEach(() => {
  cleanup();
  clearTokens();
  jest.clearAllMocks();
});

test("AuthBootstrap restores user from access token", async () => {
  writeTokens("access", "refresh");
  meRequest.mockResolvedValue({
    id: 1,
    email: "a@b.com",
    name: "A",
    phone: "",
    role: "founder",
    initials: "A",
  });
  const store = makeStore();
  render(
    <Provider store={store}>
      <AuthBootstrap />
    </Provider>,
  );
  await waitFor(() => expect(store.getState().auth.user?.email).toBe("a@b.com"));
  expect(store.getState().auth.status).toBe("ready");
});

test("AuthBootstrap refreshes when me fails", async () => {
  writeTokens("access", "refresh");
  meRequest.mockRejectedValue(new Error("expired"));
  refreshRequest.mockResolvedValue({
    access_token: "a2",
    refresh_token: "r2",
    user: { id: 1, email: "b@b.com", name: "B", phone: "", role: "customer", initials: "B" },
  });
  const store = makeStore();
  render(
    <Provider store={store}>
      <AuthBootstrap />
    </Provider>,
  );
  await waitFor(() => expect(store.getState().auth.user?.email).toBe("b@b.com"));
});

test("AuthBootstrap clears session when refresh fails", async () => {
  writeTokens("access", "refresh");
  meRequest.mockRejectedValue(new Error("expired"));
  refreshRequest.mockRejectedValue(new Error("bad"));
  const store = makeStore();
  render(
    <Provider store={store}>
      <AuthBootstrap />
    </Provider>,
  );
  await waitFor(() => expect(store.getState().auth.status).toBe("ready"));
  expect(store.getState().auth.user).toBeNull();
});

test("AuthBootstrap clears immediately when already ready without tokens", async () => {
  clearTokens();
  const store = makeStore();
  expect(store.getState().auth.status).toBe("ready");
  render(
    <Provider store={store}>
      <AuthBootstrap />
    </Provider>,
  );
  expect(store.getState().auth.user).toBeNull();
});

test("AuthBootstrap clears when booting with no tokens left", async () => {
  writeTokens("access", "refresh");
  const store = makeStore();
  expect(store.getState().auth.status).toBe("booting");
  clearTokens();
  render(
    <Provider store={store}>
      <AuthBootstrap />
    </Provider>,
  );
  await waitFor(() => expect(store.getState().auth.status).toBe("ready"));
  expect(store.getState().auth.user).toBeNull();
});

test("guards show restoring while auth is booting", () => {
  writeTokens("a", "b");
  meRequest.mockImplementation(() => new Promise(() => undefined));
  const store = makeStore();
  render(
    <Provider store={store}>
      <AuthBootstrap />
      <MemoryRouter>
        <Routes>
          <Route
            path="/"
            element={
              <RequireAuth>
                <div>Secret</div>
              </RequireAuth>
            }
          />
        </Routes>
      </MemoryRouter>
    </Provider>,
  );
  expect(screen.getByText(/Restoring session/)).toBeInTheDocument();
});

test("AuthBootstrap clears when me fails and refresh missing", async () => {
  writeTokens("access", "refresh");
  const store = makeStore();
  clearTokens();
  writeTokens("access-only", "");
  meRequest.mockRejectedValue(new Error("expired"));
  render(
    <Provider store={store}>
      <AuthBootstrap />
    </Provider>,
  );
  await waitFor(() => expect(store.getState().auth.status).toBe("ready"));
  expect(store.getState().auth.user).toBeNull();
});

test("RequireStaff redirects non-staff after boot", async () => {
  writeTokens("a", "b");
  meRequest.mockResolvedValue({
    id: 1,
    email: "c@b.com",
    name: "C",
    phone: "",
    role: "customer",
    initials: "C",
  });
  const store = makeStore();
  render(
    <Provider store={store}>
      <AuthBootstrap />
      <MemoryRouter initialEntries={["/admin"]}>
        <Routes>
          <Route path="/" element={<div>home</div>} />
          <Route
            path="/admin"
            element={
              <RequireStaff>
                <div>Staff only</div>
              </RequireStaff>
            }
          />
        </Routes>
      </MemoryRouter>
    </Provider>,
  );
  await waitFor(() => expect(screen.getByText("home")).toBeInTheDocument());
});
