import { useQuery } from "@tanstack/react-query";
import { http } from "../lib/http";
import { LoadingSpinner } from "./loading-spinner";
import { ErrorMessage } from "./error-message";
import { formatDate } from "../lib/utils";
import { Trash } from "lucide-react";

type FileItem = {
  id: number;
  name: string;
  createdAt: string;
};
type FilesListResponse = {
  error: boolean;
  message: string;
  data: FileItem[];
};

export function FilesList() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["get-all-files"],
    queryFn: async () => {
      const { data } = await http.get<FilesListResponse>("/files");
      return data;
    },
  });

  if (isLoading) return <LoadingSpinner />;
  if (isError || !data || data.error) return <ErrorMessage />;

  return (
    <div className="flex flex-col gap-3 w-full">
      <h2 className="text-2xl text-zinc-950 mb-1">Список файлів</h2>
      {data.data.map((item) => (
        <FileCard key={item.id} file={item} />
      ))}
    </div>
  );
}

export function FileCard({ file }: { file: FileItem }) {
  return (
    <div className="flex items-center px-3 justify-between rounded-md h-14 bg-zinc-100">
      <div className="flex gap-2">
        <p className="text-zinc-950 font-bold">{file.name}</p>
        <p className="text-sm mt-0.5">{formatDate(file.createdAt)}</p>
      </div>
      <DeleteButton id={file.id} name={file.name} />
    </div>
  );
}

function DeleteButton({ id, name }: { id: number; name: string }) {
  function deleteHandler() {
    if (
      !confirm(
        `Ви впевнені? Файл ${name} буде видалено без можливості відновлення!`
      )
    ) {
      return;
    }

    http
      .delete(`/files/${id}`)
      .then(() => {
        alert("Операція успішна!");
      })
      .catch(() => {
        alert("Виникла помилка! Спробуйте ще раз");
      });
  }

  return (
    <button
      className="inline-flex items-center justify-center rounded-md text-sm transition-all bg-transparent hover:bg-zinc-200 h-9 px-2 flex-shrink-0"
      onClick={deleteHandler}
    >
      <Trash className="stroke-main h-4 w-4" />
    </button>
  );
}
