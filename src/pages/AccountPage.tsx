import { Package, UserRound } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAppSelector } from "../app/store";
import { useMyOrders } from "../features/orders/hooks";
import { DashboardShell } from "../components/dashboard/DashboardShell";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { formatInr } from "../lib/money";
import { STATUS_LABEL } from "../lib/status";
import { OrderDetail } from "./orders/OrderDetail";

export const accountGroups = [
  {
    label: "Account",
    items: [
      { to: "/account", label: "Overview", icon: UserRound, end: true },
      { to: "/account#orders", label: "Orders", icon: Package },
    ],
  },
];

export function AccountPage() {
  const user = useAppSelector((state) => state.auth.user);
  const { data = [] } = useMyOrders(Boolean(user));
  const navigate = useNavigate();
  const pendingConsults = data.filter((order) => order.status === "consult" || order.status === "pending_payment");
  return (
    <DashboardShell groups={accountGroups}>
      <div className="space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="font-display text-2xl">Your account</h2>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
          </div>
          <Button onClick={() => navigate("/preorder")}>Preorder — ₹3,390</Button>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardDescription>Orders</CardDescription>
              <CardTitle>{data.length}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardDescription>Pending consults</CardDescription>
              <CardTitle>{pendingConsults.length}</CardTitle>
            </CardHeader>
          </Card>
        </div>
        {pendingConsults.length > 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>Pending consultation</CardTitle>
              <CardDescription>Orders waiting for a doctor consult or payment before confirmation.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {pendingConsults.map((order) => (
                <Link
                  key={order.public_id}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-lg border p-3 hover:bg-accent"
                  to={`/account/orders/${order.public_id}`}
                >
                  <span className="font-mono text-sm">{order.public_id}</span>
                  <span className="text-sm">{STATUS_LABEL[order.status]}</span>
                </Link>
              ))}
            </CardContent>
          </Card>
        ) : null}
        <Card id="orders">
          <CardHeader>
            <CardTitle>Your orders</CardTitle>
            <CardDescription>Live status from Slow Mo ops.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((order) => (
                  <TableRow key={order.public_id}>
                    <TableCell className="font-mono">
                      <Link className="underline-offset-4 hover:underline" to={`/account/orders/${order.public_id}`}>
                        {order.public_id}
                      </Link>
                    </TableCell>
                    <TableCell>
                      {STATUS_LABEL[order.status] || order.status} · {formatInr(order.total)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}

export function AccountOrderPage() {
  return (
    <DashboardShell groups={accountGroups}>
      <OrderDetail backTo="/account" />
    </DashboardShell>
  );
}
