import { useMutation, useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { http } from "../../lib/http";
import { LoadingSpinner } from "../ui/loading-spinner";
import { ErrorMessage } from "../ui/error-message";
import { formatDate } from "../../lib/utils";
import { useState } from "react";
import { MultiSelect, Option } from "react-multi-select-component";
import { selectLocalValues } from "../../lib/select-local";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";

type FileItem = {
  id: number;
  name: string;
  createdAt: string;
};
type CategoryItem = {
  id: number;
  name: string;
};
type FileResponse = {
  error: boolean;
  message: string;
  data: FileItem & {
    categories: CategoryItem[];
  };
};
type CategoriesResponse = {
  error: boolean;
  message: string;
  data: CategoryItem[];
};
type UpdateCategoriesPayload = {
  fileId: number;
  categoryIds: number[];
}

export function FileView() {
  const { id } = useParams();

  const { data, isError, isLoading } = useQuery({
    queryKey: ["get-one-file"],
    queryFn: async () => {
      const { data } = await http.get<FileResponse>(`/files/${id}`);
      return data;
    },
  });

  if(isLoading) return <LoadingSpinner />;
  if(isError || !data || data.error) return <ErrorMessage />;

  const { data: file } = data

  return(
    <div className="flex flex-col gap-2.5 w-full">
      <p className="text-zinc-950 text-xl font-bold">{file.name}</p>
      <div className="flex gap-2">
        <p className="font-bold text-zinc-950">Створено:</p>
        <p className="text-zinc-950">{formatDate(file.createdAt)}</p>
      </div>
      <Categories categories={file.categories}/>
      <AddCategories categories={file.categories} fileId={file.id}/>
    </div>
  )
}

function Categories({categories}: {categories: CategoryItem[]}) {
  return(
    <div className="flex gap-2">
      <p className="font-bold text-zinc-950">Категорії:</p>
      {categories.map((item, index) => (
        <p key={`${index}-${item.id}`} className="text-zinc-950">{item.name}</p>
      ))}
    </div>
  )
}

function AddCategories({categories, fileId}: {categories: CategoryItem[], fileId: number}) {
  return(
    <div className="flex flex-col gap-2 w-full mt-3">
      <h2 className="text-xl text-zinc-950">Додати категорії</h2>
      <Form categories={categories} fileId={fileId}/>
    </div>
  )
}

function Form({categories, fileId}: {categories: CategoryItem[], fileId: number}) {
  const [selectedCategories, setSelectedCategories] = useState<Option[]>([]);

  const { data, isError, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data } = await http.get<CategoriesResponse>("/categories");
      return data
    }
  })

  const { mutate, isPending } = useMutation({
    mutationKey: ["update-categories"],
    mutationFn: async (payload: UpdateCategoriesPayload) => {
      try {
        await http.post("/categories/assign", payload);

        alert("Категорії успішно оновлено!");
        window.location.reload();
      }
      catch {
        alert("Виникла помилка! Спробуйте ще раз");
      }
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

  if(isLoading) return <LoadingSpinner />;
  if(isError || !data || data.error) return <ErrorMessage />;

  const catOptions = data.data.map((item) => {
    let isDisabled = false;
    for (let i = 0; i < categories.length; i++) {
      if(categories[i].id === item.id) isDisabled = true;
    }
    return {
      label: item.name,
      value: item.id,
      disabled: isDisabled,
    };
  });

  if(catOptions.length === 0) return null;

  return(
    <form className="flex gap-2 w-full" onSubmit={onSubmit}>
      <MultiSelect
        labelledBy="Select categories"
        value={selectedCategories}
        options={catOptions}
        onChange={setSelectedCategories}
        overrideStrings={selectLocalValues("Вибрати категорії")}
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
