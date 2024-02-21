import { Loader2 } from "lucide-react";

export function LoadingSpinner() {
  return (
    <div className="flex-grow flex flex-col items-center justify-center">
      <Loader2 className="stroke-main size-12 animate-spin" />
    </div>
  );
}
