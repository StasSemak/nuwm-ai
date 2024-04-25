import { useQuery } from "@tanstack/react-query";
import { http } from "../../lib/http";
import { LoadingSpinner } from "../ui/loading-spinner";
import { ErrorMessage } from "../ui/error-message";
import { ExternalLinkIcon, Trash } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "../ui/badge";

type FilesResponse = BaseResponse & {
  data: FileItem[];
};

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
        <Link to={`view/${file.id}`} className="inline-flex items-center justify-center rounded-md text-sm transition-all bg-transparent hover:bg-zinc-200 h-9 px-2 flex-shrink-0">
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
        refetch();
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
      <Trash className="stroke-main size-4" />
    </button>
  );
}
