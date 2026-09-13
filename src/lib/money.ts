export type Pack = {
  qty: number;
  price: number;
  mrp: number;
  label: string;
  desc: string;
  sku: string;
};

export const FALLBACK_PACKS: Pack[] = [
  { qty: 10, price: 3390, mrp: 3890, label: "Starter", desc: "10-day trial course", sku: "SM-MB-10" },
  { qty: 15, price: 4990, mrp: 5790, label: "Ritual", desc: "15-day balanced course", sku: "SM-MB-15" },
  { qty: 30, price: 8990, mrp: 11390, label: "Restore", desc: "30-day full course · Best value", sku: "SM-MB-30" },
];

export function formatInr(value: number): string {
  return `₹${value.toLocaleString("en-IN")}`;
}

export function packByQty(packs: Pack[], qty: number): Pack {
  return packs.find((item) => item.qty === qty) || packs[0] || FALLBACK_PACKS[0];
}

export function discount(pack: Pack): number {
  return Math.max(pack.mrp - pack.price, 0);
}

export type Program = {
  key: string;
  name: string;
  description: string;
  duration: string;
  icon: string;
};

export const FALLBACK_PROGRAMS: Program[] = [
  {
    key: "sleep30",
    name: "Sleep 30",
    description: "A 30-day guided sleep reset — daily audio, sleep journal, weekly check-in.",
    duration: "30 days",
    icon: "🌙",
  },
  {
    key: "deep-rest",
    name: "Deep Rest",
    description: "Focus on unwinding the nervous system — breathwork, evening yoga, doctor calls.",
    duration: "60 days",
    icon: "🌿",
  },
  {
    key: "slow-year",
    name: "Slow Year",
    description: "Year-long companion — quarterly consults, seasonal protocols, community access.",
    duration: "12 months",
    icon: "✧",
  },
];

export function programByKey(programs: Program[], key: string | null): Program | undefined {
  if (!key) return undefined;
  return programs.find((item) => item.key === key);
}
