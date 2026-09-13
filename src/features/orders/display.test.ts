import {
  dash,
  formatBytes,
  formatPlacedAt,
  paymentMethodLabel,
  paymentStatusLabel,
  programLabel,
  statusLabel,
  titleize,
  yesNo,
} from "./display";

test("order display helpers", () => {
  expect(dash(0)).toBe("0");
  expect(dash("")).toBe("—");
  expect(dash(null)).toBe("—");
  expect(dash(undefined)).toBe("—");
  expect(dash("SM-1")).toBe("SM-1");
  expect(titleize("")).toBe("—");
  expect(titleize(undefined)).toBe("—");
  expect(titleize("pending_verify")).toBe("Pending Verify");
  expect(statusLabel("consult")).toBe("Pending consult");
  expect(statusLabel("mystery")).toBe("Mystery");
  expect(formatPlacedAt("")).toBe("—");
  expect(formatPlacedAt("not-a-date")).toBe("not-a-date");
  expect(formatPlacedAt("2026-09-12T10:00:00+00:00")).toMatch(/2026|12|Sep/);
  expect(paymentMethodLabel("prepaid")).toBe("UPI / Card / NetBanking");
  expect(paymentMethodLabel("cod")).toBe("Cash on Delivery");
  expect(paymentMethodLabel("wire")).toBe("wire");
  expect(paymentMethodLabel("")).toBe("—");
  expect(paymentStatusLabel("paid")).toBe("Paid");
  expect(paymentStatusLabel("pending")).toBe("Pending");
  expect(paymentStatusLabel("cod")).toBe("Cash on Delivery");
  expect(paymentStatusLabel("refunded")).toBe("refunded");
  expect(paymentStatusLabel("")).toBe("—");
  expect(programLabel("sleep30", false)).toBe("Sleep 30");
  expect(programLabel("unknown", false)).toBe("unknown");
  expect(programLabel(null, false)).toBe("None");
  expect(programLabel("sleep30", true)).toBe("Skipped");
  expect(yesNo(true)).toBe("Yes");
  expect(yesNo(false)).toBe("No");
  expect(formatBytes(undefined)).toBe("—");
  expect(formatBytes(12)).toBe("12 B");
  expect(formatBytes(2048)).toBe("2.0 KB");
});
