import { FilesList } from "../components/admin/files/files-list";
import { UploadFileForm } from "../components/admin/files/upload-file-form";
import { AddCategory } from "../components/admin/categories/add-category";
import { CategoriesList } from "../components/admin/categories/categories-list";
import { FileView } from "../components/admin/files/file-view";
import { HistoryList } from "../components/admin/history/history-list";
import { AdminHome } from "../components/admin/home";

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

export function AdminCategories() {
  return(
    <>
      <AddCategory />
      <CategoriesList />
    </>
  )
}

export function AdminFile() {
  return(
    <FileView />
  )
}

export function AdminHistory() {
  return (
    <HistoryList />
  );
}