import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/store";
import { usePrograms } from "../../features/catalog/hooks";
import { patchDraft } from "../../features/checkout/checkoutSlice";
import { Icon } from "../../components/icons";
import { OrderSummary } from "./OrderSummary";
import { notifyError } from "../../lib/toast";

export function continueProgramStep(selected: string | null, go: (path: string) => void) {
  if (!selected) {
    notifyError("Pick a wellness program, or skip this step.");
    return false;
  }
  go("/consult");
  return true;
}

export function StepProgram() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const selected = useAppSelector((state) => state.checkout.program);
  const { data: programs } = usePrograms();
  return (
    <div className="checkout-grid">
      <div className="checkout-main">
        <div className="eyebrow">Step 2 of 4</div>
        <h2 className="mb-2 mt-3">Pick a wellness program.</h2>
        <p className="mb-6 text-sm text-[color:var(--ink-3)]">
          Choose one to continue, or skip if you’d rather not enroll.
        </p>
        <div className="grid gap-3">
          {programs.map((program) => (
            <button
              key={program.key}
              type="button"
              className="rounded-[20px] border p-6 text-left"
              style={{
                borderColor: selected === program.key ? "var(--purple)" : "var(--line)",
                background: selected === program.key ? "var(--lavender-soft)" : "var(--white)",
              }}
              onClick={() => dispatch(patchDraft({ program: program.key, programSkipped: false }))}
            >
              <div className="font-display text-[22px] font-semibold">{program.name}</div>
              <div className="text-sm text-[color:var(--ink-2)]">{program.description}</div>
            </button>
          ))}
        </div>
        <div className="mt-10 flex flex-wrap gap-3">
          <button
            type="button"
            className="btn btn-primary btn-lg"
            aria-disabled={!selected}
            onClick={() => continueProgramStep(selected, navigate)}
          >
            Continue <Icon.ArrowRight />
          </button>
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => {
              dispatch(patchDraft({ program: null, programSkipped: true }));
              navigate("/consult");
            }}
          >
            Skip program →
          </button>
        </div>
      </div>
      <OrderSummary />
    </div>
  );
}
