export const STATUS_LABEL: Record<string, string> = {
  consult: "Pending consult",
  confirmed: "Confirmed",
  dispatched: "Dispatched",
  delivered: "Delivered",
  hold: "On hold",
  pending_payment: "Pending payment",
  cancelled: "Cancelled",
};

export function statusClass(status: string): string {
  if (status === "consult" || status === "pending_payment") return "status-consult";
  if (status === "confirmed") return "status-confirmed";
  if (status === "dispatched") return "status-dispatched";
  if (status === "delivered") return "status-delivered";
  return "status-hold";
}

export function isStaffRole(role: string): boolean {
  return ["founder", "ops", "clinician", "admin"].includes(role);
}

export function greeting(name: string, hour: number): string {
  const first = name.split(" ")[0] || "there";
  if (hour < 12) return `Good morning, ${first}.`;
  if (hour < 17) return `Good afternoon, ${first}.`;
  return `Good evening, ${first}.`;
}
