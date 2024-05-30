import { QueryClient, QueryFilters, notifyManager, useQueryClient } from "@tanstack/react-query";
import React from "react";

export function useIsBgFetching(
  filters?: QueryFilters,
  queryClient?: QueryClient,
): number {
  const client = useQueryClient(queryClient)
  const queryCache = client.getQueryCache()

  return React.useSyncExternalStore(
    React.useCallback(
      (onStoreChange) =>
        queryCache.subscribe(notifyManager.batchCalls(onStoreChange)),
      [queryCache],
    ),
    () => client.getQueryState(filters?.queryKey ?? [""])?.status !== "pending" ? client.isFetching(filters) : 0,
    () => client.getQueryState(filters?.queryKey ?? [""])?.status !== "pending" ? client.isFetching(filters) : 0,
  )
}