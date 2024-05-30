import { QueryKey } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useIsBgFetching } from "../../hooks/use-is-bg-fetching";

export function RefreshingStatus({ queryKey }: { queryKey: QueryKey }) {
  const isBgFetching = useIsBgFetching({ queryKey });

  if(isBgFetching !== 1) return null;

  return (
    <div className="flex gap-1.5 items-center">
      <Loader2 className="stroke-zinc-950 size-4 animate-spin" />
      <p className="text-zinc-950 text-sm mt-0.5 hidden sm:block">Оновлення</p>
    </div>
  );
}
