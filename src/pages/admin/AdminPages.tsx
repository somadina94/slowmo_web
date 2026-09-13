import { Link } from "react-router-dom";
import { BarChart3, Boxes, Home, Phone, ShoppingCart, Truck, Users } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../app/store";
import { useAdminMutation, useAdminQuery } from "../../features/admin/hooks";
import { setOrderFilter } from "../../features/ui/uiSlice";
import { DashboardShell, type DashNavGroup } from "../../components/dashboard/DashboardShell";
import { PendingIcon } from "../../components/PendingIcon";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { statusClass, STATUS_LABEL } from "../../lib/status";

export function adminGroups(counts?: { orders?: number; consults?: number }): DashNavGroup[] {
  return [
    {
      label: "Operations",
      items: [
        { to: "/admin", label: "Overview", icon: Home, end: true },
        { to: "/admin/orders", label: "Orders", icon: ShoppingCart, badge: counts?.orders },
        { to: "/admin/consults", label: "Consult queue", icon: Phone, badge: counts?.consults },
        { to: "/admin/dispatch", label: "Dispatch", icon: Truck },
      ],
    },
    {
      label: "Insights",
      items: [
        { to: "/admin/analytics", label: "Analytics", icon: BarChart3 },
        { to: "/admin/customers", label: "Customers", icon: Users },
        { to: "/admin/inventory", label: "Inventory", icon: Boxes },
      ],
    },
  ];
}

export function AdminShell() {
  const { data: counts } = useAdminQuery<{ orders: number; consults: number }>(["admin-counts"], "/admin/counts");
  return <DashboardShell groups={adminGroups(counts)} />;
}

export function StatusBadge({ status }: { status: string }) {
  return (
    <Badge className={statusClass(status)} variant="secondary">
      {STATUS_LABEL[status] || status}
    </Badge>
  );
}

export function AdminOverview() {
  const { data } = useAdminQuery<{
    greeting: string;
    kpis: { label: string; value: string; delta: string; type: string }[];
    recent: { id: string; name: string; status: string; total: number }[];
  }>(["admin-overview"], "/admin/overview");
  return (
    <div className="space-y-6">
      <div className="pt-1">
        <h2 className="font-display text-2xl leading-tight">{data?.greeting || "Dashboard"}</h2>
        <p className="mt-1 text-sm text-muted-foreground">Preorders, consults, and dispatch in one place.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {(data?.kpis || []).map((kpi) => (
          <Card key={kpi.label}>
            <CardHeader>
              <CardDescription>{kpi.label}</CardDescription>
              <CardTitle className="text-2xl">{kpi.value}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className={kpi.type === "down" ? "text-sm text-destructive" : "text-sm text-success"}>{kpi.delta}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Recent orders</CardTitle>
          <CardDescription>Latest preorders from the storefront.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order</TableHead>
                <TableHead>Customer</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(data?.recent || []).map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="font-mono">
                    <Link className="underline-offset-4 hover:underline" to={`/admin/orders/${row.id}`}>
                      {row.id}
                    </Link>
                  </TableCell>
                  <TableCell>{row.name}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

export function AdminOrders() {
  const filter = useAppSelector((state) => state.ui.orderFilter);
  const dispatch = useAppDispatch();
  const { data } = useAdminQuery<{
    orders: { id: string; name: string; status: string; total: number; city: string }[];
  }>(["admin-orders", filter], `/admin/orders?status=${filter}`);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Orders</CardTitle>
        <CardDescription>Filter by status and scan the queue.</CardDescription>
        <div className="flex flex-wrap gap-2 pt-2">
          {["all", "consult", "confirmed", "dispatched", "delivered", "hold"].map((key) => (
            <Button
              key={key}
              size="sm"
              variant={filter === key ? "default" : "outline"}
              onClick={() => dispatch(setOrderFilter(key))}
            >
              {key}
            </Button>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>City</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(data?.orders || []).map((row) => (
              <TableRow key={row.id}>
                <TableCell className="font-mono">
                  <Link className="underline-offset-4 hover:underline" to={`/admin/orders/${row.id}`}>
                    {row.id}
                  </Link>
                </TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.city}</TableCell>
                <TableCell>
                  <StatusBadge status={row.status} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export function AdminConsults() {
  const { data } = useAdminQuery<{ consults: { id: string; name: string; phone: string; note: string }[] }>(
    ["admin-consults"],
    "/admin/consults",
  );
  return (
    <div className="space-y-4">
      {(data?.consults || []).map((row) => (
        <ConsultRow key={row.id} row={row} />
      ))}
    </div>
  );
}

function ConsultRow({ row }: { row: { id: string; name: string; phone: string; note: string } }) {
  const complete = useAdminMutation(`/admin/consults/${row.id}/complete`, ["admin-consults"]);
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Link className="underline-offset-4 hover:underline" to={`/admin/orders/${row.id}`}>
            {row.name}
          </Link>
        </CardTitle>
        <CardDescription>
          {row.phone} · {row.note}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button size="sm" disabled={complete.isPending} onClick={() => void complete.mutateAsync()}>
          <PendingIcon pending={complete.isPending} />
          Call now
        </Button>
      </CardContent>
    </Card>
  );
}

export function AdminDispatch() {
  const { data } = useAdminQuery<{
    columns: { key: string; label: string; cards: { id: string; name: string; city: string }[] }[];
  }>(["admin-dispatch"], "/admin/dispatch");
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {(data?.columns || []).map((col) => (
          <Card key={col.key}>
            <CardHeader>
              <CardTitle>{col.label}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {col.cards.map((card) => (
                <Link
                  key={card.id}
                  to={`/admin/orders/${card.id}`}
                  className="block rounded-lg border bg-background p-3 hover:bg-accent"
                >
                  <div className="font-mono text-sm">{card.id}</div>
                  <div>{card.name}</div>
                </Link>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function AdminAnalytics() {
  const { data } = useAdminQuery<{ kpis: { label: string; value: string }[] }>(["admin-analytics"], "/admin/analytics");
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {(data?.kpis || []).map((kpi) => (
          <Card key={kpi.label}>
            <CardHeader>
              <CardDescription>{kpi.label}</CardDescription>
              <CardTitle>{kpi.value}</CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function AdminCustomers() {
  const { data } = useAdminQuery<{ customers: { name: string; email: string; city: string }[] }>(
    ["admin-customers"],
    "/admin/customers",
  );
  return (
    <Card>
      <CardHeader>
        <CardTitle>Customers</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {(data?.customers || []).map((row) => (
          <div key={row.email}>
            {row.name} · {row.city}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export function AdminInventory() {
  const { data } = useAdminQuery<{ skus: { sku: string; stock: number; level: string }[]; days_remaining: number }>(
    ["admin-inventory"],
    "/admin/inventory",
  );
  return (
    <Card>
      <CardHeader>
        <CardTitle>Inventory</CardTitle>
        <CardDescription>On-hand stock and cover.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        {(data?.skus || []).map((sku) => (
          <div key={sku.sku}>
            {sku.sku} · {sku.stock} · {sku.level}
          </div>
        ))}
        <p>Stock lasts {data?.days_remaining ?? 0} days.</p>
      </CardContent>
    </Card>
  );
}
