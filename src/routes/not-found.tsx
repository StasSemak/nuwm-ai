import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";

export function NotFound() {
  const navigate = useNavigate();
  const location = useLocation();
  const navigateSlug =
    location.pathname.split("/")[1] === "admin" ? "admin" : "/";

  return (
    <div className="w-full min-h-screen flex flex-col justify-center items-center gap-5">
      <h1 className="text-5xl font-bold text-main">404</h1>
      <p className="text-3xl text-main">Здається, такої сторінки не існує</p>
      <Button onClick={() => navigate(navigateSlug)}>Додому</Button>
    </div>
  );
}
