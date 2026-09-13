import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { BarChart3, Boxes, Home, Phone, ShoppingCart, Truck, UserCog, Users } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../app/store";
import { useAdminMutation, useAdminQuery, useAdminRequest } from "../../features/admin/hooks";
import { setOrderFilter } from "../../features/ui/uiSlice";
import { DashboardShell, type DashNavGroup } from "../../components/dashboard/DashboardShell";
import { PendingIcon } from "../../components/PendingIcon";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import type { User } from "../../lib/api";
import { statusClass, STATUS_LABEL } from "../../lib/status";

const STAFF_ROLES = ["admin", "ops", "clinician", "founder"] as const;

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
        { to: "/admin/team", label: "Team", icon: UserCog },
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
    pending_consults?: number;
    kpis: { label: string; value: string; delta: string; type: string }[];
    recent: { id: string; name: string; status: string; total: number }[];
  }>(["admin-overview"], "/admin/overview");
  const pending = data?.pending_consults ?? 0;
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3 pt-1">
        <div>
          <h2 className="font-display text-2xl leading-tight">{data?.greeting || "Dashboard"}</h2>
          <p className="mt-1 text-sm text-muted-foreground">Preorders, consults, and dispatch in one place.</p>
        </div>
        <Button
          asChild
          variant={pending ? "default" : "outline"}
          size="sm"
          className={pending ? "text-white" : undefined}
        >
          <Link to="/admin/consults" className={pending ? "text-white" : undefined}>
            {pending} pending consult{pending === 1 ? "" : "s"}
          </Link>
        </Button>
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
  const { data, isError, isLoading } = useAdminQuery<{
    consults: { id: string; name: string; phone: string; note: string; time?: string }[];
    pending_rx?: { id: string; name: string; file: string; status: string }[];
    prescriptions?: { id: string; name: string; rx: string; dose: string; dur: string; status: string }[];
    remaining?: number;
  }>(["admin-consults"], "/admin/consults");
  const consults = data?.consults || [];
  const pendingRx = data?.pending_rx || [];
  const prescriptions = data?.prescriptions || [];
  const remaining = data?.remaining ?? consults.length;

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Loading consult queue…</p>;
  }

  if (isError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Consult queue unavailable</CardTitle>
          <CardDescription>
            Your role may not include consult access (founder, admin, or clinician required), or the API failed.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl">Consult queue</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {remaining} call{remaining === 1 ? "" : "s"} remaining
          {pendingRx.length ? ` · ${pendingRx.length} Rx to verify` : ""}
        </p>
      </div>

      {consults.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No scheduled calls</CardTitle>
            <CardDescription>
              Booked consults with status “Pending consult” appear here. Orders that uploaded a prescription instead
              show under Rx verification below.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <div className="space-y-4">
          {consults.map((row) => (
            <ConsultRow key={row.id} row={row} />
          ))}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Rx verification</CardTitle>
          <CardDescription>Prescription uploads waiting for clinician review.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {pendingRx.length === 0 ? (
            <p className="text-sm text-muted-foreground">No prescriptions pending verification.</p>
          ) : (
            pendingRx.map((row) => (
              <div key={row.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border p-3">
                <div>
                  <Link className="font-medium underline-offset-4 hover:underline" to={`/admin/orders/${row.id}`}>
                    {row.name}
                  </Link>
                  <div className="font-mono text-xs text-muted-foreground">
                    {row.id} · {row.file}
                  </div>
                </div>
                <Button asChild size="sm" variant="outline">
                  <Link to={`/admin/orders/${row.id}`}>Review</Link>
                </Button>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Prescriptions issued</CardTitle>
          <CardDescription>Recent clinician prescriptions on orders.</CardDescription>
        </CardHeader>
        <CardContent>
          {prescriptions.length === 0 ? (
            <p className="text-sm text-muted-foreground">None issued yet.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order</TableHead>
                  <TableHead>Patient</TableHead>
                  <TableHead>Rx</TableHead>
                  <TableHead>Dose</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {prescriptions.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell className="font-mono">
                      <Link className="underline-offset-4 hover:underline" to={`/admin/orders/${row.id}`}>
                        {row.id}
                      </Link>
                    </TableCell>
                    <TableCell>{row.name}</TableCell>
                    <TableCell className="font-mono text-xs">{row.rx}</TableCell>
                    <TableCell>{row.dose}</TableCell>
                    <TableCell>{row.status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
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

export function AdminTeam() {
  const me = useAppSelector((state) => state.auth.user);
  const { data, isError, isLoading } = useAdminQuery<User[]>(["admin-staff"], "/admin/staff");
  const createStaff = useAdminMutation("/admin/staff", ["admin-staff"], "Team member added");
  const action = useAdminRequest();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState<string>("admin");

  const roles = me?.role === "founder" ? STAFF_ROLES : STAFF_ROLES.filter((item) => item !== "founder");
  const staff = data || [];

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!name.trim() || !email.trim() || password.length < 8) return;
    void createStaff
      .mutateAsync({
        name: name.trim(),
        email: email.trim(),
        password,
        phone: phone.trim(),
        role,
      })
      .then(() => {
        setName("");
        setEmail("");
        setPassword("");
        setPhone("");
        setRole("admin");
      });
  };

  const changeRole = (userId: number, nextRole: string) => {
    void action.mutateAsync({
      path: `/admin/staff/${userId}/role`,
      method: "patch",
      body: { role: nextRole },
      success: "Role updated",
    });
  };

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Loading team…</p>;
  }

  if (isError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Team unavailable</CardTitle>
          <CardDescription>Founder or admin access is required to manage roles.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Team</CardTitle>
          <CardDescription>Staff accounts with dashboard access.</CardDescription>
        </CardHeader>
        <CardContent>
          {staff.length === 0 ? (
            <p className="text-sm text-muted-foreground">No staff members yet.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {staff.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>{row.email}</TableCell>
                    <TableCell>
                      <select
                        className="h-9 rounded-md border border-input bg-transparent px-3 text-sm"
                        value={row.role}
                        disabled={action.isPending || (row.role === "founder" && me?.role !== "founder")}
                        onChange={(event) => changeRole(row.id, event.target.value)}
                      >
                        {roles.map((item) => (
                          <option key={item} value={item}>
                            {item}
                          </option>
                        ))}
                        {row.role === "founder" && me?.role !== "founder" ? (
                          <option value="founder">founder</option>
                        ) : null}
                      </select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Add team member</CardTitle>
          <CardDescription>Creates a staff login for admin, ops, clinician, or founder.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid gap-3 sm:grid-cols-2" onSubmit={submit}>
            <label className="grid gap-1 text-sm">
              <span className="text-muted-foreground">Full name</span>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ada Admin" />
            </label>
            <label className="grid gap-1 text-sm">
              <span className="text-muted-foreground">Email</span>
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="ada@slowmo.co"
              />
            </label>
            <label className="grid gap-1 text-sm">
              <span className="text-muted-foreground">Password</span>
              <Input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="Min 8 characters"
              />
            </label>
            <label className="grid gap-1 text-sm">
              <span className="text-muted-foreground">Phone</span>
              <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Optional" />
            </label>
            <label className="grid gap-1 text-sm sm:col-span-2">
              <span className="text-muted-foreground">Role</span>
              <select
                className="h-9 rounded-md border border-input bg-transparent px-3 text-sm"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                {roles.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
            <div className="sm:col-span-2">
              <Button type="submit" size="sm" disabled={createStaff.isPending}>
                <PendingIcon pending={createStaff.isPending} />
                Add staff
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export function AdminInventory() {
  const { data, isError } = useAdminQuery<{
    skus: { sku: string; name?: string; stock: number; allocated?: number; level: string; days?: number }[];
    batches?: { b: string; made: string; exp: string; qty: number }[];
    days_remaining: number;
    warehouse?: string;
  }>(["admin-inventory"], "/admin/inventory");
  const receive = useAdminMutation("/admin/inventory/receipts", ["admin-inventory"], "Stock received");
  const createSku = useAdminMutation("/admin/inventory/skus", ["admin-inventory"], "SKU created");
  const [sku, setSku] = useState("");
  const [qty, setQty] = useState("10");
  const [batch, setBatch] = useState("");
  const [note, setNote] = useState("manual receipt");
  const [newCode, setNewCode] = useState("");
  const [newName, setNewName] = useState("");
  const [newPack, setNewPack] = useState("10");
  const [newPrice, setNewPrice] = useState("3390");
  const [newMrp, setNewMrp] = useState("3890");
  const [newLabel, setNewLabel] = useState("");
  const [newStock, setNewStock] = useState("0");
  const [newForecast, setNewForecast] = useState("0");

  const skus = data?.skus || [];
  const selectedSku = sku || skus[0]?.sku || "";

  const submitReceipt = (event: FormEvent) => {
    event.preventDefault();
    const amount = Number(qty);
    if (!selectedSku || !Number.isFinite(amount) || amount <= 0) return;
    void receive.mutateAsync({
      sku: selectedSku,
      qty: amount,
      note,
      batch_code: batch || null,
    });
  };

  const submitCreate = (event: FormEvent) => {
    event.preventDefault();
    const packQty = Number(newPack) || 0;
    const price = Number(newPrice) || 0;
    const mrp = Number(newMrp) || 0;
    const stock = Number(newStock) || 0;
    const forecast = Number(newForecast) || 0;
    if (!newCode.trim() || !newName.trim() || packQty <= 0) return;
    void createSku
      .mutateAsync({
        sku: newCode.trim(),
        name: newName.trim(),
        pack_qty: packQty,
        price,
        mrp,
        label: newLabel.trim(),
        stock,
        weekly_forecast: forecast,
      })
      .then(() => {
        setNewCode("");
        setNewName("");
        setNewLabel("");
        setNewStock("0");
        setNewForecast("0");
      });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Inventory</CardTitle>
          <CardDescription>
            {data?.warehouse ? `Warehouse: ${data.warehouse}` : "On-hand stock and cover."}
            {isError ? " · Could not load inventory (ops/admin/founder required)." : ""}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {skus.length === 0 ? (
            <p className="text-sm text-muted-foreground">No SKUs yet.</p>
          ) : (
            skus.map((row) => (
              <div
                key={row.sku}
                className="flex flex-wrap items-baseline justify-between gap-2 border-b py-2 last:border-0"
              >
                <div>
                  <div className="font-medium">{row.name || row.sku}</div>
                  <div className="font-mono text-xs text-muted-foreground">{row.sku}</div>
                </div>
                <div className="text-right text-sm">
                  <div className="font-display text-xl">{row.stock}</div>
                  <div className="text-muted-foreground">
                    {row.level}
                    {row.allocated != null ? ` · ${row.allocated} allocated` : ""}
                  </div>
                </div>
              </div>
            ))
          )}
          <p className="text-sm text-muted-foreground">Stock lasts {data?.days_remaining ?? 0} days.</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Create SKU</CardTitle>
          <CardDescription>Adds a sellable pack variant and inventory record.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid gap-3 sm:grid-cols-2" onSubmit={submitCreate}>
            <label className="grid gap-1 text-sm">
              <span className="text-muted-foreground">SKU code</span>
              <Input value={newCode} onChange={(e) => setNewCode(e.target.value)} placeholder="SM-MB-45" />
            </label>
            <label className="grid gap-1 text-sm">
              <span className="text-muted-foreground">Display name</span>
              <Input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Slow Mo · 45 pack" />
            </label>
            <label className="grid gap-1 text-sm">
              <span className="text-muted-foreground">Pack qty</span>
              <Input value={newPack} onChange={(e) => setNewPack(e.target.value)} inputMode="numeric" />
            </label>
            <label className="grid gap-1 text-sm">
              <span className="text-muted-foreground">Label</span>
              <Input value={newLabel} onChange={(e) => setNewLabel(e.target.value)} placeholder="Optional" />
            </label>
            <label className="grid gap-1 text-sm">
              <span className="text-muted-foreground">Price (₹)</span>
              <Input value={newPrice} onChange={(e) => setNewPrice(e.target.value)} inputMode="numeric" />
            </label>
            <label className="grid gap-1 text-sm">
              <span className="text-muted-foreground">MRP (₹)</span>
              <Input value={newMrp} onChange={(e) => setNewMrp(e.target.value)} inputMode="numeric" />
            </label>
            <label className="grid gap-1 text-sm">
              <span className="text-muted-foreground">Opening stock</span>
              <Input value={newStock} onChange={(e) => setNewStock(e.target.value)} inputMode="numeric" />
            </label>
            <label className="grid gap-1 text-sm">
              <span className="text-muted-foreground">Weekly forecast</span>
              <Input value={newForecast} onChange={(e) => setNewForecast(e.target.value)} inputMode="numeric" />
            </label>
            <div className="sm:col-span-2">
              <Button type="submit" size="sm" disabled={createSku.isPending}>
                <PendingIcon pending={createSku.isPending} />
                Create SKU
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Manual receipt</CardTitle>
          <CardDescription>Add units to an existing SKU (creates an optional batch).</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid gap-3 sm:grid-cols-2" onSubmit={submitReceipt}>
            <label className="grid gap-1 text-sm sm:col-span-2">
              <span className="text-muted-foreground">SKU</span>
              <select
                className="h-9 rounded-md border border-input bg-transparent px-3 text-sm"
                value={selectedSku}
                onChange={(e) => setSku(e.target.value)}
              >
                {skus.map((row) => (
                  <option key={row.sku} value={row.sku}>
                    {row.sku} — {row.name || row.sku}
                  </option>
                ))}
              </select>
            </label>
            <label className="grid gap-1 text-sm">
              <span className="text-muted-foreground">Quantity</span>
              <Input value={qty} onChange={(e) => setQty(e.target.value)} inputMode="numeric" />
            </label>
            <label className="grid gap-1 text-sm">
              <span className="text-muted-foreground">Batch code (optional)</span>
              <Input value={batch} onChange={(e) => setBatch(e.target.value)} placeholder="B-2026-01" />
            </label>
            <label className="grid gap-1 text-sm sm:col-span-2">
              <span className="text-muted-foreground">Note</span>
              <Input value={note} onChange={(e) => setNote(e.target.value)} />
            </label>
            <div className="sm:col-span-2">
              <Button type="submit" size="sm" disabled={receive.isPending || !skus.length}>
                <PendingIcon pending={receive.isPending} />
                Receive stock
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {(data?.batches || []).length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Batches</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {data?.batches?.map((batchRow) => (
              <div key={batchRow.b}>
                {batchRow.b} · {batchRow.qty} · exp {batchRow.exp}
              </div>
            ))}
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
