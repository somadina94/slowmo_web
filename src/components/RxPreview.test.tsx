import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { api } from "../lib/api";
import { RxPreview } from "./RxPreview";

jest.mock("../lib/api", () => ({
  api: { get: jest.fn() },
}));

const mockedApi = api as jest.Mocked<typeof api>;

function renderRx(fileId: number, mime: string, filename = "rx.png") {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={client}>
      <RxPreview fileId={fileId} mime={mime} filename={filename} />
    </QueryClientProvider>,
  );
}

test("rx preview states", async () => {
  mockedApi.get.mockImplementation((url) => {
    if (String(url).includes("/9")) return Promise.reject(new Error("missing"));
    if (String(url).includes("/8")) return new Promise(() => undefined);
    return Promise.resolve({ data: new Blob(["x"], { type: "image/png" }) } as never);
  });
  renderRx(8, "image/png");
  expect(await screen.findByText("Loading prescription…")).toBeInTheDocument();
  cleanup();
  renderRx(9, "image/png");
  expect(await screen.findByText("Could not load prescription file.")).toBeInTheDocument();
  cleanup();
  renderRx(1, "image/png", "rx.png");
  expect(await screen.findByAltText("rx.png")).toBeInTheDocument();
  cleanup();
  renderRx(2, "application/pdf", "rx.pdf");
  expect(await screen.findByTitle("rx.pdf")).toBeInTheDocument();
  expect(screen.getByText("Open rx.pdf")).toBeInTheDocument();
  cleanup();
  renderRx(2, "application/pdf", "");
  expect(await screen.findByTitle("Prescription")).toBeInTheDocument();
  expect(screen.getByText("Open file")).toBeInTheDocument();
  cleanup();
  renderRx(3, "image/jpeg", "");
  await waitFor(() => expect(screen.getByAltText("Prescription")).toBeInTheDocument());
  cleanup();
  renderRx(0, "image/png");
  expect(await screen.findByText("Could not load prescription file.")).toBeInTheDocument();
});
