import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "../../lib/api";
import { buildOrderPayload, CheckoutDraft } from "../../lib/checkout";
import { notifySuccess } from "../../lib/toast";

export type OrderItemDto = {
  sku: string;
  name: string;
  qty: number;
  price: number;
  mrp: number;
};

export type ConsultDto = {
  name: string;
  phone: string;
  email: string;
  reason: string;
  slot: string;
  status: string;
  notes: string;
};

export type RxFileDto = {
  id: number;
  filename: string;
  mime: string;
  size: number;
  status: string;
};

export type PrescriptionDto = {
  code: string;
  dose: string;
  duration: string;
  status: string;
};

export type ShipmentEventDto = {
  stage: string;
  note: string;
  created_at: string;
};

export type ShipmentDto = {
  stage: string;
  awb: string;
  carrier: string;
  pickup_id: string;
  events: ShipmentEventDto[];
};

export type OrderDto = {
  id?: number;
  public_id: string;
  status: string;
  payment_method?: string;
  payment_status?: string;
  total: number;
  subtotal?: number;
  discount?: number;
  program_key?: string | null;
  program_skipped?: boolean;
  age_confirmed?: boolean;
  razorpay_order_id?: string;
  razorpay_payment_id?: string;
  ship_name: string;
  ship_phone: string;
  ship_email?: string;
  ship_address?: string;
  ship_city?: string;
  ship_pincode?: string;
  ship_state?: string;
  placed_at?: string;
  items?: OrderItemDto[];
  consult?: ConsultDto | null;
  rx_file?: RxFileDto | null;
  prescription?: PrescriptionDto | null;
  shipment?: ShipmentDto | null;
  razorpay?: { order_id: string; amount: number; currency: string; key_id: string } | null;
};

export function useMyOrders(enabled: boolean) {
  return useQuery({
    queryKey: ["my-orders"],
    queryFn: async () => {
      const { data } = await api.get<OrderDto[]>("/orders");
      return data;
    },
    enabled,
  });
}

export function useOrder(publicId?: string) {
  return useQuery({
    queryKey: ["order", publicId],
    queryFn: async () => {
      const { data } = await api.get<OrderDto>(`/orders/${publicId}`);
      return data;
    },
    enabled: Boolean(publicId),
  });
}

export function useRxObjectUrl(fileId?: number) {
  return useQuery({
    queryKey: ["rx-file", fileId],
    queryFn: async () => {
      const { data } = await api.get<Blob>(`/files/rx/${fileId}`, { responseType: "blob" });
      return URL.createObjectURL(data);
    },
    enabled: Boolean(fileId),
  });
}

export function usePlaceOrder() {
  return useMutation({
    mutationFn: async (draft: CheckoutDraft) => {
      const { data } = await api.post<OrderDto>("/orders", buildOrderPayload(draft));
      return data;
    },
    onSuccess: (order) => {
      notifySuccess(`Order ${order.public_id} placed`);
    },
  });
}

export function useUploadRx() {
  return useMutation({
    mutationFn: async (file: File) => {
      const body = new FormData();
      body.append("file", file);
      const { data } = await api.post<{ id: number; filename: string }>("/files/rx", body);
      return data;
    },
    onSuccess: () => {
      notifySuccess("Prescription uploaded");
    },
  });
}

export function useVerifyPayment() {
  return useMutation({
    mutationFn: async (payload: {
      public_id: string;
      razorpay_order_id: string;
      razorpay_payment_id: string;
      razorpay_signature: string;
    }) => {
      const { data } = await api.post<OrderDto>("/payments/razorpay/verify", payload);
      return data;
    },
    onSuccess: () => {
      notifySuccess("Payment confirmed");
    },
  });
}

export async function submitQuiz(answers: number[][]): Promise<string> {
  const { data } = await api.post<{ result: string }>("/quiz", { answers });
  return data.result;
}
