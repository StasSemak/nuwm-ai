import { Link } from "react-router-dom";
import { FilesList } from "../components/admin/files-list";
import { UploadFileForm } from "../components/admin/upload-file-form";
import { Logout } from "../components/auth-guard";
import { ArrowUpRight } from "lucide-react";
import { AddCategory } from "../components/admin/categories/add-category";
import { CategoriesList } from "../components/admin/categories/categories-list";
import { FileView } from "../components/admin/file-view";


export function Admin() {
  return (
    <>
      <Heading />
      <UploadFileForm />
      <FilesList />
    </>
  );
}
function Heading() {
  return( 
    <div className="flex w-full justify-between items-center">
      <div className="flex items-end gap-10">
        <h1 className="text-zinc-950 text-3xl font-bold">Адмінпанель</h1>
        <Link to="categories" className="text-lg font-bold inline-flex items-end gap-0.5">
          Категорії
          <ArrowUpRight className="stroke-zinc-950 h-5 w-5 mb-[3px]"/>
        </Link>
      </div>
      <Logout />
    </div>
  );
}

export function AdminCategories() {
  return(
    <>
      <CategoriesHeading />
      <AddCategory />
      <CategoriesList />
    </>
  )
}
function CategoriesHeading() {
  return( 
    <div className="flex w-full justify-between items-center">
      <div className="flex items-end gap-10">
        <h1 className="text-zinc-950 text-3xl font-bold">Категорії</h1>
        <Link to="/admin" className="text-lg font-bold inline-flex items-end gap-0.5">
          Адмінпанель
          <ArrowUpRight className="stroke-zinc-950 h-5 w-5 mb-[3px]"/>
        </Link>
      </div>
      <Logout />
    </div>
  );
}

export function AdminFile() {
  return(
    <>
      <Heading />
      <FileView />
    </>
  )
}