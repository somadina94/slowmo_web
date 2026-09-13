import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "sonner";
import { store } from "./store";

export function createQueryClient() {
  return new QueryClient({ defaultOptions: { queries: { retry: false } } });
}

export function AppProviders({
  children,
  client = createQueryClient(),
}: {
  children: React.ReactNode;
  client?: QueryClient;
}) {
  return (
    <Provider store={store}>
      <QueryClientProvider client={client}>
        <BrowserRouter>
          {children}
          <Toaster richColors position="top-center" />
        </BrowserRouter>
      </QueryClientProvider>
    </Provider>
  );
}
