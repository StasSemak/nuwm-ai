import { Link, useLocation } from "react-router-dom";
import { Logout } from "../auth-guard";
import { cn } from "../../lib/utils";

const headerNavItems = [
  {
    name: "Файли",
    slug: "files",
  },
  {
    name: "Категорії",
    slug: "categories",
  },
  {
    name: "Історія",
    slug: "history",
  },
];

export function AdminHeader() {
  return (
    <header className="flex w-full justify-between items-center">
      <nav className="flex items-center gap-10">
        {headerNavItems.map((item, index) => (
          <NavItem key={item.slug + index} {...item} />
        ))}
      </nav>
      <Logout />
    </header>
  );
}

export function NavItem({ name, slug }: { name: string; slug: string }) {
  const location = useLocation();
  const isActive = location.pathname.includes(slug);

  return (
    <Link
      to={slug}
      className={cn(
        "text-xl font-bold text-zinc-950 box-content transition-all hover:border-zinc-950 border-b-2 border-transparent",
        isActive && "border-zinc-950"
      )}
    >
      {name}
    </Link>
  );
}
