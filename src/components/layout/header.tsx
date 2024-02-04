import { Link } from "@tanstack/react-router";
import logoWhite from "../../assets/logo-white.png";
import { buttonVariants } from "../ui/button";

export function Header() {
  return (
    <header className="w-full h-20 bg-secondary">
      <nav className="max-w-[1240px] mx-auto flex items-center justify-between h-full px-12">
        <Link to="/">
          <img src={logoWhite} alt="Логотип НУВГП" className="select-none h-16" />
        </Link>
        <div className="flex gap-2">
          <Link to="/sign-in" className={buttonVariants({ variant: "light" })}>
            Авторизація
          </Link>
        </div>
      </nav>
    </header>
  );
}
