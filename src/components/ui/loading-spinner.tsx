import { Loader2 } from "lucide-react";

export function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center mt-5">
      <Loader2 className="stroke-main size-12 animate-spin" />
    </div>
  );
}
