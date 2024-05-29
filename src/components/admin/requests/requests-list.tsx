import { useMutation, useQuery } from "@tanstack/react-query";
import { http } from "../../../lib/http";
import { LoadingSpinner } from "../../ui/loading-spinner";
import { ErrorMessage } from "../../ui/error-message";
import { useCustomToast } from "../../../hooks/use-custom-toast";
import { Dialog } from "../../ui/dialog";
import { CheckCircle2, ExternalLinkIcon, Loader2, Trash, XCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { formatDate } from "../../../lib/utils";

type RequestsResponse = BaseResponse & {
  data: RequestItem[];
}

export function RequestsList() {
  return (
    <div className="flex flex-col gap-4 w-full">
      <h2 className="text-2xl text-zinc-950 mb-1">Запити</h2>
      <List />
    </div>
  );
}

function List() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["get-all-requests"],
    queryFn: async () => {
      const { data } = await http.get<RequestsResponse>("/requests");
      return data;
    },
  });

  if (isLoading) return <LoadingSpinner />;
  if (isError || !data || data.error) return <ErrorMessage />;

  return (
    <div className="flex flex-col gap-3 w-full">
      {data.data.length === 0 && <p className="text-center text-xl font-bold text-main">Запитів не знайдено</p>}
      {data.data.map((item) => (
        <RequestCard key={item.id} request={item} refetch={refetch} />
      ))}
    </div>
  );
}

export function RequestCard({ request, refetch }: { request: RequestItem; refetch: any }) {
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center p-3 justify-between rounded-md bg-zinc-100">
      <div className="flex gap-3 items-start md:items-center flex-col md:flex-row">
        <p className="text-zinc-950 font-bold">{request.contactNumber}</p>
        <p className="text-sm mt-0.5">{formatDate(request.createdAt)}</p>
      </div>
      <div className="flex gap-1 mt-2 md:mt-0 items-center">
        <ListItemStatus isResolved={request.isResolved} />
        <DeleteButton id={request.id} contactNumber={request.contactNumber} refetch={refetch} />
        <Link to={`view/${request.id}`} className="inline-flex items-center justify-center rounded-md text-sm transition-all bg-transparent hover:bg-zinc-200 h-9 px-2 flex-shrink-0">
          <ExternalLinkIcon className="stroke-main size-4"/>
        </Link>
      </div>
    </div>
  );
}

function ListItemStatus({ isResolved }: { isResolved: boolean }) {
  return(
    <div className="flex gap-1.5 items-center mr-5">
      {isResolved ? 
        <CheckCircle2 className="size-4 stroke-emerald-700" />
      :
        <XCircle className="size-4 stroke-red-700" />
      }
      <p className="text-sm mt-0.5 font-bold">{isResolved ? "Відповідь дана" : "Без відповіді"}</p>
    </div>
  )
}

function DeleteButton({
  id,
  contactNumber,
  refetch,
}: {
  id: number;
  contactNumber: string;
  refetch: any;
}) {
  const toast = useCustomToast();

  const { mutate, isPending } = useMutation({
    mutationKey: ["delete-request", id],
    mutationFn: async (payload: { id: number }) => {
      await http.delete(`/requests/${payload.id}`);
    },
    onSuccess: () => {
      toast({
        type: "error",
        content: "Операція успішна!",
      });
      refetch();
    },
    onError: () => {
      toast({
        type: "error",
        content: "Виникла помилка! Спробуйте ще раз",
      });
    },
  })

  return (
    <Dialog
      trigger={
        <button
          className="inline-flex items-center justify-center rounded-md text-sm transition-all bg-transparent hover:bg-zinc-200 h-9 px-2 flex-shrink-0"
        >
          {isPending ? (
            <Loader2 className="stroke-main size-4 animate-spin" />
          ) : (
            <Trash className="stroke-main size-4" />
          )}
        </button>
      }
      title="Ви впевнені?"
      description={`Запит за номером ${contactNumber} буде видалено без можливості відновлення!`}
      onActionClick={() => mutate({ id })}
    />
  );
}