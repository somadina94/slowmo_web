import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAppSelector } from "./store";
import { isStaffRole } from "../lib/status";

function BootGate({ children }: { children: ReactNode }) {
  const status = useAppSelector((state) => state.auth.status);
  if (status === "booting") {
    return <p className="p-6 text-sm text-muted-foreground">Restoring session…</p>;
  }
  return <>{children}</>;
}

export function RequireAuth({ children }: { children: ReactNode }) {
  const user = useAppSelector((state) => state.auth.user);
  return <BootGate>{!user ? <Navigate to="/login" replace /> : children}</BootGate>;
}

export function RequireStaff({ children }: { children: ReactNode }) {
  const user = useAppSelector((state) => state.auth.user);
  return (
    <BootGate>
      {!user ? <Navigate to="/login" replace /> : !isStaffRole(user.role) ? <Navigate to="/" replace /> : children}
    </BootGate>
  );
}
