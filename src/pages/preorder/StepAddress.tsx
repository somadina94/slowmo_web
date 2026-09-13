import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/store";
import { patchDraft } from "../../features/checkout/checkoutSlice";
import { usePlaceOrder, useVerifyPayment } from "../../features/orders/hooks";
import { Icon } from "../../components/icons";
import { canSubmitAddress, STATES } from "../../lib/checkout";
import { formatInr, packByQty } from "../../lib/money";
import { usePacks } from "../../features/catalog/hooks";
import { OrderSummary } from "./OrderSummary";
import { BusyButton } from "../../components/BusyButton";
import { maybePayRazorpay, openRazorpay } from "../../lib/razorpay";
import { notifyError } from "../../lib/toast";

export { maybePayRazorpay, openRazorpay };

export async function submitCheckout(
  ready: boolean,
  place: () => Promise<{
    public_id: string;
    razorpay?: { order_id: string; amount: number; key_id: string; currency?: string } | null;
  }>,
  verify: (payload: {
    public_id: string;
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }) => Promise<unknown>,
  onPlaced: (publicId: string) => void,
  onDone: () => void,
  prefill?: { name?: string; email?: string; contact?: string },
) {
  if (!ready) return;
  try {
    const order = await place();
    onPlaced(order.public_id);
    await maybePayRazorpay(order, verify, openRazorpay, prefill);
    onDone();
  } catch (error) {
    notifyError(error);
  }
}

export function StepAddress() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const draft = useAppSelector((state) => state.checkout);
  const { data: packs } = usePacks();
  const place = usePlaceOrder();
  const verify = useVerifyPayment();
  const pack = packByQty(packs, draft.qty);
  const ready = canSubmitAddress(draft);
  const submit = () =>
    submitCheckout(
      ready,
      () => place.mutateAsync(draft),
      (payload) => verify.mutateAsync(payload),
      (publicId) => dispatch(patchDraft({ orderId: publicId })),
      () => navigate("/confirmation"),
      { name: draft.name, email: draft.email, contact: draft.phone },
    );
  return (
    <div className="checkout-grid">
      <div className="checkout-main">
        <div className="eyebrow">Step 4 of 4</div>
        <h2 className="mb-6 mt-3">Where should we send it?</h2>
        <div className="grid gap-3">
          <input
            className="field-input"
            placeholder="Full name"
            value={draft.name}
            onChange={(e) => dispatch(patchDraft({ name: e.target.value }))}
          />
          <input
            className="field-input"
            placeholder="Phone"
            value={draft.phone}
            onChange={(e) => dispatch(patchDraft({ phone: e.target.value }))}
          />
          <input
            className="field-input"
            placeholder="Email"
            value={draft.email}
            onChange={(e) => dispatch(patchDraft({ email: e.target.value }))}
          />
          <textarea
            className="field-input"
            placeholder="Address"
            value={draft.address}
            onChange={(e) => dispatch(patchDraft({ address: e.target.value }))}
          />
          <input
            className="field-input"
            placeholder="City"
            value={draft.city}
            onChange={(e) => dispatch(patchDraft({ city: e.target.value }))}
          />
          <input
            className="field-input"
            placeholder="PIN code"
            value={draft.pincode}
            onChange={(e) => dispatch(patchDraft({ pincode: e.target.value }))}
          />
          <select
            className="field-input"
            value={draft.state}
            onChange={(e) => dispatch(patchDraft({ state: e.target.value }))}
          >
            {STATES.map((state) => (
              <option key={state}>{state}</option>
            ))}
          </select>
        </div>
        <div
          className={`pay-option ${draft.payment === "cod" ? "selected" : ""}`}
          onClick={() => dispatch(patchDraft({ payment: "cod" }))}
        >
          <div className="pay-radio" />
          <Icon.Cash />
          <div className="pay-body">
            <div className="pay-title">Cash on Delivery</div>
          </div>
        </div>
        <div
          className={`pay-option ${draft.payment === "prepaid" ? "selected" : ""}`}
          onClick={() => dispatch(patchDraft({ payment: "prepaid" }))}
        >
          <div className="pay-radio" />
          <Icon.Card />
          <div className="pay-body">
            <div className="pay-title">UPI / Card / NetBanking</div>
            <div className="pay-sub">Pay securely with Razorpay</div>
          </div>
        </div>
        <label className="mt-4 flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={draft.ageConfirmed}
            onChange={(e) => dispatch(patchDraft({ ageConfirmed: e.target.checked }))}
          />
          I confirm I am 21+ and agree to the wellness program terms.
        </label>
        <BusyButton
          className="btn btn-primary btn-lg mt-8 w-full justify-center"
          disabled={!ready}
          busy={place.isPending || verify.isPending}
          onClick={() => void submit()}
        >
          Confirm preorder — {formatInr(pack.price)}
        </BusyButton>
      </div>
      <OrderSummary />
    </div>
  );
}
