import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/sign-in")({
  component: About,
});

function About() {
  return (
    <div className="p-2">
      <h3>Sign-in page</h3>
    </div>
  );
}
