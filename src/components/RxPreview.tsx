import { useEffect } from "react";
import { useRxObjectUrl } from "../features/orders/hooks";
import { isImageMime } from "../features/orders/actions";
import { Spinner } from "./Spinner";

export function RxPreview({ fileId, mime, filename }: { fileId: number; mime?: string; filename?: string }) {
  const { data: url, isLoading, isError } = useRxObjectUrl(fileId);
  useEffect(
    () => () => {
      if (url) URL.revokeObjectURL(url);
    },
    [url],
  );

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Spinner />
        Loading prescription…
      </div>
    );
  }
  if (isError || !url) {
    return <p className="text-sm text-muted-foreground">Could not load prescription file.</p>;
  }
  if (isImageMime(mime)) {
    return (
      <img
        src={url}
        alt={filename || "Prescription"}
        className="max-h-96 w-full rounded-xl border bg-muted object-contain"
      />
    );
  }
  return (
    <div className="space-y-2">
      <iframe src={url} title={filename || "Prescription"} className="h-80 w-full rounded-xl border bg-muted" />
      <a className="text-sm underline-offset-4 hover:underline" href={url} target="_blank" rel="noreferrer">
        Open {filename || "file"}
      </a>
    </div>
  );
}
