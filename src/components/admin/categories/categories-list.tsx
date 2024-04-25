import { useQuery } from "@tanstack/react-query";
import { http } from "../../../lib/http";
import { LoadingSpinner } from "../../ui/loading-spinner";
import { ErrorMessage } from "../../ui/error-message";
import { Trash } from "lucide-react";

export function CategoriesList() {
  return (
    <div className="flex flex-col gap-4 w-full">
      <h2 className="text-2xl text-zinc-950 mb-1">Список категорій</h2>
      <List />
    </div>
  );
}

function List() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["get-all-categories"],
    queryFn: async () => {
      const { data } = await http.get<CategoriesResponse>("/categories");
      return data;
    },
  });

  if (isLoading) return <LoadingSpinner />;
  if (isError || !data || data.error) return <ErrorMessage />;

  return (
    <div className="flex flex-col gap-3 w-full">
      {data.data.map((item) => (
        <CategoryCard key={item.id} category={item} refetch={refetch} />
      ))}
    </div>
  );
}

export function CategoryCard({
  category,
  refetch,
}: {
  category: CategoryItem;
  refetch: any;
}) {
  return (
    <div className="flex items-center px-3 justify-between rounded-md h-14 bg-zinc-100">
      <p className="text-zinc-950 font-bold">{category.name}</p>
      <DeleteButton id={category.id} name={category.name} refetch={refetch} />
    </div>
  );
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
        `Ви впевнені? Категорію '${name}' буде видалено без можливості відновлення!`
      )
    ) {
      return;
    }

    http
      .delete(`/categories/${id}`)
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
      <Trash className="stroke-main h-4 w-4" />
    </button>
  );
}
