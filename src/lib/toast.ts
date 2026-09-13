import { toast } from "sonner";

export function errorMessage(error: unknown): string {
  const err = error as { response?: { data?: { detail?: unknown } }; message?: string };
  const detail = err.response?.data?.detail;
  if (typeof detail === "string" && detail) return detail;
  if (Array.isArray(detail) && detail[0] && typeof detail[0] === "object" && "msg" in detail[0]) {
    return String((detail[0] as { msg?: string }).msg || "Something went wrong");
  }
  if (err.message) return err.message;
  return "Something went wrong";
}

export function notifySuccess(message: string) {
  toast.success(message);
}

export function notifyError(error: unknown) {
  if (typeof error === "string" && error) {
    toast.error(error);
    return;
  }
  toast.error(errorMessage(error));
}
