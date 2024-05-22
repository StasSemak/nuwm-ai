import { useParams } from "react-router-dom";
import { http } from "../../../lib/http";
import { useQuery } from "@tanstack/react-query";
import { ErrorMessage } from "../../ui/error-message";
import { LoadingSpinner } from "../../ui/loading-spinner";
import { FileCard } from "../files/files-list";

type CategoryResponse = BaseResponse & {
  data: CategoryItem;
};

export function CategoryView() {
  const { id } = useParams();

  const { data, isError, isLoading } = useQuery({
    queryKey: ["get-one-category"],
    queryFn: async () => {
      const { data } = await http.get<CategoryResponse>(`/categories/${id}`);
      return data;
    },
  });

  if(isLoading) return <LoadingSpinner />;
  if(isError || !data || data.error) return <ErrorMessage />;

  return(
    <div className="flex flex-col gap-4 w-full">
      <p className="text-zinc-950 text-xl">
        Категорія
        <span className="ml-2 font-bold">{data.data.name}</span>
      </p>
      <FilesList categoryId={data.data.id} />
    </div>
  )
}

function FilesList({categoryId}: {categoryId: number}) {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: [`get-files-by-category-${categoryId}`],
    queryFn: async () => {
      const { data } = await http.get<FilesResponse>(`/files/category/${categoryId}`);
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
