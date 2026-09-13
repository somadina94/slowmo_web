/* ---------- Slow Mo Admin Dashboard ---------- */
const { useState: useStateA } = React;

/* Sample data */
const sampleOrders = [
  { id: "SM-849271", name: "Ananya Reddy", city: "Bengaluru", qty: 1, total: 3390, status: "consult", pay: "COD", placed: "Today · 2:14 PM" },
  { id: "SM-849268", name: "Vikram Shah", city: "Mumbai", qty: 3, total: 9150, status: "confirmed", pay: "COD", placed: "Today · 1:02 PM" },
  { id: "SM-849265", name: "Priya Mahajan", city: "Delhi", qty: 1, total: 3390, status: "dispatched", pay: "COD", placed: "Today · 11:47 AM" },
  { id: "SM-849263", name: "Rohit Iyer", city: "Chennai", qty: 6, total: 16950, status: "consult", pay: "COD", placed: "Today · 10:12 AM" },
  { id: "SM-849260", name: "Meera Nair", city: "Kochi", qty: 1, total: 3390, status: "confirmed", pay: "COD", placed: "Yesterday · 8:30 PM" },
  { id: "SM-849258", name: "Aditya Kumar", city: "Pune", qty: 3, total: 9150, status: "delivered", pay: "COD", placed: "Yesterday · 6:45 PM" },
  { id: "SM-849255", name: "Sneha Bose", city: "Kolkata", qty: 1, total: 3390, status: "hold", pay: "COD", placed: "Yesterday · 4:22 PM" },
  { id: "SM-849252", name: "Karthik R.", city: "Hyderabad", qty: 1, total: 3390, status: "dispatched", pay: "COD", placed: "Yesterday · 2:10 PM" },
];

const statusLabel = {
  consult: "Pending consult",
  confirmed: "Confirmed",
  dispatched: "Dispatched",
  delivered: "Delivered",
  hold: "On hold",
};

function Admin() {
  const { path } = useRoute();
  const sub = path === "/admin" || path === "/admin/" ? "overview" : path.replace("/admin/", "");
  return (
    <div className="admin-shell">
      <AdminSide active={sub} />
      <div className="admin-main">
        {sub === "overview" && <AdminOverview />}
        {sub === "orders" && <AdminOrders />}
        {sub === "consults" && <AdminConsults />}
        {sub === "dispatch" && <AdminDispatch />}
        {sub === "analytics" && <AdminAnalytics />}
        {sub === "customers" && <AdminCustomers />}
        {sub === "inventory" && <AdminInventory />}
      </div>
    </div>
  );
}

function AdminSide({ active }) {
  const { navigate } = useRoute();
  const nav = (to) => (e) => { e.preventDefault(); navigate(to); };
  const item = (key, label, icon, badge) => (
    <a href={`#/admin/${key}`} onClick={nav(`/admin/${key === "overview" ? "" : key}`)} className={active === key ? "active" : ""}>
      {icon} <span style={{ flex: 1 }}>{label}</span>
      {badge && <span style={{ background: "var(--berry)", color: "var(--cream)", fontSize: 10, padding: "2px 6px", borderRadius: 999, fontWeight: 700 }}>{badge}</span>}
    </a>
  );
  return (
    <aside className="admin-side">
      <div className="admin-brand"><MoonMark /> slow mo<sup>™</sup></div>
      <div className="admin-nav">
        {item("overview", "Overview", <Icon.Home />)}
        {item("orders", "Orders", <Icon.Cart />, "12")}
        {item("consults", "Consult queue", <Icon.Phone />, "4")}
        {item("dispatch", "Dispatch", <Icon.Truck />)}
        <div className="admin-nav-section">Insights</div>
        {item("analytics", "Analytics", <Icon.Chart />)}
        {item("customers", "Customers", <Icon.Users />)}
        {item("inventory", "Inventory", <Icon.Box />)}
      </div>
      <div className="admin-user">
        <div className="admin-user-avatar">M</div>
        <div style={{ fontSize: 12, lineHeight: 1.3 }}>
          <div style={{ fontWeight: 600 }}>Meera Iyer</div>
          <div style={{ opacity: 0.7 }}>Founder</div>
        </div>
      </div>
    </aside>
  );
}

/* ---------------- OVERVIEW ---------------- */
function AdminOverview() {
  const { navigate } = useRoute();
  const [revRange, setRevRange] = useStateA("7d");
  const revenueBreakdown = {
    today:    { value: "₹1.42L", delta: "+18%", type: "up",   orders: 34,   aov: "₹4,180", label: "Today" },
    "7d":     { value: "₹9.42L", delta: "+41%", type: "up",   orders: 247,  aov: "₹3,814", label: "Last 7 days" },
    "30d":    { value: "₹38.6L", delta: "+62%", type: "up",   orders: 1042, aov: "₹3,708", label: "Last 30 days" },
    lifetime: { value: "₹1.24Cr", delta: "since Aug 2026", type: "flat", orders: 3218, aov: "₹3,854", label: "Lifetime" },
  };
  const rev = revenueBreakdown[revRange];
  const kpis = [
    { label: "Preorders (7d)", value: "247", delta: "+34%", type: "up" },
    { label: "Consults booked", value: "184", delta: "+12%", type: "up" },
    { label: "COD success rate", value: "87%", delta: "−3%", type: "down" },
    { label: "Avg order value", value: "₹3,814", delta: "+8%", type: "up" },
  ];
  const chart = [42, 58, 63, 71, 54, 89, 112, 98, 124, 137, 156, 172, 189, 247];
  const geo = [
    { city: "Bengaluru", i: "BL", pct: 78, n: 42 },
    { city: "Mumbai", i: "MB", pct: 65, n: 35 },
    { city: "Delhi", i: "DL", pct: 58, n: 31 },
    { city: "Hyderabad", i: "HY", pct: 44, n: 24 },
    { city: "Chennai", i: "CH", pct: 38, n: 20 },
    { city: "Pune", i: "PN", pct: 32, n: 17 },
    { city: "Kolkata", i: "KL", pct: 22, n: 12 },
  ];
  return (
    <>
      <div className="admin-header">
        <div>
          <div className="eyebrow">Wed 12 Sep · 9:41 AM</div>
          <h1 style={{ marginTop: 6 }}>Good morning, Meera.</h1>
          <p className="text-muted" style={{ marginTop: 6 }}>You have <strong style={{ color: "var(--berry)" }}>4 consults</strong> today and <strong style={{ color: "var(--purple)" }}>12 orders</strong> awaiting confirmation.</p>
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <div className="admin-search">
            <Icon.Search />
            <input placeholder="Search orders, customers…" />
          </div>
          <button className="btn btn-primary btn-sm"><Icon.Plus /> New order</button>
        </div>
      </div>

      {/* Revenue panel with breakdown tabs */}
      <div className="panel" style={{ marginBottom: 24, background: "linear-gradient(135deg, var(--forest) 0%, var(--purple-deep) 100%)", color: "var(--cream)", border: "none" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 20, marginBottom: 24 }}>
          <div>
            <div className="eyebrow" style={{ color: "var(--lavender)" }}>Revenue · {rev.label}</div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 56, fontWeight: 500, lineHeight: 1, marginTop: 8, letterSpacing: "-0.03em" }}>
              {rev.value}
            </div>
            <div style={{ marginTop: 10, fontSize: 13, opacity: 0.85 }}>
              <span style={{ padding: "3px 10px", background: rev.type === "up" ? "rgba(26, 122, 79, 0.35)" : rev.type === "down" ? "rgba(122, 31, 61, 0.35)" : "rgba(246, 242, 232, 0.15)", borderRadius: 999, marginRight: 8, fontWeight: 600 }}>
                {rev.type === "up" ? "↑" : rev.type === "down" ? "↓" : "•"} {rev.delta}
              </span>
              <span style={{ opacity: 0.7 }}>{rev.orders.toLocaleString("en-IN")} orders · Avg {rev.aov}</span>
            </div>
          </div>
          <div style={{ display: "flex", gap: 6, padding: 4, background: "rgba(0,0,0,0.25)", borderRadius: 999 }}>
            {[
              { k: "today", label: "Today" },
              { k: "7d", label: "7 days" },
              { k: "30d", label: "1 month" },
              { k: "lifetime", label: "Lifetime" },
            ].map(r => (
              <button
                key={r.k}
                onClick={() => setRevRange(r.k)}
                style={{
                  padding: "8px 16px", borderRadius: 999, fontSize: 13, fontWeight: 600,
                  background: revRange === r.k ? "var(--sun)" : "transparent",
                  color: revRange === r.k ? "var(--forest)" : "var(--cream)",
                  transition: "all 0.15s",
                }}
              >{r.label}</button>
            ))}
          </div>
        </div>
        {/* mini bar chart for that range */}
        <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 60 }}>
          {(revRange === "today" ? [4,6,3,5,8,7,9,12,15,11,14,18,16,20,17,22,19,15]
            : revRange === "7d" ? [42,58,63,71,54,89,112]
            : revRange === "30d" ? Array.from({length: 30}, (_, i) => 30 + Math.round(Math.sin(i/3)*20 + i*2))
            : Array.from({length: 24}, (_, i) => 20 + Math.round(Math.sin(i/2)*15 + i*3))
          ).map((v, i, arr) => (
            <div key={i} style={{
              flex: 1,
              height: `${(v / Math.max(...arr)) * 100}%`,
              background: "linear-gradient(to top, var(--sun), var(--lavender))",
              borderRadius: 3,
              minHeight: 3,
              opacity: 0.85,
            }}></div>
          ))}
        </div>
      </div>

      <div className="kpi-grid">
        {kpis.map((k, i) => (
          <div key={i} className="kpi-card">
            <div className="kpi-label">{k.label}</div>
            <div className="kpi-value">{k.value}</div>
            <div className={`kpi-delta ${k.type === "down" ? "down" : ""}`}>
              {k.type === "up" ? "↑" : "↓"} {k.delta} vs prev week
            </div>
          </div>
        ))}
      </div>

      <div className="admin-grid-2">
        <div className="panel">
          <div className="panel-header">
            <div className="panel-title">Preorders over time</div>
            <div style={{ display: "flex", gap: 8 }}>
              <button className="tag" style={{ background: "var(--forest)", color: "var(--cream)" }}>14d</button>
              <button className="tag">30d</button>
              <button className="tag">All</button>
            </div>
          </div>
          <div className="chart">
            {chart.map((v, i) => (
              <div key={i} className="chart-bar" style={{ height: `${(v / 250) * 100}%` }} title={`${v} orders`}/>
            ))}
          </div>
          <div className="chart-labels">
            {chart.map((_, i) => (
              <div key={i} className="chart-label">{i % 2 === 0 ? `${i+1}` : ""}</div>
            ))}
          </div>
        </div>

        <div className="panel">
          <div className="panel-header">
            <div className="panel-title">Top cities</div>
            <a href="#/admin/analytics" onClick={(e) => { e.preventDefault(); navigate("/admin/analytics"); }} className="panel-action">View all →</a>
          </div>
          <div className="geo-list">
            {geo.map((g, i) => (
              <div key={i} className="geo-row">
                <div className="geo-flag">{g.i}</div>
                <div className="geo-city">{g.city}</div>
                <div className="geo-bar"><div className="geo-bar-fill" style={{ width: `${g.pct}%` }}></div></div>
                <div className="geo-count">{g.n}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="panel">
        <div className="panel-header">
          <div className="panel-title">Recent orders</div>
          <a href="#/admin/orders" onClick={(e) => { e.preventDefault(); navigate("/admin/orders"); }} className="panel-action">View all →</a>
        </div>
        <OrdersTable rows={sampleOrders.slice(0, 5)} />
      </div>
    </>
  );
}

/* ---------------- ORDERS ---------------- */
function AdminOrders() {
  const [filter, setFilter] = useStateA("all");
  const filtered = filter === "all" ? sampleOrders : sampleOrders.filter(o => o.status === filter);
  const tabs = [
    { k: "all", label: "All orders", count: sampleOrders.length },
    { k: "consult", label: "Pending consult", count: sampleOrders.filter(o => o.status === "consult").length },
    { k: "confirmed", label: "Confirmed", count: sampleOrders.filter(o => o.status === "confirmed").length },
    { k: "dispatched", label: "Dispatched", count: sampleOrders.filter(o => o.status === "dispatched").length },
    { k: "delivered", label: "Delivered", count: sampleOrders.filter(o => o.status === "delivered").length },
    { k: "hold", label: "On hold", count: sampleOrders.filter(o => o.status === "hold").length },
  ];
  return (
    <>
      <div className="admin-header">
        <div>
          <h1>Orders</h1>
          <p className="text-muted" style={{ marginTop: 6 }}>{filtered.length} orders · Preorder phase</p>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <button className="btn btn-outline btn-sm"><Icon.Download /> Export CSV</button>
          <button className="btn btn-primary btn-sm"><Icon.Plus /> New order</button>
        </div>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {tabs.map(t => (
          <button
            key={t.k}
            className={`tag ${filter === t.k ? "" : ""}`}
            style={filter === t.k ? { background: "var(--forest)", color: "var(--cream)", padding: "8px 14px" } : { padding: "8px 14px", cursor: "pointer" }}
            onClick={() => setFilter(t.k)}
          >
            {t.label} <span style={{ opacity: 0.6, marginLeft: 4 }}>{t.count}</span>
          </button>
        ))}
      </div>

      <div className="panel" style={{ padding: 0, overflow: "hidden" }}>
        <OrdersTable rows={filtered} />
      </div>
    </>
  );
}

function OrdersTable({ rows }) {
  return (
    <table className="table">
      <thead>
        <tr>
          <th>Order</th>
          <th>Customer</th>
          <th>City</th>
          <th>Qty</th>
          <th>Total</th>
          <th>Payment</th>
          <th>Status</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {rows.map(o => (
          <tr key={o.id}>
            <td>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--forest)" }}>{o.id}</div>
              <div style={{ fontSize: 11, color: "var(--ink-3)", marginTop: 2 }}>{o.placed}</div>
            </td>
            <td style={{ fontWeight: 600 }}>{o.name}</td>
            <td className="text-muted">{o.city}</td>
            <td>{o.qty}×</td>
            <td style={{ fontWeight: 600 }}>₹{o.total.toLocaleString("en-IN")}</td>
            <td><div className="tag tag-sun" style={{ fontSize: 11 }}>{o.pay}</div></td>
            <td><span className={`status-pill status-${o.status}`}>{statusLabel[o.status]}</span></td>
            <td><button className="btn btn-ghost btn-sm" style={{ padding: "6px 10px" }}><Icon.MoreH /></button></td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/* ---------------- CONSULT QUEUE ---------------- */
function AdminConsults() {
  const consults = [
    { id: "SM-849271", name: "Ananya Reddy", phone: "+91 98123 45678", time: "10:00 AM", date: "Today", note: "First-time. Trouble falling asleep, tried melatonin." },
    { id: "SM-849263", name: "Rohit Iyer", phone: "+91 90876 12345", time: "11:30 AM", date: "Today", note: "6-pack order. Repeat customer inquiry." },
    { id: "SM-849248", name: "Deepa Kulkarni", phone: "+91 99887 65432", time: "2:00 PM", date: "Today", note: "Skipped intake — needs full assessment." },
    { id: "SM-849241", name: "Suraj Nair", phone: "+91 97654 32109", time: "4:30 PM", date: "Today", note: "Postpartum sleep issues. Age 34." },
  ];
  return (
    <>
      <div className="admin-header">
        <div>
          <h1>Consult queue</h1>
          <p className="text-muted" style={{ marginTop: 6 }}>4 calls scheduled today · Dr. Meera Iyer</p>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <button className="btn btn-outline btn-sm"><Icon.Calendar /> Reschedule</button>
          <button className="btn btn-primary btn-sm"><Icon.Phone /> Start next call</button>
        </div>
      </div>

      <div className="panel" style={{ marginBottom: 24 }}>
        <div className="panel-header">
          <div className="panel-title">Today · Sep 12</div>
          <div className="text-muted" style={{ fontSize: 13 }}>4 of 4 remaining</div>
        </div>
        <div style={{ display: "grid", gap: 12 }}>
          {consults.map((c, i) => (
            <div key={c.id} style={{ display: "grid", gridTemplateColumns: "80px 1fr auto", gap: 20, padding: 20, background: "var(--cream)", borderRadius: 16, border: "1px solid var(--line)", alignItems: "center" }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 600, color: "var(--forest)" }}>{c.time.split(" ")[0]}</div>
                <div style={{ fontSize: 11, color: "var(--ink-3)", marginTop: 2 }}>{c.time.split(" ")[1]}</div>
              </div>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontWeight: 600, fontSize: 15 }}>{c.name}</span>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--ink-3)" }}>{c.id}</span>
                </div>
                <div style={{ fontSize: 13, color: "var(--ink-2)", marginTop: 4 }}>{c.phone}</div>
                <div style={{ fontSize: 12, color: "var(--ink-3)", marginTop: 8, fontStyle: "italic" }}>{c.note}</div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button className="btn btn-outline btn-sm"><Icon.Calendar /> Reschedule</button>
                <button className="btn btn-primary btn-sm"><Icon.Phone /> Call now</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="panel">
        <div className="panel-header">
          <div className="panel-title">Prescriptions issued</div>
          <div className="text-muted" style={{ fontSize: 13 }}>Last 7 days</div>
        </div>
        <table className="table">
          <thead><tr><th>Order</th><th>Patient</th><th>Rx code</th><th>Dosage</th><th>Duration</th><th>Status</th></tr></thead>
          <tbody>
            {[
              { id: "SM-849258", name: "Aditya Kumar", rx: "RX-SM-8241", dose: "1/day", dur: "90 days", status: "Delivered" },
              { id: "SM-849252", name: "Karthik R.", rx: "RX-SM-8239", dose: "1/day", dur: "30 days", status: "Dispatched" },
              { id: "SM-849248", name: "Deepa Kulkarni", rx: "RX-SM-8237", dose: "1/day, 45min before bed", dur: "30 days", status: "Issued" },
            ].map(p => (
              <tr key={p.id}>
                <td style={{ fontFamily: "var(--font-mono)", fontSize: 12 }}>{p.id}</td>
                <td style={{ fontWeight: 600 }}>{p.name}</td>
                <td style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--purple)" }}>{p.rx}</td>
                <td className="text-muted">{p.dose}</td>
                <td>{p.dur}</td>
                <td><span className="status-pill status-confirmed">{p.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

/* ---------------- DISPATCH ---------------- */
function AdminDispatch() {
  const columns = [
    { key: "packed", label: "Packed", color: "#F0C64A", cards: [
      { id: "SM-849260", name: "Meera Nair", city: "Kochi", time: "1h" },
      { id: "SM-849252", name: "Karthik R.", city: "Hyderabad", time: "2h" },
    ] },
    { key: "picked", label: "Picked up", color: "#C9B8E8", cards: [
      { id: "SM-849265", name: "Priya Mahajan", city: "Delhi", time: "4h" },
      { id: "SM-849258", name: "Aditya Kumar", city: "Pune", time: "5h" },
    ] },
    { key: "transit", label: "In transit", color: "#8A5A3B", cards: [
      { id: "SM-849241", name: "Suraj Nair", city: "Ahmedabad", time: "1d" },
      { id: "SM-849237", name: "Nisha Patel", city: "Surat", time: "1d" },
      { id: "SM-849230", name: "Kabir Malhotra", city: "Jaipur", time: "2d" },
    ] },
    { key: "delivered", label: "Delivered", color: "#1a7a4f", cards: [
      { id: "SM-849225", name: "Riya Sharma", city: "Chandigarh", time: "3d" },
      { id: "SM-849218", name: "Sagar Deshpande", city: "Nashik", time: "3d" },
    ] },
  ];
  return (
    <>
      <div className="admin-header">
        <div>
          <h1>Dispatch</h1>
          <p className="text-muted" style={{ marginTop: 6 }}>Via Delhivery · 9 in transit · Avg 2.3 days</p>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <button className="btn btn-outline btn-sm"><Icon.Download /> AWB manifest</button>
          <button className="btn btn-primary btn-sm"><Icon.Truck /> Schedule pickup</button>
        </div>
      </div>

      <div className="kanban">
        {columns.map(col => (
          <div key={col.key} className="kanban-col">
            <h4>
              <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ width: 8, height: 8, borderRadius: 4, background: col.color }}></span>
                {col.label}
              </span>
              <span className="kanban-count">{col.cards.length}</span>
            </h4>
            {col.cards.map(c => (
              <div key={c.id} className="kanban-card">
                <div className="kc-id">{c.id}</div>
                <div className="kc-name">{c.name}</div>
                <div className="kc-meta">{c.city} · {c.time} ago</div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  );
}

/* ---------------- ANALYTICS ---------------- */
function AdminAnalytics() {
  const funnel = [
    { label: "Landing visitors", n: 12480, pct: 100 },
    { label: "Sleep quiz started", n: 4230, pct: 34 },
    { label: "Quiz completed", n: 2810, pct: 22 },
    { label: "Preorder started", n: 892, pct: 7 },
    { label: "Address entered", n: 512, pct: 4.1 },
    { label: "Order placed", n: 247, pct: 2.0 },
  ];
  return (
    <>
      <div className="admin-header">
        <div><h1>Analytics</h1><p className="text-muted" style={{ marginTop: 6 }}>Last 7 days · Preorder phase</p></div>
        <div style={{ display: "flex", gap: 12 }}>
          <button className="btn btn-outline btn-sm"><Icon.Filter /> Filters</button>
          <button className="btn btn-outline btn-sm"><Icon.Download /> Export</button>
        </div>
      </div>

      <div className="kpi-grid">
        <div className="kpi-card"><div className="kpi-label">Total revenue</div><div className="kpi-value">₹9.42L</div><div className="kpi-delta">↑ 41% WoW</div></div>
        <div className="kpi-card"><div className="kpi-label">Avg order value</div><div className="kpi-value">₹3,814</div><div className="kpi-delta">↑ 8%</div></div>
        <div className="kpi-card"><div className="kpi-label">Conversion rate</div><div className="kpi-value">1.98%</div><div className="kpi-delta">↑ 0.4pp</div></div>
        <div className="kpi-card"><div className="kpi-label">Repeat rate</div><div className="kpi-value">24%</div><div className="kpi-delta down">−2%</div></div>
      </div>

      <div className="admin-grid-2">
        <div className="panel">
          <div className="panel-header">
            <div className="panel-title">Preorder funnel</div>
            <div className="text-muted" style={{ fontSize: 13 }}>Aug 27 — Sep 12</div>
          </div>
          <div style={{ display: "grid", gap: 14 }}>
            {funnel.map((f, i) => (
              <div key={i}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 13 }}>
                  <span>{f.label}</span>
                  <span><strong>{f.n.toLocaleString("en-IN")}</strong> <span className="text-muted">· {f.pct}%</span></span>
                </div>
                <div style={{ height: 10, background: "var(--cream-2)", borderRadius: 5, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${f.pct}%`, background: `linear-gradient(to right, var(--forest), var(--purple))`, borderRadius: 5 }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="panel">
          <div className="panel-header">
            <div className="panel-title">Traffic sources</div>
          </div>
          <div style={{ display: "grid", gap: 14 }}>
            {[
              { src: "Instagram", n: "4,120", pct: 33, color: "#7A1F3D" },
              { src: "Organic", n: "3,240", pct: 26, color: "#0F3B2E" },
              { src: "Direct", n: "2,510", pct: 20, color: "#3E2A6E" },
              { src: "Google Ads", n: "1,610", pct: 13, color: "#F0C64A" },
              { src: "Referral", n: "1,000", pct: 8, color: "#8A5A3B" },
            ].map((s, i) => (
              <div key={i}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 13 }}>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}><span style={{ width: 8, height: 8, borderRadius: 4, background: s.color }}></span>{s.src}</span>
                  <span><strong>{s.n}</strong> <span className="text-muted">· {s.pct}%</span></span>
                </div>
                <div style={{ height: 8, background: "var(--cream-2)", borderRadius: 4, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${s.pct}%`, background: s.color, borderRadius: 4 }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="panel">
        <div className="panel-header">
          <div className="panel-title">Geography</div>
          <div className="text-muted" style={{ fontSize: 13 }}>Preorders by state</div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }}>
          {[
            { s: "Karnataka", n: 68, pct: 100 },
            { s: "Maharashtra", n: 52, pct: 76 },
            { s: "Delhi NCR", n: 41, pct: 60 },
            { s: "Tamil Nadu", n: 32, pct: 47 },
            { s: "Telangana", n: 28, pct: 41 },
            { s: "Kerala", n: 18, pct: 26 },
            { s: "Gujarat", n: 15, pct: 22 },
            { s: "West Bengal", n: 12, pct: 18 },
          ].map((g, i) => (
            <div key={i} style={{ padding: 16, background: "var(--cream)", borderRadius: 12 }}>
              <div style={{ fontSize: 12, color: "var(--ink-3)", marginBottom: 4 }}>{g.s}</div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 500, color: "var(--forest)" }}>{g.n}</div>
              <div style={{ height: 4, background: "var(--line)", borderRadius: 2, marginTop: 8, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${g.pct}%`, background: "var(--purple)" }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

/* ---------------- CUSTOMERS ---------------- */
function AdminCustomers() {
  const customers = [
    { name: "Ananya Reddy", email: "ananya@gmail.com", city: "Bengaluru", orders: 1, spent: 3390, prog: "Sleep 30", i: "AR", joined: "Sep 12" },
    { name: "Vikram Shah", email: "vikram.s@hey.com", city: "Mumbai", orders: 2, spent: 12540, prog: "Sleep 90", i: "VS", joined: "Sep 5" },
    { name: "Priya Mahajan", email: "priya.m@icloud.com", city: "Delhi", orders: 3, spent: 10170, prog: "Deep Rest", i: "PM", joined: "Aug 28" },
    { name: "Rohit Iyer", email: "rohit@iyer.co", city: "Chennai", orders: 1, spent: 16950, prog: "Slow Year", i: "RI", joined: "Sep 11" },
    { name: "Meera Nair", email: "meeranair@gmail.com", city: "Kochi", orders: 1, spent: 3390, prog: "Sleep 30", i: "MN", joined: "Sep 10" },
  ];
  return (
    <>
      <div className="admin-header">
        <div><h1>Customers</h1><p className="text-muted" style={{ marginTop: 6 }}>412 total · 89 enrolled in wellness program</p></div>
        <div style={{ display: "flex", gap: 12 }}>
          <div className="admin-search"><Icon.Search /><input placeholder="Search…" /></div>
          <button className="btn btn-outline btn-sm"><Icon.Download /> Export</button>
        </div>
      </div>

      <div className="panel" style={{ padding: 0 }}>
        <table className="table">
          <thead><tr><th>Customer</th><th>City</th><th>Orders</th><th>Total spent</th><th>Program</th><th>Joined</th><th></th></tr></thead>
          <tbody>
            {customers.map((c, i) => (
              <tr key={i}>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 36, height: 36, borderRadius: "50%", background: "var(--lavender-soft)", color: "var(--purple)", display: "grid", placeItems: "center", fontWeight: 700, fontSize: 12 }}>{c.i}</div>
                    <div>
                      <div style={{ fontWeight: 600 }}>{c.name}</div>
                      <div style={{ fontSize: 12, color: "var(--ink-3)" }}>{c.email}</div>
                    </div>
                  </div>
                </td>
                <td className="text-muted">{c.city}</td>
                <td>{c.orders}</td>
                <td style={{ fontWeight: 600 }}>₹{c.spent.toLocaleString("en-IN")}</td>
                <td><div className="tag">{c.prog}</div></td>
                <td className="text-muted">{c.joined}</td>
                <td><button className="btn btn-ghost btn-sm" style={{ padding: "6px 10px" }}><Icon.MoreH /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

/* ---------------- INVENTORY ---------------- */
function AdminInventory() {
  const skus = [
    { name: "Slow Mo · 10 pack (mixed berry)", sku: "SM-MB-10", stock: 1840, allocated: 1420, forecast: 950, level: "hi" },
    { name: "Slow Mo · 15 pack (mixed berry)", sku: "SM-MB-15", stock: 620, allocated: 484, forecast: 380, level: "mid" },
    { name: "Slow Mo · 30 pack (mixed berry)", sku: "SM-MB-30", stock: 128, allocated: 96, forecast: 105, level: "lo" },
  ];
  return (
    <>
      <div className="admin-header">
        <div><h1>Inventory</h1><p className="text-muted" style={{ marginTop: 6 }}>Warehouse: Bengaluru · Last synced 2min ago</p></div>
        <div style={{ display: "flex", gap: 12 }}>
          <button className="btn btn-outline btn-sm"><Icon.Download /> Stock report</button>
          <button className="btn btn-primary btn-sm"><Icon.Plus /> Manual receipt</button>
        </div>
      </div>

      <div className="admin-grid-2">
        <div className="panel">
          <div className="panel-header">
            <div className="panel-title">Stock levels</div>
          </div>
          <div style={{ display: "grid", gap: 20 }}>
            {skus.map(s => (
              <div key={s.sku} style={{ padding: 20, background: "var(--cream)", borderRadius: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                  <div>
                    <div style={{ fontWeight: 600 }}>{s.name}</div>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--ink-3)", marginTop: 2 }}>{s.sku}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 500, color: "var(--forest)", lineHeight: 1 }}>{s.stock.toLocaleString("en-IN")}</div>
                    <div style={{ fontSize: 11, color: "var(--ink-3)", marginTop: 2 }}>units in stock</div>
                  </div>
                </div>
                <div className="inv-bar"><div className={`inv-bar-fill ${s.level}`} style={{ width: `${Math.min(100, (s.stock / 1500) * 100)}%` }}></div></div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10, fontSize: 12, color: "var(--ink-3)" }}>
                  <span>{s.allocated} allocated to open orders</span>
                  <span>{s.forecast} needed this week</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="panel">
          <div className="panel-header">
            <div className="panel-title">Batch info</div>
          </div>
          <div style={{ display: "grid", gap: 12 }}>
            {[
              { b: "B2609-A", made: "Sep 06 2026", exp: "Sep 06 2027", qty: 800 },
              { b: "B2609-B", made: "Sep 09 2026", exp: "Sep 09 2027", qty: 450 },
              { b: "B2609-C", made: "Sep 11 2026", exp: "Sep 11 2027", qty: 242 },
            ].map(b => (
              <div key={b.b} style={{ padding: 16, background: "var(--cream)", borderRadius: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--forest)", fontWeight: 600 }}>{b.b}</span>
                  <span className="tag tag-forest" style={{ fontSize: 11 }}>{b.qty} units</span>
                </div>
                <div style={{ fontSize: 12, color: "var(--ink-3)", display: "flex", justifyContent: "space-between" }}>
                  <span>Made {b.made}</span>
                  <span>Exp {b.exp}</span>
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 20, padding: 16, background: "var(--lavender-soft)", borderRadius: 12, fontSize: 13, color: "var(--purple)" }}>
            <strong>Reorder alert:</strong> at current velocity, stock lasts <strong>18 days</strong>. Next batch due Sep 24.
          </div>
        </div>
      </div>
    </>
  );
}

Object.assign(window, { Admin });
