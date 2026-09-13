export function nextStatuses(status: string): string[] {
  const allowed: Record<string, string[]> = {
    pending_payment: ["cancelled"],
    consult: ["confirmed", "hold", "cancelled"],
    confirmed: ["hold", "cancelled"],
    dispatched: ["delivered"],
    hold: ["consult", "confirmed", "cancelled"],
  };
  return allowed[status] || [];
}

export function nextShipmentStage(stage: string): string | null {
  const order = ["packed", "picked", "transit", "delivered"];
  const index = order.indexOf(stage);
  if (index < 0 || index >= order.length - 1) return null;
  return order[index + 1];
}

export function isImageMime(mime: string | null | undefined): boolean {
  return Boolean(mime?.startsWith("image/"));
}
