import { useMemo, useRef, useState } from "react";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { http } from "../../../lib/http";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { ErrorMessage } from "../../ui/error-message";
import { LoadingSpinner } from "../../ui/loading-spinner";
import { MultiSelect, Option } from "react-multi-select-component";
import { selectLocalValues } from "../../../lib/select-local";
import { useCustomToast } from "../../../hooks/use-custom-toast";

export function UploadFileForm() {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl text-zinc-950">Завантажити файл</h2>
      <Form />
    </div>
  );
}

function Form() {
  const [file, setFile] = useState<File | undefined>(undefined);
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedCategories, setSelectedCategories] = useState<Option[]>([]);
  const toast = useCustomToast();
  const queryClient = useQueryClient();

  const { data: categories, isError, isLoading } = useQuery({
    queryKey: ["get-all-categories"],
    queryFn: async () => {
      const { data } = await http.get<CategoriesResponse>("/categories");
      return data
    }
  })

  const { mutate, isPending } = useMutation({
    mutationKey: ["upload-file"],
    mutationFn: async (formData: FormData) => {
      await http.post("/document", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    },
    onSuccess: () => {
      toast({
        type: "success",
        content: "Файл успішно завантажено!",
      });
      queryClient.invalidateQueries({
        queryKey: ["get-all-files"],
      });
      setFile(undefined);
      setSelectedCategories([]);
      if(inputRef.current) inputRef.current.files = null; 
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
    if(!file) return;

    const formData = new FormData();
    formData.append("file", file);
    const selectedCatIdxs = selectedCategories.map((item) => +item.value);
    for (let i = 0; i < selectedCatIdxs.length; i++) {
      const item = selectedCatIdxs[i];
      formData.append("categories", item.toString());
    }

    mutate(formData);
  }

  const catOptions = useMemo(() => categories?.data.map((item) => {
    return {
      label: item.name,
      value: item.id,
    };
  }), [categories]);

  if(isLoading) return <LoadingSpinner />;
  if(isError || !categories || categories.error) return <ErrorMessage />;

  return (
    <form className="flex flex-col gap-3" onSubmit={onSubmit}>
      <div className="flex gap-2">
        <Input
          type="file"
          ref={inputRef}
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              setFile(e.target.files[0]);
            }
          }}
        />
        <Button type="submit" disabled={isPending || !file}>
          {isPending && (
            <Loader2 className="stroke-zinc-100 h-4 w-4 animate-spin mr-2" />
          )}
          Завантажити
        </Button>
      </div>
      {(!!catOptions && !!catOptions.length) &&
        <MultiSelect
          labelledBy="Select categories"
          value={selectedCategories}
          options={catOptions}
          onChange={setSelectedCategories}
          overrideStrings={selectLocalValues("Вибрати категорії", catOptions)}
        />
      }
    </form>
  );
}