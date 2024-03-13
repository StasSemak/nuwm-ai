import { FilesList } from "../components/admin/files-list";
import { UploadFileForm } from "../components/admin/upload-file-form";

export function Admin() {
  return (
    <div className="max-w-[1240px] mx-auto py-4 px-8 flex flex-col gap-8">
      <Heading />
      <UploadFileForm />
      <FilesList />
    </div>
  );
}

function Heading() {
  return <h1 className="text-zinc-950 text-3xl font-bold">Адмінпанель</h1>;
}
