import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../../lib/api";
import { notifySuccess } from "../../lib/toast";

export function useAdminQuery<T>(key: string[], path: string, enabled = true) {
  return useQuery({
    queryKey: key,
    queryFn: async () => {
      const { data } = await api.get<T>(path);
      return data;
    },
    enabled,
  });
}

export function useAdminMutation(path: string, invalidate: string[], success = "Saved") {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async (body?: unknown) => {
      const { data } = await api.post(path, body || {});
      return data;
    },
    onSuccess: () => {
      notifySuccess(success);
      void client.invalidateQueries({ queryKey: invalidate });
      void client.invalidateQueries({ queryKey: ["order"] });
    },
  });
}

export function useAdminRequest() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async (req: { path: string; body?: unknown; method?: "post" | "patch"; success?: string }) => {
      const send = req.method === "patch" ? api.patch : api.post;
      const { data } = await send(req.path, req.body ?? {});
      return { data, success: req.success || "Saved" };
    },
    onSuccess: (result) => {
      notifySuccess(result.success);
      void client.invalidateQueries({ queryKey: ["order"] });
      void client.invalidateQueries({ queryKey: ["admin-orders"] });
      void client.invalidateQueries({ queryKey: ["admin-consults"] });
      void client.invalidateQueries({ queryKey: ["admin-dispatch"] });
    },
  });
}
