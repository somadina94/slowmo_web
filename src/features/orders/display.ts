import { FALLBACK_PROGRAMS, programByKey } from "../../lib/money";
import { STATUS_LABEL } from "../../lib/status";

export function dash(value: string | number | null | undefined): string {
  if (value === 0) return "0";
  if (value == null || value === "") return "—";
  return String(value);
}

export function titleize(value: string | null | undefined): string {
  if (!value) return "—";
  return value.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
}

export function statusLabel(status: string): string {
  return STATUS_LABEL[status] || titleize(status);
}

export function formatPlacedAt(iso: string | null | undefined): string {
  if (!iso) return "—";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
}

export function paymentMethodLabel(method: string | null | undefined): string {
  if (method === "prepaid") return "UPI / Card / NetBanking";
  if (method === "cod") return "Cash on Delivery";
  return method || "—";
}

export function paymentStatusLabel(status: string | null | undefined): string {
  if (status === "paid") return "Paid";
  if (status === "pending") return "Pending";
  if (status === "cod") return "Cash on Delivery";
  return status || "—";
}

export function programLabel(key: string | null | undefined, skipped: boolean): string {
  if (skipped) return "Skipped";
  const program = programByKey(FALLBACK_PROGRAMS, key ?? null);
  return program?.name || key || "None";
}

export function yesNo(value: boolean): string {
  return value ? "Yes" : "No";
}

export function formatBytes(size: number | null | undefined): string {
  if (size == null) return "—";
  if (size < 1024) return `${size} B`;
  return `${(size / 1024).toFixed(1)} KB`;
}
