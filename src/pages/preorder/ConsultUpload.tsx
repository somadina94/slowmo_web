import { Spinner } from "../../components/Spinner";
import { isImageMime } from "../../features/orders/actions";

export function ConsultUploadBody({
  pending,
  preview,
  name,
  type: _type,
}: {
  pending: boolean;
  preview: string;
  name: string;
  type: string;
}) {
  if (pending) {
    return (
      <span className="inline-flex items-center gap-2 text-sm">
        <Spinner /> Uploading…
      </span>
    );
  }
  if (preview) {
    return (
      <img src={preview} alt={name || "Prescription preview"} className="mx-auto max-h-72 rounded-xl object-contain" />
    );
  }
  return <>{name || "Drag and drop an image or PDF, or click to upload"}</>;
}

export function ConsultUploadMeta({ pending, name, type }: { pending: boolean; name: string; type: string }) {
  if (!name || pending) return null;
  return (
    <div className="mt-3 text-sm">
      {name}
      {type && !isImageMime(type) ? " · PDF ready" : ""}
    </div>
  );
}
