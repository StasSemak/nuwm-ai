import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { http } from "../../../lib/http";
import { LoadingSpinner } from "../../ui/loading-spinner";
import { ErrorMessage } from "../../ui/error-message";
import { formatDate } from "../../../lib/utils";
import { HistoryListItem } from "../history/history-list";
import { Dialog } from "../../ui/dialog";
import { useCustomToast } from "../../../hooks/use-custom-toast";
import { Pen } from "lucide-react";

type RequestResponse = BaseResponse & {
  data: RequestItem;
}

export function RequestView() {
  const { id } = useParams();

  const { data, isError, isLoading, refetch } = useQuery({
    queryKey: ["get-one-request"],
    queryFn: async () => {
      const { data } = await http.get<RequestResponse>(`/requests/${id}`);
      return data;
    },
  });

  if (isLoading) return <LoadingSpinner />;
  if (isError || !data || data.error) return <ErrorMessage />;

  const { data: request } = data;

  return (
    <div className="flex flex-col gap-2.5 w-full">
      <h2 className="text-zinc-950 text-2xl font-bold">Запит #{request.id}</h2>
      <RequestListItem caption="Контактний номер:" content={request.contactNumber}/>
      <RequestListItem caption="Створено:" content={formatDate(request.createdAt)}/>
      <RequestListItem caption="Статус:" content={<ChangeStatus id={request.id} isResolved={request.isResolved} refetch={refetch}/>}/>
      <RequestListItem caption="Чат:" content={request.chatId}/>
      <RequestChat chatId={request.chatId}/>
    </div>
  );
}

function RequestListItem({caption, content}: {caption: React.ReactNode, content: React.ReactNode}) {
  return(
    <div className="flex gap-2">
      <p className="font-bold text-zinc-950">{caption}</p>
      <p className="text-zinc-950">{content}</p>
    </div>
  )
}

function RequestChat({chatId}: {chatId: string}) {
  const { data, isError, isLoading } = useQuery({
    queryKey: ["get-request-chat"],
    queryFn: async () => {
      const { data } = await http.get<HistoryResponse>(`/history/${chatId}`);
      return data;
    },
  });

  if (isLoading) return <LoadingSpinner />;
  if (isError || !data || data.error) return <ErrorMessage />;
  if (data.data.length === 0) return null;

  return(
    <div className="flex flex-col gap-4 w-full mt-3">
      <h2 className="text-xl text-zinc-950 -mb-1">Чат користувача</h2>
      {data.data.map((item, index) => (
        <HistoryListItem key={index} {...item}/>
      ))}
    </div>
  )
}

function ChangeStatus({id, isResolved, refetch}: {id: number, isResolved: boolean, refetch: any}) {
  const toast = useCustomToast();

  function updateHandler() {
    http
      .put(`/requests`, {
        id: id,
        isResolved: !isResolved,
      })
      .then(() => {
        toast({
          type: "success",
          content: "Операція успішна!",
        });
        refetch();
      })
      .catch(() => {
        toast({
          type: "error",
          content: "Виникла помилка! Спробуйте ще раз",
        });
      });
  }

  return (
    <div className="flex gap-2 items-center">
      <p className="text-zinc-950">{isResolved ? "Відповідь дана" : "Без відповіді"}</p>
      <Dialog
        trigger={
          <button
            className="inline-flex items-center justify-center rounded-md text-sm transition-all bg-transparent hover:bg-secondary/10 py-1 px-2 flex-shrink-0"
          >
            <Pen className="size-4 stroke-main mr-1.5"/>
            <span className="leading-4">Змінити</span>
          </button>
        }
        title={"Ви впевнені?"}
        description={`Статус запиту буде змінено на '${isResolved ? "Без відповіді" : "Відповідь дана"}'`}
        onActionClick={updateHandler}
      />
    </div>
  );
}