import { createRootRoute, Link, Outlet } from "@tanstack/react-router";

export const Route = createRootRoute({
  component: RootLayout,
});

function RootLayout() {
  return (
    <>
      <nav className="flex gap-3">
        <Link to="/">Home</Link>
        <Link to="/sign-in">Sign-in</Link>
      </nav>
      <Outlet />
    </>
  );
}
