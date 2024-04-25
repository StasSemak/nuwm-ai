import { FilesList } from "../components/admin/files-list";
import { UploadFileForm } from "../components/admin/upload-file-form";
import { AddCategory } from "../components/admin/categories/add-category";
import { CategoriesList } from "../components/admin/categories/categories-list";
import { FileView } from "../components/admin/file-view";

export function Admin() {
  return(
    <div>
      admin here
    </div>
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