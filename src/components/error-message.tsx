import { AlertCircle } from "lucide-react";

export function ErrorMessage() {
  return (
    <div className="flex-grow flex flex-col justify-center items-center">
      <div className="flex gap-2 items-center">
        <AlertCircle className="h-8 w-8 stroke-main" />
        <p className="text-main text-xl">Виникла помилка</p>
      </div>
    </div>
  );
}
