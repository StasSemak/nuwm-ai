import { createLazyFileRoute } from "@tanstack/react-router";
import { Button } from "../components/ui/button";

export const Route = createLazyFileRoute("/sign-in")({
  component: SignIn,
});

function SignIn() {
  return (
    <div className="h-full flex flex-col items-center">
      <div className="max-w-[600px] w-full bg-secondary mt-32 flex flex-col gap-5 py-6 px-8 rounded-md items-center">
        <h2 className="text-zinc-100 text-2xl">Авторизація</h2>
        <Button variant="light" className="w-full">Увійти</Button>
      </div>
    </div>
  );
}
