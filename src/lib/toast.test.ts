import { toast } from "sonner";
import { errorMessage, notifyError, notifySuccess } from "./toast";

test("toast helpers", () => {
  expect(errorMessage({ response: { data: { detail: "Nope" } } })).toBe("Nope");
  expect(errorMessage({ response: { data: { detail: [{ msg: "Bad field" }] } } })).toBe("Bad field");
  expect(errorMessage({ response: { data: { detail: [{ msg: "" }] } } })).toBe("Something went wrong");
  expect(errorMessage({ response: { data: { detail: [{}] } } })).toBe("Something went wrong");
  expect(errorMessage({ response: { data: { detail: [] } } })).toBe("Something went wrong");
  expect(errorMessage({ message: "network" })).toBe("network");
  expect(errorMessage({})).toBe("Something went wrong");
  notifySuccess("Saved");
  notifyError("Broken");
  notifyError("");
  notifyError({ response: { data: { detail: "Server" } } });
  expect(toast.success).toHaveBeenCalledWith("Saved");
  expect(toast.error).toHaveBeenCalled();
});
