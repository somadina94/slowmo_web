import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../app/store";
import { firstName } from "../../lib/checkout";

export function StepConfirmation() {
  const navigate = useNavigate();
  const draft = useAppSelector((state) => state.checkout);
  return (
    <div className="confirmation">
      <div className="eyebrow">Order confirmed</div>
      <h2 className="mb-2 mt-3">Your slow days start here.</h2>
      <p>
        Thanks {firstName(draft.name)}. We'll call you at {draft.phone || "your number"} within 24 hours.
      </p>
      <div className="order-id">ORDER {draft.orderId || "SM-XXXXXX"}</div>
      <button className="btn btn-outline mt-10" onClick={() => navigate("/")}>
        Back to home
      </button>
    </div>
  );
}
