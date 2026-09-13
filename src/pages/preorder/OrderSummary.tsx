import { useAppSelector } from "../../app/store";
import { usePacks, usePrograms } from "../../features/catalog/hooks";
import { discount, formatInr, packByQty, programByKey } from "../../lib/money";

export function OrderSummary() {
  const draft = useAppSelector((state) => state.checkout);
  const { data: packs } = usePacks();
  const { data: programs } = usePrograms();
  const pack = packByQty(packs, draft.qty);
  const program = programByKey(programs, draft.program);
  const save = discount(pack);
  return (
    <aside className="checkout-side">
      <div className="eyebrow">Order summary</div>
      <div className="order-item mt-4">
        <div className="order-thumb">
          <img src="/assets/slowmo-pouch.png" alt="pouch" />
        </div>
        <div>
          <div className="font-semibold">Slow Mo Gummies</div>
          <div className="text-xs text-[color:var(--ink-3)]">{pack.qty}-pack · Mixed berry</div>
          <strong>{formatInr(pack.price)}</strong>
        </div>
      </div>
      {program && (
        <div className="mb-4 flex items-center gap-3 rounded-xl border border-[color:var(--line)] bg-[color:var(--white)] p-3.5">
          <div>{program.icon}</div>
          <div className="flex-1 text-[13px]">
            <div className="font-semibold">{program.name}</div>
            <div className="text-[11px] text-[color:var(--ink-3)]">{program.duration}</div>
          </div>
          <div className="text-xs font-semibold text-[color:var(--color-success)]">Free</div>
        </div>
      )}
      <div className="order-totals">
        <div className="order-total-row">
          <span>Subtotal</span>
          <span>{formatInr(pack.mrp)}</span>
        </div>
        {save > 0 && (
          <div className="order-total-row" style={{ color: "var(--berry)" }}>
            <span>Preorder discount</span>
            <span>−{formatInr(save)}</span>
          </div>
        )}
        <div className="order-total-row">
          <span>Delivery</span>
          <span style={{ color: "#1a7a4f", fontWeight: 600 }}>Free</span>
        </div>
        <div className="order-total-row grand">
          <span>Total</span>
          <span>{formatInr(pack.price)}</span>
        </div>
      </div>
    </aside>
  );
}
