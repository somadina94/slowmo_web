import { isImageMime, nextShipmentStage, nextStatuses } from "./actions";

test("order action helpers", () => {
  expect(nextStatuses("consult")).toEqual(["confirmed", "hold", "cancelled"]);
  expect(nextStatuses("pending_payment")).toEqual(["cancelled"]);
  expect(nextStatuses("confirmed")).toEqual(["hold", "cancelled"]);
  expect(nextStatuses("dispatched")).toEqual(["delivered"]);
  expect(nextStatuses("hold")).toEqual(["consult", "confirmed", "cancelled"]);
  expect(nextStatuses("mystery")).toEqual([]);
  expect(nextShipmentStage("packed")).toBe("picked");
  expect(nextShipmentStage("picked")).toBe("transit");
  expect(nextShipmentStage("transit")).toBe("delivered");
  expect(nextShipmentStage("delivered")).toBeNull();
  expect(nextShipmentStage("nope")).toBeNull();
  expect(isImageMime("image/png")).toBe(true);
  expect(isImageMime("application/pdf")).toBe(false);
  expect(isImageMime(undefined)).toBe(false);
});
