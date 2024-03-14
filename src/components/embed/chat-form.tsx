import { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import { useMutation } from "@tanstack/react-query";
import { http } from "../../lib/http";
import { LoadingSpinner } from "../ui/loading-spinner";
import { ErrorMessage } from "../ui/error-message";
import { ArrowUp } from "lucide-react";
import { TextArea } from "../ui/textarea";
import { CopyButton } from "./copy-button";

type ChatQuestion = {
  question: string;
};
type ChatResponse = {
  error: boolean;
  message: string;
  data: string;
};
type ChatMessage = {
  from: "user" | "server";
  data: string;
};

export function ChatForm() {
  const [chatQuestion, setChatQuestion] = useState<ChatQuestion>({
    question: "",
  });
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const { mutate, isPending, isError, isSuccess, data } = useMutation({
    mutationKey: ["answer"],
    mutationFn: async (payload: ChatQuestion) => {
      const { data } = await http.post<ChatResponse>("/answer", payload);
      return data;
    },
  });

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setChatMessages((prev) => [
      ...prev,
      {
        from: "user",
        data: chatQuestion.question,
      },
    ]);
    mutate(chatQuestion);
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div className="flex flex-col p-2 w-full items-center flex-grow">
      <form className="flex gap-2 w-full" onSubmit={onSubmit}>
        <TextArea
          placeholder="Введіть ваше запитання"
          name="question"
          onChange={(e) => {
            setChatQuestion({ ...chatQuestion, question: e.target.value });
          }}
          aria-label="Запитання"
          ref={inputRef}
        />
        <Button
          type="submit"
          disabled={chatQuestion.question === ""}
          className="disabled:select-none px-3 md:px-4"
          aria-label="Запитати"
        >
          <span className="hidden md:block">Запитати</span>
          <ArrowUp className="stroke-zinc-100 size-5 block md:hidden" />
        </Button>
      </form>
      <div className="flex-grow w-full flex flex-col gap-5 mt-5">
        <ChatView chatMessages={chatMessages} />
        <ResponseView
          isPending={isPending}
          isError={isError}
          isSuccess={isSuccess}
          data={data}
          setChatMessages={setChatMessages}
        />
      </div>
    </div>
  );
}

function ChatView({ chatMessages }: { chatMessages: ChatMessage[] }) {
  return (
    <div className="flex flex-col gap-5 w-full">
      {chatMessages.map((item, index) => (
        <ChatItem key={index} message={item} />
      ))}
    </div>
  );
}
function ChatItem({ message }: { message: ChatMessage }) {
  return (
    <div className="flex flex-col gap-1 w-full">
      <div className="w-full flex justify-between items-center">
        <p className="text-zinc-950 font-bold">
          {message.from === "user" ? "Ви" : "Відповідь"}
        </p>
        {message.from === "server" && <CopyButton text={message.data}/>}
      </div>
      <p className="text-zinc-950">{message.data}</p>
    </div>
  );
}

type ResponseViewProps = {
  isPending: boolean;
  isError: boolean;
  isSuccess: boolean;
  data: ChatResponse | undefined;
  setChatMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
};
function ResponseView(props: ResponseViewProps) {
  useEffect(() => {
    if (props.isSuccess) {
      const { data } = props;
      if (!data || data.error) return;

      props.setChatMessages((prev) => [
        ...prev,
        {
          from: "server",
          data: data.data,
        },
      ]);
    }
  }, [props.isSuccess, props.data, props.setChatMessages]);

  if (props.isPending) {
    return <LoadingSpinner />;
  }

  if (props.isError) {
    return <ErrorMessage />;
  }
  return null;
}
