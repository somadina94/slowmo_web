import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/store";
import { setConsultMode } from "../../features/ui/uiSlice";
import { patchDraft } from "../../features/checkout/checkoutSlice";
import { useUploadRx } from "../../features/orders/hooks";
import { isImageMime } from "../../features/orders/actions";
import { Icon } from "../../components/icons";
import { BusyButton } from "../../components/BusyButton";
import { ConsultUploadBody, ConsultUploadMeta } from "./ConsultUpload";
import { canContinueConsult, SLOTS } from "../../lib/checkout";
import { OrderSummary } from "./OrderSummary";

export function StepConsult() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const draft = useAppSelector((state) => state.checkout);
  const mode = useAppSelector((state) => state.ui.consultMode);
  const upload = useUploadRx();
  const ready = canContinueConsult(draft, mode);
  const [preview, setPreview] = useState("");
  const [previewType, setPreviewType] = useState("");
  useEffect(
    () => () => {
      if (preview) URL.revokeObjectURL(preview);
    },
    [preview],
  );
  return (
    <div className="checkout-grid">
      <div className="checkout-main">
        <div className="eyebrow">Step 3 of 4 · Required</div>
        <h2 className="mb-2 mt-3">
          Talk to a specialist —{" "}
          <em style={{ color: "var(--purple)", fontStyle: "italic" }}>or upload a prescription.</em>
        </h2>
        <div className="mb-7 grid grid-cols-2 gap-2 rounded-[14px] bg-[color:var(--cream-2)] p-1">
          <button
            className="rounded-[10px] p-3 font-semibold"
            style={{ background: mode === "book" ? "var(--white)" : "transparent" }}
            onClick={() => dispatch(setConsultMode("book"))}
          >
            Book a consult
          </button>
          <button
            className="rounded-[10px] p-3 font-semibold"
            style={{ background: mode === "rx" ? "var(--white)" : "transparent" }}
            onClick={() => dispatch(setConsultMode("rx"))}
          >
            Upload prescription
          </button>
        </div>
        {mode === "book" ? (
          <div className="grid gap-3">
            <input
              className="field-input"
              placeholder="Full name"
              value={draft.consultName}
              onChange={(e) => dispatch(patchDraft({ consultName: e.target.value }))}
            />
            <input
              className="field-input"
              placeholder="Phone"
              value={draft.consultPhone}
              onChange={(e) => dispatch(patchDraft({ consultPhone: e.target.value }))}
            />
            <input
              className="field-input"
              placeholder="Email"
              value={draft.consultEmail}
              onChange={(e) => dispatch(patchDraft({ consultEmail: e.target.value }))}
            />
            <textarea
              className="field-input"
              placeholder="Sleep issue (optional)"
              value={draft.consultReason}
              onChange={(e) => dispatch(patchDraft({ consultReason: e.target.value }))}
            />
            <div className="grid grid-cols-3 gap-2">
              {SLOTS.map((slot) => (
                <button
                  key={slot}
                  className={`slot ${draft.consultSlot === slot ? "selected" : ""}`}
                  onClick={() => dispatch(patchDraft({ consultSlot: slot }))}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <label className="block cursor-pointer rounded-[20px] border-2 border-dashed p-8 text-center">
            <input
              type="file"
              accept="image/*,.pdf"
              hidden
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                if (preview) URL.revokeObjectURL(preview);
                setPreviewType(file.type);
                setPreview(isImageMime(file.type) ? URL.createObjectURL(file) : "");
                void upload
                  .mutateAsync(file)
                  .then((res) => dispatch(patchDraft({ rxFileId: res.id, rxFileName: res.filename })))
                  .catch(() => undefined);
              }}
            />
            <ConsultUploadBody
              pending={upload.isPending}
              preview={preview}
              name={draft.rxFileName}
              type={previewType}
            />
            <ConsultUploadMeta pending={upload.isPending} name={draft.rxFileName} type={previewType} />
          </label>
        )}
        <BusyButton
          className="btn btn-primary btn-lg mt-8 w-full justify-center"
          disabled={!ready}
          onClick={() => ready && navigate("/address")}
        >
          Continue <Icon.ArrowRight />
        </BusyButton>
      </div>
      <OrderSummary />
    </div>
  );
}
