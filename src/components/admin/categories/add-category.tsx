import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { http } from "../../../lib/http";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import { Loader2 } from "lucide-react";

type CreateCategoryPayload = {
  name: string;
};

export function AddCategory() {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl text-zinc-950">Створити категорію</h2>
      <Form />
    </div>
  );
}

function Form() {
  const [name, setName] = useState<string>("");

  const { mutate, isPending } = useMutation({
    mutationKey: ["create-category"],
    mutationFn: async (payload: CreateCategoryPayload) => {
      try {
        await http.post("/categories", payload);

        alert(`Категорію '${name}' успішно створено!`);
        window.location.reload();
      } catch {
        alert("Виникла помилка! Спробуйте ще раз");
      }
    },
  });

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (name.length === 0) return;

    mutate({ name });
  }

  return (
    <form className="flex gap-2" onSubmit={onSubmit}>
      <Input
        name="name"
        placeholder="Ім'я категорії"
        onChange={(e) => {
          setName(e.target.value);
        }}
      />
      <Button type="submit" disabled={isPending || name.length === 0}>
        {isPending && (
          <Loader2 className="stroke-zinc-100 h-4 w-4 animate-spin mr-2" />
        )}
        Створити
      </Button>
    </form>
  );
}
