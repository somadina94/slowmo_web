import { Spinner } from "./Spinner";

export function PendingIcon({ pending }: { pending: boolean }) {
  return pending ? <Spinner /> : null;
}
