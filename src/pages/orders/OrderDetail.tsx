import { Link, useParams } from "react-router-dom";
import { useAppSelector } from "../../app/store";
import { useOrder, type OrderDto } from "../../features/orders/hooks";
import { RxPreview } from "../../components/RxPreview";
import { StaffOrderActions } from "./StaffOrderActions";
import {
  dash,
  formatBytes,
  formatPlacedAt,
  paymentMethodLabel,
  paymentStatusLabel,
  programLabel,
  titleize,
  yesNo,
} from "../../features/orders/display";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { formatInr } from "../../lib/money";
import { isStaffRole, STATUS_LABEL, statusClass } from "../../lib/status";

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <div className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">{label}</div>
      <div className="mt-1 break-words text-sm">{value}</div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  return (
    <Badge className={statusClass(status)} variant="secondary">
      {STATUS_LABEL[status] || status}
    </Badge>
  );
}

function EmptyNote({ children }: { children: string }) {
  return <p className="text-sm text-muted-foreground">{children}</p>;
}

export function OrderDetail({ backTo }: { backTo: string }) {
  const { publicId } = useParams();
  const { data, isLoading, isError } = useOrder(publicId);

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Loading order…</p>;
  }

  if (isError || !data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Order not found</CardTitle>
          <CardDescription>This order could not be found.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild variant="outline" size="sm">
            <Link to={backTo}>Back</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return <OrderDetailBody order={data} backTo={backTo} />;
}

export function OrderDetailBody({ order, backTo }: { order: OrderDto; backTo: string }) {
  const user = useAppSelector((state) => state.auth.user);
  const staff = Boolean(user && isStaffRole(user.role));
  const items = order.items || [];
  const shipment = order.shipment;
  const events = shipment?.events || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="font-display text-2xl leading-tight">{order.public_id}</h2>
            <StatusBadge status={order.status} />
          </div>
          <p className="mt-1 text-sm text-muted-foreground">Placed {formatPlacedAt(order.placed_at)}</p>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link to={backTo}>Back</Link>
        </Button>
      </div>
      {staff ? <StaffOrderActions order={order} /> : null}

      <div className="grid gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Summary</CardTitle>
            <CardDescription>Status, payment, and program.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <Field label="Internal ID" value={dash(order.id)} />
            <Field label="Status" value={STATUS_LABEL[order.status] || order.status} />
            <Field label="Payment method" value={paymentMethodLabel(order.payment_method)} />
            <Field label="Payment status" value={paymentStatusLabel(order.payment_status)} />
            <Field label="Program" value={programLabel(order.program_key, Boolean(order.program_skipped))} />
            <Field label="Age 21+ confirmed" value={yesNo(Boolean(order.age_confirmed))} />
            <Field label="Razorpay order" value={dash(order.razorpay_order_id)} />
            <Field label="Razorpay payment" value={dash(order.razorpay_payment_id)} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Totals</CardTitle>
            <CardDescription>What was charged for this order.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <Field label="Subtotal (MRP)" value={formatInr(order.subtotal ?? 0)} />
            <Field label="Discount" value={formatInr(order.discount ?? 0)} />
            <Field label="Total" value={formatInr(order.total)} />
            <Field label="Checkout amount" value={order.razorpay ? formatInr(order.razorpay.amount / 100) : "—"} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Items</CardTitle>
          <CardDescription>SKUs included in this preorder.</CardDescription>
        </CardHeader>
        <CardContent>
          {items.length ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>SKU</TableHead>
                  <TableHead>Item</TableHead>
                  <TableHead>Qty</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>MRP</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.sku}>
                    <TableCell className="font-mono">{item.sku}</TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.qty}</TableCell>
                    <TableCell>{formatInr(item.price)}</TableCell>
                    <TableCell>{formatInr(item.mrp)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <EmptyNote>No line items.</EmptyNote>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Shipping address</CardTitle>
            <CardDescription>Where this order will be delivered.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <Field label="Name" value={dash(order.ship_name)} />
            <Field label="Phone" value={dash(order.ship_phone)} />
            <Field label="Email" value={dash(order.ship_email)} />
            <Field label="Address" value={dash(order.ship_address)} />
            <Field label="City" value={dash(order.ship_city)} />
            <Field label="PIN code" value={dash(order.ship_pincode)} />
            <Field label="State" value={dash(order.ship_state)} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Consult</CardTitle>
            <CardDescription>Doctor booking attached to this order.</CardDescription>
          </CardHeader>
          <CardContent>
            {order.consult ? (
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Name" value={dash(order.consult.name)} />
                <Field label="Phone" value={dash(order.consult.phone)} />
                <Field label="Email" value={dash(order.consult.email)} />
                <Field label="Slot" value={dash(order.consult.slot)} />
                <Field label="Status" value={titleize(order.consult.status)} />
                <Field label="Reason" value={dash(order.consult.reason)} />
                <Field label="Clinician notes" value={dash(order.consult.notes)} />
              </div>
            ) : (
              <EmptyNote>No consult on this order.</EmptyNote>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Uploaded prescription</CardTitle>
            <CardDescription>File the customer sent in instead of a consult.</CardDescription>
          </CardHeader>
          <CardContent>
            {order.rx_file ? (
              <div className="space-y-4">
                <RxPreview fileId={order.rx_file.id} mime={order.rx_file.mime} filename={order.rx_file.filename} />
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="File" value={dash(order.rx_file.filename)} />
                  <Field label="Type" value={dash(order.rx_file.mime)} />
                  <Field label="Size" value={formatBytes(order.rx_file.size)} />
                  <Field label="Status" value={titleize(order.rx_file.status)} />
                </div>
              </div>
            ) : (
              <EmptyNote>No prescription file uploaded.</EmptyNote>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Issued prescription</CardTitle>
            <CardDescription>Rx written after consult or file review.</CardDescription>
          </CardHeader>
          <CardContent>
            {order.prescription ? (
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Code" value={dash(order.prescription.code)} />
                <Field label="Dose" value={dash(order.prescription.dose)} />
                <Field label="Duration" value={dash(order.prescription.duration)} />
                <Field label="Status" value={titleize(order.prescription.status)} />
              </div>
            ) : (
              <EmptyNote>No prescription issued yet.</EmptyNote>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Shipment</CardTitle>
          <CardDescription>Dispatch, carrier, and tracking events.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {shipment ? (
            <>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <Field label="Stage" value={titleize(shipment.stage)} />
                <Field label="Carrier" value={dash(shipment.carrier)} />
                <Field label="AWB" value={dash(shipment.awb)} />
                <Field label="Pickup ID" value={dash(shipment.pickup_id)} />
              </div>
              {events.length ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Stage</TableHead>
                      <TableHead>Note</TableHead>
                      <TableHead>When</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {events.map((event, index) => (
                      <TableRow key={`${event.stage}-${index}`}>
                        <TableCell>{titleize(event.stage)}</TableCell>
                        <TableCell>{dash(event.note)}</TableCell>
                        <TableCell>{formatPlacedAt(event.created_at)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <EmptyNote>No tracking events yet.</EmptyNote>
              )}
            </>
          ) : (
            <EmptyNote>No shipment yet.</EmptyNote>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
