import { useMutation, useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { http } from "../../../lib/http";
import { LoadingSpinner } from "../../ui/loading-spinner";
import { ErrorMessage } from "../../ui/error-message";
import { formatDate } from "../../../lib/utils";
import { useMemo, useState } from "react";
import { MultiSelect, Option } from "react-multi-select-component";
import { selectLocalValues } from "../../../lib/select-local";
import { Button } from "../../ui/button";
import { Loader2, X as XIcon } from "lucide-react";
import { useCustomToast } from "../../../hooks/use-custom-toast";
import { Dialog } from "../../ui/dialog";
import { RefreshingStatus } from "../../ui/refreshing";
import { NotFound } from "../../ui/not-found";

type FileResponse = BaseResponse & {
  data: FileItem;
};
type UpdateCategoriesPayload = {
  fileId: number;
  categoryIds: number[];
};

export function FileView() {
  const { id } = useParams();

  const { data, isError, isLoading, refetch } = useQuery({
    queryKey: ["get-one-file", id],
    queryFn: async () => {
      const { data } = await http.get<FileResponse>(`/files/${id}`);
      return data;
    },
  });

  if(isLoading) return <LoadingSpinner />;
  if(isError || !data || data.error) return <ErrorMessage />;
  if(!data.data) return <NotFound page="file"/>;

  const { data: file } = data

  return(
    <div className="flex flex-col gap-2.5 w-full">
      <div className="flex gap-5 items-center">
        <p className="text-zinc-950 text-xl font-bold">{file.name}</p>
        <RefreshingStatus queryKey={["get-one-file", id]}/>
      </div>
      <div className="flex gap-2">
        <p className="font-bold text-zinc-950">Створено:</p>
        <p className="text-zinc-950">{formatDate(file.createdAt)}</p>
      </div>
      <Categories categories={file.categories} fileId={file.id} refetch={refetch}/>
      <AddCategories categories={file.categories} fileId={file.id} refetch={refetch}/>
    </div>
  )
}

type CatItemProps = {
  category: CategoryItem;
  fileId: number;
  refetch: any;
}
function Categories({categories, fileId, refetch}: {categories: CategoryItem[], fileId: number, refetch: any}) {
  return(
    <div className="flex gap-2 flex-col">
      <p className="font-bold text-zinc-950">Категорії</p>
      {categories.map((item, index) => (
        <CategoryListItem key={`${index}-${item.id}`} category={item} fileId={fileId} refetch={refetch}/>
      ))}
    </div>
  )
}
function CategoryListItem({category, fileId, refetch}: CatItemProps) {
  return(
    <div className="flex gap-1">
      <p className="text-zinc-950">{category.name}</p>
      <DeleteCategoryButton category={category} fileId={fileId} refetch={refetch}/>
    </div>
  )
}
function DeleteCategoryButton({category, fileId, refetch}: CatItemProps) {
  const toast = useCustomToast();

  const { mutate, isPending } = useMutation({
    mutationKey: ["delete-category-from-file", fileId],
    mutationFn: async (payload: {fileId: number, categoryId: number}) => {
      await http.post(`/categories/remove`, payload);
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
          className="inline-flex items-center justify-center rounded-md text-sm transition-all bg-transparent hover:bg-secondary/10 p-1 flex-shrink-0"
        >
          {isPending ? (
            <Loader2 className="stroke-zinc-700 size-4 animate-spin" />
          ) : (
            <XIcon className="stroke-zinc-700 size-4" />
          )}
        </button>
      }
      title={"Ви впевнені?"}
      description={`Категорію '${category.name}' буде видалено з цього файлу!`}
      onActionClick={() => mutate({ fileId, categoryId: category.id })}
    />
  );
}

function AddCategories({categories, fileId, refetch}: {categories: CategoryItem[], fileId: number, refetch: any}) {
  return(
    <div className="flex flex-col gap-2 w-full mt-3">
      <h2 className="text-xl text-zinc-950">Додати категорії</h2>
      <Form categories={categories} fileId={fileId} refetch={refetch}/>
    </div>
  )
}

function Form({categories, fileId, refetch}: {categories: CategoryItem[], fileId: number, refetch: any}) {
  const [selectedCategories, setSelectedCategories] = useState<Option[]>([]);
  const toast = useCustomToast();

  const { data, isError, isLoading } = useQuery({
    queryKey: ["get-all-categories"],
    queryFn: async () => {
      const { data } = await http.get<CategoriesResponse>("/categories");
      return data
    }
  })

  const { mutate, isPending } = useMutation({
    mutationKey: ["update-categories", fileId],
    mutationFn: async (payload: UpdateCategoriesPayload) => {
      await http.post("/categories/assign", payload);
    },
    onSuccess: () => {
      toast({
        type: "success",
        content: "Категорії успішно оновлено!",
      });
      refetch();
      setSelectedCategories([]);
    },
    onError: () => {
      toast({
        type: "error",
        content: "Виникла помилка! Спробуйте ще раз",
      });
    },
  });

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if(selectedCategories.length === 0) return;

    const selectedCatIdxs = selectedCategories.map((item) => +item.value);

    mutate({ 
      fileId: fileId, 
      categoryIds: selectedCatIdxs,
    });
  }

  const catOptions = useMemo(() => data?.data.map((item) => {
    let isDisabled = false;
    for (let i = 0; i < categories.length; i++) {
      if(categories[i].id === item.id) isDisabled = true;
    }
    return {
      label: item.name,
      value: item.id,
      disabled: isDisabled,
    };
  }), [data, categories]);

  if(isLoading) return <LoadingSpinner />;
  if(isError || !data || data.error) return <ErrorMessage />;

  if(!catOptions || catOptions.length === 0) return null;

  return(
    <form className="flex gap-2 w-full" onSubmit={onSubmit}>
      <MultiSelect
        labelledBy="Select categories"
        value={selectedCategories}
        options={catOptions}
        onChange={setSelectedCategories}
        overrideStrings={selectLocalValues("Вибрати категорії", catOptions)}
        className="flex-grow"
      />
      <Button type="submit" disabled={isPending || selectedCategories.length === 0}>
        {isPending && (
          <Loader2 className="stroke-zinc-100 h-4 w-4 animate-spin mr-2" />
        )}
        Додати
      </Button>
    </form>
  )
}
