import { Outlet } from "react-router-dom";
import { AuthGuard } from "../components/auth-guard";

export function AdminLayout() {
  return (
    <div className="max-w-[1240px] mx-auto py-4 px-8 flex flex-col gap-8">
      <AuthGuard>
        {/* <AdminHeader/> */}
        <Outlet />
      </AuthGuard>
    </div>
  );
}
