import { useQuery } from "@tanstack/react-query";
import { LoadingSpinner } from "../ui/loading-spinner";
import { ErrorMessage } from "../ui/error-message";
import { useNavigate } from "react-router-dom";
import { getSession } from "../../lib/auth";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["token"],
    queryFn: getSession,
  });

  if (isLoading) return <LoadingSpinner />;
  if (isError) return <ErrorMessage />;

  if (!data) navigate("/login");

  return <>{children}</>;
}
