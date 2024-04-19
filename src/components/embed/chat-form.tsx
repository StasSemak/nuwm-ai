import { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import { useMutation, useQuery } from "@tanstack/react-query";
import { http } from "../../lib/http";
import { LoadingSpinner } from "../ui/loading-spinner";
import { ErrorMessage } from "../ui/error-message";
import { ArrowUp } from "lucide-react";
import { TextArea } from "../ui/textarea";
import { CopyButton } from "./copy-button";
import { MDXContent } from "../mdx";
import { nanoid } from "nanoid";
import { Select } from "../ui/select";

type ChatQuestion = {
  question: string;
  chatId: string;
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
type CategoryItem = {
  id: number;
  name: string; 
};
type CategoriesResponse = {
  error: boolean;
  message: string;
  data: CategoryItem[];
};

const chatId = nanoid();

export function ChatForm() {
  const [chatQuestion, setChatQuestion] = useState<ChatQuestion>({
    question: "",
    chatId,
  });
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [selectedCategory, setSelectedCategory] = useState<number>(-1);

  const { data: categories, isError: isCategoriesError } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data } = await http.get<CategoriesResponse>("/categories");
      return data;
    }
  })

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
    console.log(selectedCategory);
    mutate(chatQuestion);
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div className="p-2 w-full items-center min-h-screen relative">
      <div className="fixed pb-4 pt-1 bg-zinc-100 bottom-0 w-[calc(100%-16px)] mx-auto z-10">
        <form className="flex gap-2 w-full flex-wrap md:flex-nowrap justify-center" onSubmit={onSubmit}>
          <TextArea
            placeholder="Введіть ваше запитання"
            name="question"
            onChange={(e) => {
              setChatQuestion({ ...chatQuestion, question: e.target.value });
            }}
            aria-label="Запитання"
            ref={inputRef}
          />
          {(!isCategoriesError && !!categories && !categories.error) &&
            <Select 
              className="w-min" 
              defaultValue="-1" 
              onChange={(e) =>{
                setSelectedCategory(parseInt(e.target.value))
              }}
            >
              <option value="-1">Усі категорії</option>
              {categories.data.map((item, index) => (
                <option key={`${item.id}-${index}`} value={item.id}>{item.name}</option>
              ))}
            </Select>
          }
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
      </div>
      <div className="h-full w-full flex flex-col gap-5 mt-5 mb-[70px]">
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
      <MDXContent>{message.data}</MDXContent>
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
