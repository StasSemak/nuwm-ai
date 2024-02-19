import { createRootRoute, Outlet } from "@tanstack/react-router";

export const Route = createRootRoute({
  component: RootLayout,
});

function RootLayout() {
  return (
    <main className="flex-grow w-full max-w-[1240px] mx-auto py-2 px-12">
      <Outlet />
    </main>
  );
}
