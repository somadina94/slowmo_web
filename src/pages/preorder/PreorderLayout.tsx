import { Outlet, useLocation } from "react-router-dom";
import { Footer } from "../../components/Footer";
import { Icon } from "../../components/icons";
import { Nav } from "../../components/Nav";
import { stepFromPath } from "../../lib/checkout";

export function ProgressBar({ step }: { step: number }) {
  const steps = ["Product", "Program", "Consult", "Address & Pay"];
  return (
    <div className="checkout-progress">
      {steps.map((label, index) => {
        const n = index + 1;
        const cls = step === n ? "active" : step > n ? "done" : "";
        return (
          <div key={label} className={`cp-step ${cls}`}>
            <div className="cp-step-num">{step > n ? <Icon.Check /> : n}</div>
            <span>{label}</span>
          </div>
        );
      })}
    </div>
  );
}

export function PreorderLayout() {
  const step = stepFromPath(useLocation().pathname);
  return (
    <>
      <Nav />
      <div className="checkout-shell">
        <div className="container">
          {step < 5 && <ProgressBar step={step} />}
          <Outlet />
        </div>
      </div>
      <Footer />
    </>
  );
}
