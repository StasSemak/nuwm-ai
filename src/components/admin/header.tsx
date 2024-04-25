import { Link } from "react-router-dom";
import { Logout } from "../auth-guard";

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
      <nav className="flex items-end gap-10">
        {headerNavItems.map((item, index) => (
          <Link
            key={item.slug + index}
            to={item.slug}
            className="text-xl font-bold text-zinc-950"
          >
            {item.name}
          </Link>
        ))}
      </nav>
      <Logout />
    </header>
  );
}
