import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { http } from "../../lib/http";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { ErrorMessage } from "../ui/error-message";
import { LoadingSpinner } from "../ui/loading-spinner";

type CategoryItem = {
  id: number;
  name: string; 
}
type CategoriesResponse = {
  error: boolean;
  message: string;
  data: CategoryItem[];
}

export function UploadFileForm() {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl text-zinc-950">Завантажити файл</h2>
      <Form />
    </div>
  );
}

function Form() {
  const [file, setFile] = useState<File | undefined>();

  const { data: categories, isError, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data } = await http.get<CategoriesResponse>("/categories");
      return data
    }
  })

  const { mutate, isPending } = useMutation({
    mutationKey: ["upload-file"],
    mutationFn: async (formData: FormData) => {
      try {
        await http.post("/document", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        alert("Файл успішно завантажено!");
        window.location.reload();
      }
      catch {
        alert("Виникла помилка! Спробуйте ще раз");
      }
    },
  });

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if(!file) return;

    const formData = new FormData();
    formData.append("file", file);

    mutate(formData);
  }

  if(isLoading) return <LoadingSpinner />;
  if(isError) return <ErrorMessage />;

  return (
    <form className="flex gap-2" onSubmit={onSubmit}>
      <Input
        type="file"
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
    </form>
  );
}