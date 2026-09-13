import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/store";
import { usePacks } from "../../features/catalog/hooks";
import { patchDraft } from "../../features/checkout/checkoutSlice";
import { Icon } from "../../components/icons";
import { discount, formatInr } from "../../lib/money";
import { OrderSummary } from "./OrderSummary";

export function StepProduct() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const qty = useAppSelector((state) => state.checkout.qty);
  const { data: packs } = usePacks();
  return (
    <div className="checkout-grid">
      <div className="checkout-main">
        <div className="eyebrow">Preorder · Ships Oct 2026</div>
        <h2 className="mb-4 mt-3">
          Slow Mo
          <br />
          <em style={{ color: "var(--purple)", fontStyle: "italic", fontWeight: 400 }}>wellness gummies.</em>
        </h2>
        <p className="mb-6 text-[color:var(--ink-2)]">
          Mixed-berry gummies · 3.5mg Vijaya extract each · Ayurvedic proprietary medicine, prescription use only.
        </p>
        <div className="qty-select">
          {packs.map((pack) => (
            <div
              key={pack.sku}
              className={`qty-option ${qty === pack.qty ? "selected" : ""}`}
              onClick={() => dispatch(patchDraft({ qty: pack.qty as 10 | 15 | 30 }))}
            >
              <div className="qty">{pack.qty} pack</div>
              <div className="qty-label">{pack.desc}</div>
              <div className="mt-1.5 text-sm font-bold">{formatInr(pack.price)}</div>
              {discount(pack) > 0 && <div className="qty-save">Save {formatInr(discount(pack))}</div>}
            </div>
          ))}
        </div>
        <button className="btn btn-primary btn-lg mt-8 w-full justify-center" onClick={() => navigate("/program")}>
          Continue to wellness program <Icon.ArrowRight />
        </button>
      </div>
      <OrderSummary />
    </div>
  );
}
