import { createLazyFileRoute } from "@tanstack/react-router";
import { ChatForm } from "../components/chat-form";

export const Route = createLazyFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div className="p-2 flex flex-col items-center bg-zinc-100 rounded-md min-h-[50vh]">
      <ChatForm/>
    </div>
  );
}
