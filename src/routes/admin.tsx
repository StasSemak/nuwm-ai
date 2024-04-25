import { FilesList } from "../components/admin/files/files-list";
import { UploadFileForm } from "../components/admin/files/upload-file-form";
import { AddCategory } from "../components/admin/categories/add-category";
import { CategoriesList } from "../components/admin/categories/categories-list";
import { FileView } from "../components/admin/files/file-view";
import { HistoryList } from "../components/admin/history/history-list";
import { AdminHome } from "../components/admin/home";
import { CategoryView } from "../components/admin/categories/category-view";

export function Admin() {
  return(
    <AdminHome />
  )
}

export function AdminFiles() {
  return (
    <>
      <UploadFileForm />
      <FilesList />
    </>
  );
}
export function AdminFile() {
  return(
    <FileView />
  )
}

export function AdminCategories() {
  return(
    <>
      <AddCategory />
      <CategoriesList />
    </>
  )
}
export function AdminCategory() {
  return(
    <CategoryView />
  )
}

export function AdminHistory() {
  return (
    <HistoryList />
  );
}