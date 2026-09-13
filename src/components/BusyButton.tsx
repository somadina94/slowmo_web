import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Spinner } from "./Spinner";
import { cn } from "../lib/utils";

type BusyButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  busy?: boolean;
  children: ReactNode;
};

export function BusyButton({
  busy = false,
  children,
  className,
  disabled,
  type = "button",
  ...props
}: BusyButtonProps) {
  return (
    <button
      type={type}
      className={cn("inline-flex items-center justify-center gap-2", className)}
      disabled={disabled || busy}
      {...props}
    >
      {busy ? <Spinner /> : null}
      {children}
    </button>
  );
}
