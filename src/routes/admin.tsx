import { FilesList } from "../components/admin/files/files-list";
import { UploadFileForm } from "../components/admin/files/upload-file-form";
import { AddCategory } from "../components/admin/categories/add-category";
import { CategoriesList } from "../components/admin/categories/categories-list";
import { FileView } from "../components/admin/files/file-view";
import { HistoryList } from "../components/admin/history/history-list";
import { AdminHome } from "../components/admin/home";
import { CategoryView } from "../components/admin/categories/category-view";
import { ModelView } from "../components/admin/model/model-view";
import { RequestsList } from "../components/admin/requests/requests-list";
import { RequestView } from "../components/admin/requests/request-view";
import { BaseRoute, ListWithViews } from "./templates";

export function Admin() {
  return <AdminHome />;
}

function AdminFiles() {
  return (
    <>
      <UploadFileForm />
      <FilesList />
    </>
  );
}
function AdminFile() {
  return <FileView />;
}
export function AdminFilesRoute() {
  return (
    <ListWithViews
      baseSlug="files"
      listComponent={<AdminFiles />}
      viewComponent={<AdminFile />}
    />
  );
}

function AdminCategories() {
  return (
    <>
      <AddCategory />
      <CategoriesList />
    </>
  );
}
function AdminCategory() {
  return <CategoryView />;
}
export function AdminCategoriesRoute() {
  return (
    <ListWithViews
      baseSlug="categories"
      listComponent={<AdminCategories />}
      viewComponent={<AdminCategory />}
    />
  );
}

function AdminHistory() {
  return <HistoryList />;
}
export function AdminHistoryRoute() {
  return <BaseRoute slug="history" component={<AdminHistory />} />;
}

export function AdminModel() {
  return <ModelView />;
}
export function AdminModelRoute() {
  return <BaseRoute slug="model" component={<AdminModel />} />;
}

function AdminRequests() {
  return <RequestsList />;
}
function AdminRequest() {
  return <RequestView />;
}
export function AdminRequestsRoute() {
  return (
    <ListWithViews
      baseSlug="requests"
      listComponent={<AdminRequests />}
      viewComponent={<AdminRequest />}
    />
  );
}
