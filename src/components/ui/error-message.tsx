import { AlertCircle } from "lucide-react";

export function ErrorMessage() {
  return (
    <div className="flex-grow flex flex-col justify-center items-center mt-5">
      <div className="flex gap-2 items-center">
        <AlertCircle className="size-8 stroke-main" />
        <p className="text-main text-xl">Виникла помилка</p>
      </div>
    </div>
  );
}
