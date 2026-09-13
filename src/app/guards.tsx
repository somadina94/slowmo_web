import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAppSelector } from "./store";
import { isStaffRole } from "../lib/status";

export function RequireAuth({ children }: { children: ReactNode }) {
  const user = useAppSelector((state) => state.auth.user);
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

export function RequireStaff({ children }: { children: ReactNode }) {
  const user = useAppSelector((state) => state.auth.user);
  if (!user) return <Navigate to="/login" replace />;
  if (!isStaffRole(user.role)) return <Navigate to="/" replace />;
  return <>{children}</>;
}
