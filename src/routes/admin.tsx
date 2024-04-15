import { FilesList } from "../components/admin/files-list";
import { UploadFileForm } from "../components/admin/upload-file-form";
import { AuthGuard, Logout } from "../components/auth-guard";

export function Admin() {
  return (
    <div className="max-w-[1240px] mx-auto py-4 px-8 flex flex-col gap-8">
      <AuthGuard>
        <Heading />
        <UploadFileForm />
        <FilesList />
      </AuthGuard>
    </div>
  );
}

function Heading() {
  return( 
    <div className="flex w-full justify-between items-center">
      <h1 className="text-zinc-950 text-3xl font-bold">Адмінпанель</h1>
      <Logout />
    </div>
  );
}
