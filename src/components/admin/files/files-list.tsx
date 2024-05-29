import { useMutation, useQuery } from "@tanstack/react-query";
import { http } from "../../../lib/http";
import { LoadingSpinner } from "../../ui/loading-spinner";
import { ErrorMessage } from "../../ui/error-message";
import { ExternalLinkIcon, Loader2, Trash } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "../../ui/badge";
import { useCustomToast } from "../../../hooks/use-custom-toast";
import { Dialog } from "../../ui/dialog";

export function FilesList() {
  return (
    <div className="flex flex-col gap-4 w-full">
      <h2 className="text-2xl text-zinc-950 mb-1">Список файлів</h2>
      <List />
    </div>
  );
}

function List() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["get-all-files"],
    queryFn: async () => {
      const { data } = await http.get<FilesResponse>("/files");
      return data;
    },
  });

  if (isLoading) return <LoadingSpinner />;
  if (isError || !data || data.error) return <ErrorMessage />;

  return (
    <div className="flex flex-col gap-3 w-full">
      {data.data.map((item) => (
        <FileCard key={item.id} file={item} refetch={refetch} />
      ))}
    </div>
  );
}

export function FileCard({ file, refetch }: { file: FileItem; refetch: any }) {
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center p-3 justify-between rounded-md bg-zinc-100">
      <div className="flex gap-3 items-start md:items-center flex-col md:flex-row">
        <p className="text-zinc-950 font-bold">{file.name}</p>
        <CategoriesBadges categories={file.categories}/>
      </div>
      <div className="flex gap-1 mt-2 md:mt-0">
        <DeleteButton id={file.id} name={file.name} refetch={refetch} />
        <Link to={`/admin/files/view/${file.id}`} className="inline-flex items-center justify-center rounded-md text-sm transition-all bg-transparent hover:bg-zinc-200 h-9 px-2 flex-shrink-0">
          <ExternalLinkIcon className="stroke-main size-4"/>
        </Link>
      </div>
    </div>
  );
}

function CategoriesBadges({categories}: {categories: CategoryItem[]}) {
  return (
    <div className="flex gap-2">
      {categories.map((item, index) => (
        <Badge key={`${item.id}-${index}`}>{item.name}</Badge>
      ))}
    </div>
  )
}

function DeleteButton({
  id,
  name,
  refetch,
}: {
  id: number;
  name: string;
  refetch: any;
}) {
  const toast = useCustomToast();

  const { mutate, isPending } = useMutation({
    mutationKey: ["delete-file", id],
    mutationFn: async (payload: { id: number }) => {
      await http.delete(`/files/${payload.id}`);
    },
    onSuccess: () => {
      toast({
        type: "success",
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
      description={`Файл ${name} буде видалено без можливості відновлення!`}
      onActionClick={() => mutate({ id })}
    />
  );
}
