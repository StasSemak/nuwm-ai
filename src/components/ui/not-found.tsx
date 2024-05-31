import { useNavigate } from "react-router-dom";
import { Button } from "./button";

type NotFoundProps = {
  page: "file" | "category" | "request";
}

export function NotFound({ page }: NotFoundProps) {
  const navigate = useNavigate();
  
  return(
    <div className="w-full flex flex-col items-center pt-10 gap-5">
      <h1 className="text-2xl text-main font-bold">
        {pageName(page) + " "}
        не знайдено
      </h1>
      <Button onClick={() => navigate(-1)}>Назад</Button>
    </div>
  );
}

function pageName(page: "file" | "category" | "request"): string {
  if(page === "file") return "Файл";
  if(page === "category") return "Категорію";
  return "Запит"; 
}
