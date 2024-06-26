import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "../ui/button";
import { useMutation, useQuery } from "@tanstack/react-query";
import { http } from "../../lib/http";
import { ErrorMessage } from "../ui/error-message";
import { ArrowUp } from "lucide-react";
import { TextArea } from "../ui/textarea";
import { CopyButton } from "./copy-button";
import { MDXContent } from "../mdx";
import { nanoid } from "nanoid";
import { Select } from "../ui/select";
import { cn } from "../../lib/utils";
import { Bot as BotIcon } from "lucide-react";
import { Tooltip } from "../ui/tooltip";

type ChatQuestion = {
  question: string;
  chatId: string;
  categoryId: number;
};
type ChatResponse = BaseResponse & {
  data: string;
};
type ChatMessage = {
  from: "user" | "server";
  data: string;
};

const chatId = nanoid();

export function ChatForm() {
  const [chatQuestion, setChatQuestion] = useState<ChatQuestion>({
    question: "",
    categoryId: -1,
    chatId,
  });
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const { data: categories, isError: isCategoriesError } = useQuery({
    queryKey: ["get-all-categories"],
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
    mutate(chatQuestion);
    if (inputRef.current) inputRef.current.value = "";
    setChatQuestion((prev) => ({...prev, question: ""}));
  }

  const isCategories = useMemo(() => {
    return !isCategoriesError && !!categories && !categories.error
  }, [isCategoriesError, categories])

  return (
    <div className="p-2 w-full items-center flex-grow relative">
      <div className="fixed pb-2 pt-1 bg-zinc-100 bottom-0 z-10 left-1 right-1">
        <form className={cn("flex gap-2 w-full justify-center", isCategories && "flex-wrap md:flex-nowrap")} onSubmit={onSubmit}>
          <TextArea
            placeholder="Введіть ваше запитання"
            name="question"
            onChange={(e) => {
              setChatQuestion((prev) => ({ ...prev, question: e.target.value }));
            }}
            aria-label="Запитання"
            ref={inputRef}
            autoFocus
          />
          {isCategories &&
            <Select 
              className="w-min" 
              defaultValue="-1" 
              onChange={(e) =>{
                setChatQuestion((prev) => ({ ...prev, categoryId: parseInt(e.target.value) }));
              }}
            >
              <option value="-1">Усі категорії</option>
              {categories?.data.map((item, index) => (
                <option key={`${item.id}-${index}`} value={item.id}>{item.name}</option>
              ))}
            </Select>
          }
          <Button
            type="submit"
            disabled={chatQuestion.question === "" || isPending}
            className="disabled:select-none px-3 md:px-4"
            aria-label="Запитати"
          >
            <span className="hidden md:block">Запитати</span>
            <ArrowUp className="stroke-zinc-100 size-5 block md:hidden" />
          </Button>
        </form>
      </div>
      <div className="h-full w-full flex flex-col gap-5 mt-5 mb-[120px] md:mb-[70px]">
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

function ResponseSkeleton() {
  return(
    <div className="flex gap-3 w-full max-w-[100%]">
      <div className="flex flex-col items-center gap-3">
        <div className="p-2 rounded-full bg-zinc-200/50 h-min">
          <BotIcon className="size-5 stroke-main"/>
        </div>
      </div>
      <div className="flex items-center gap-1 w-min px-3 py-3 bg-zinc-200/50 rounded-full">
        <div className="rounded-full p-1.5 bg-zinc-300 w-min animate-bounce1"/>
        <div className="rounded-full p-1.5 bg-zinc-300 w-min animate-bounce2"/>
        <div className="rounded-full p-1.5 bg-zinc-300 w-min animate-bounce3"/>
      </div>
    </div>
  )
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
  if (message.from === "user") {
    return (
      <div className="flex flex-col gap-1 py-3 px-4 self-end bg-zinc-200/50 rounded-lg max-w-[60%] rounded-tr-none">
        <MDXContent>{message.data}</MDXContent>
      </div>
    )
  }

  return (
    <div className="flex gap-3 w-full max-w-[100%]">
      <div className="flex flex-col items-center gap-3">
        <div className="p-2 rounded-full bg-zinc-200/50 h-min">
          <BotIcon className="size-5 stroke-main"/>
        </div>
        <Tooltip
          trigger={<CopyButton text={message.data}/>}
          content="Копіювати"
        />
      </div>
      <div className="flex flex-col gap-1 w-full">
        <MDXContent>{message.data}</MDXContent>
      </div>
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
    return <ResponseSkeleton />;
  }

  if (props.isError) {
    return <ErrorMessage />;
  }
  return null;
}
