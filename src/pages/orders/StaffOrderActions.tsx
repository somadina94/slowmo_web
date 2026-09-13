import { nextShipmentStage, nextStatuses } from "../../features/orders/actions";
import { useAdminRequest } from "../../features/admin/hooks";
import type { OrderDto } from "../../features/orders/hooks";
import { Button } from "../../components/ui/button";
import { PendingIcon } from "../../components/PendingIcon";
import { statusLabel, titleize } from "../../features/orders/display";

export function StaffOrderActions({ order }: { order: OrderDto }) {
  const action = useAdminRequest();
  const busy = action.isPending;
  const id = order.public_id;
  const statuses = nextStatuses(order.status);
  const shipNext = order.shipment ? nextShipmentStage(order.shipment.stage) : null;
  const consultOpen = order.consult && order.consult.status !== "completed";
  const rxPending = order.rx_file && order.rx_file.status === "pending_verify";
  const canShip = !order.shipment && order.status === "confirmed";
  const canPickup = Boolean(order.shipment && !order.shipment.pickup_id);

  const run = (path: string, success: string, body?: unknown, method?: "post" | "patch") => {
    void action.mutateAsync({ path, body, method, success });
  };

  return (
    <div className="flex flex-wrap gap-2">
      {statuses.map((status) => (
        <Button
          key={status}
          size="sm"
          variant="outline"
          disabled={busy}
          onClick={() => run(`/admin/orders/${id}/status`, `Marked ${statusLabel(status)}`, { status })}
        >
          <PendingIcon pending={busy} />
          Mark {statusLabel(status)}
        </Button>
      ))}
      {consultOpen ? (
        <Button
          size="sm"
          disabled={busy}
          onClick={() =>
            run(`/admin/consults/${id}/complete`, "Consult completed", { notes: "Completed from order details" })
          }
        >
          <PendingIcon pending={busy} />
          Complete consult
        </Button>
      ) : null}
      {rxPending ? (
        <>
          <Button
            size="sm"
            disabled={busy}
            onClick={() => run(`/admin/consults/${id}/verify-rx?accept=true`, "Prescription accepted")}
          >
            <PendingIcon pending={busy} />
            Accept Rx
          </Button>
          <Button
            size="sm"
            variant="outline"
            disabled={busy}
            onClick={() => run(`/admin/consults/${id}/verify-rx?accept=false`, "Prescription rejected")}
          >
            <PendingIcon pending={busy} />
            Reject Rx
          </Button>
        </>
      ) : null}
      {canShip ? (
        <Button size="sm" disabled={busy} onClick={() => run(`/admin/dispatch/${id}`, "Shipment created")}>
          <PendingIcon pending={busy} />
          Create shipment
        </Button>
      ) : null}
      {shipNext ? (
        <Button
          size="sm"
          disabled={busy}
          onClick={() => run(`/admin/dispatch/${id}`, `Moved to ${titleize(shipNext)}`, { stage: shipNext }, "patch")}
        >
          <PendingIcon pending={busy} />
          Move to {titleize(shipNext)}
        </Button>
      ) : null}
      {canPickup ? (
        <Button
          size="sm"
          variant="outline"
          disabled={busy}
          onClick={() => run(`/admin/dispatch/${id}/pickup`, "Pickup scheduled")}
        >
          <PendingIcon pending={busy} />
          Schedule pickup
        </Button>
      ) : null}
    </div>
  );
}
