export const STATES = [
  "Karnataka",
  "Maharashtra",
  "Delhi",
  "Tamil Nadu",
  "Telangana",
  "Kerala",
  "West Bengal",
  "Uttar Pradesh",
  "Gujarat",
  "Rajasthan",
];

export const SLOTS = ["Morning (9AM–12PM)", "Afternoon (12–5PM)", "Evening (5–9PM)"];

export type CheckoutDraft = {
  qty: 10 | 15 | 30;
  sku: string;
  program: string | null;
  programSkipped: boolean;
  consultName: string;
  consultPhone: string;
  consultEmail: string;
  consultReason: string;
  consultSlot: string;
  rxFileId: number | null;
  rxFileName: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  pincode: string;
  state: string;
  payment: "cod" | "prepaid";
  ageConfirmed: boolean;
  orderId: string;
};

export const CHECKOUT_DEFAULTS: CheckoutDraft = {
  qty: 10,
  sku: "SM-MB-10",
  program: null,
  programSkipped: false,
  consultName: "",
  consultPhone: "",
  consultEmail: "",
  consultReason: "",
  consultSlot: "",
  rxFileId: null,
  rxFileName: "",
  name: "",
  phone: "",
  email: "",
  address: "",
  city: "",
  pincode: "",
  state: "Karnataka",
  payment: "cod",
  ageConfirmed: false,
  orderId: "",
};

export function stepFromPath(path: string): number {
  if (path.startsWith("/program")) return 2;
  if (path.startsWith("/consult")) return 3;
  if (path.startsWith("/address")) return 4;
  if (path.startsWith("/confirmation")) return 5;
  return 1;
}

export function canContinueConsult(draft: CheckoutDraft, mode: "book" | "rx"): boolean {
  if (mode === "rx") return Boolean(draft.rxFileId);
  return Boolean(draft.consultName && draft.consultPhone && draft.consultEmail);
}

export function canSubmitAddress(draft: CheckoutDraft): boolean {
  return Boolean(draft.name && draft.phone && draft.address && draft.city && draft.pincode && draft.ageConfirmed);
}

export function skuForQty(qty: number): string {
  if (qty === 15) return "SM-MB-15";
  if (qty === 30) return "SM-MB-30";
  return "SM-MB-10";
}

export function firstName(name: string): string {
  return name.trim().split(" ")[0] || "friend";
}

export function buildOrderPayload(draft: CheckoutDraft) {
  return {
    sku: draft.sku,
    program_key: draft.programSkipped ? null : draft.program,
    program_skipped: draft.programSkipped,
    consult: draft.rxFileId
      ? null
      : {
          name: draft.consultName,
          phone: draft.consultPhone,
          email: draft.consultEmail,
          reason: draft.consultReason,
          slot: draft.consultSlot,
        },
    rx_file_id: draft.rxFileId,
    address: {
      name: draft.name,
      phone: draft.phone,
      email: draft.email,
      line: draft.address,
      city: draft.city,
      pincode: draft.pincode,
      state: draft.state,
    },
    payment: draft.payment,
    age_confirmed: draft.ageConfirmed,
  };
}
