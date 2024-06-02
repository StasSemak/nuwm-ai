import { QueryClient, QueryFilters, useIsFetching } from "@tanstack/react-query";

export function useIsBgFetching(
  filters?: QueryFilters,
  queryClient?: QueryClient,
): number {
  return useIsFetching({
    predicate: (query) => query.state.data !== undefined,
    ...filters,
  }, queryClient);
}