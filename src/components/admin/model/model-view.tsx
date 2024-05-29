import { useMutation, useQuery } from "@tanstack/react-query";
import { http } from "../../../lib/http";
import { LoadingSpinner } from "../../ui/loading-spinner";
import { ErrorMessage } from "../../ui/error-message";
import { Button } from "../../ui/button";
import { Loader2 } from "lucide-react";
import { Select } from "../../ui/select";
import { useRef, useState } from "react";
import { useCustomToast } from "../../../hooks/use-custom-toast";

type ModelItem = {
  id: number;
  name: string;
  isActive: boolean;
};
type ModelResponse = BaseResponse & {
  data: ModelItem[];
};
type SetModelPayload = {
  modelId: number;
}

export function ModelView() {
  const { data, isError, isLoading, refetch } = useQuery({
    queryKey: ["get-models"],
    queryFn: async () => {
      const { data } = await http.get<ModelResponse>(`/answer/models`);
      return data;
    },
  });

  if (isLoading) return <LoadingSpinner />;
  if (isError || !data || data.error) return <ErrorMessage />;

  const [currentModel] = data.data.filter((x) => x.isActive);

  return (
    <div className="flex flex-col gap-4 w-full">
      <p className="text-zinc-950 text-xl">
        Поточна модель
        <span className="ml-2 font-bold">{currentModel.name}</span>
      </p>
      <SetModel models={data.data} refetch={refetch} currentModel={currentModel}/> 
    </div>
  );
}

function SetModel({models, refetch, currentModel}: {models: ModelItem[], refetch: any, currentModel: ModelItem}) {
  const [modelId, setModelId] = useState<number>(-1);
  const selectRef = useRef<HTMLSelectElement>(null);
  const toast = useCustomToast();
 
  const { mutate, isPending } = useMutation({
    mutationKey: ["set-model"],
    mutationFn: async (payload: SetModelPayload) => {
      await http.post("/answer/models", payload);
    },
    onSuccess: () => {
      toast({
        type: "success",
        content: "Модель успішно оновлено!",
      });
      refetch();
      setModelId(-1);
      if(selectRef.current) selectRef.current.value = "-1"; 
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

    mutate({ 
      modelId: modelId
    });
  }

  return(
    <form className="flex gap-2 w-full" onSubmit={onSubmit}>
      <Select
        className="w-min"
        defaultValue="-1"
        onChange={(e) => setModelId(parseInt(e.target.value))}
        ref={selectRef}
      >
        <option value="-1" disabled hidden>Обрати модель</option>
        {models.map((item, index) => (
          <option key={`${item.id}-${index}`} value={item.id} disabled={currentModel.id === item.id}>{item.name}</option>
        ))}
      </Select>
      <Button type="submit" disabled={isPending}>
        {isPending && (
          <Loader2 className="stroke-zinc-100 h-4 w-4 animate-spin mr-2" />
        )}
        Встановити
      </Button>
    </form>
  )
}