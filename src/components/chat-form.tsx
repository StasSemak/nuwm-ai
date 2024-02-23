import { useState } from "react";
import { Button } from "./button";
import { useMutation } from "@tanstack/react-query";
import { http } from "../lib/http";
import { LoadingSpinner } from "./loading-spinner";
import { ErrorMessage } from "./error-message";
import { ArrowUp } from "lucide-react";
import { TextArea } from "./textarea";
import { CopyButton } from "./copy-button";

type ChatQuestion = {
  question: string;
};
type ChatResponse = {
  error: boolean;
  message: string;
  data: string;
};

export function ChatForm() {
  const [chatQuestion, setChatQuestion] = useState<ChatQuestion>({
    question: "",
  });

  const { mutate, isPending, isError, isSuccess, data } = useMutation({
    mutationKey: ["answer"],
    mutationFn: async (payload: ChatQuestion) => {
      const { data } = await http.post<ChatResponse>("/answer", payload);
      return data;
    },
  });

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    mutate(chatQuestion);
    setChatQuestion({question: ""})
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
        />
        <Button
          type="submit"
          disabled={chatQuestion.question === ""}
          className="disabled:select-none px-3 md:px-4"
          aria-label="Запитати"
        >
          <span className="hidden md:block">Запитати</span>
          <ArrowUp className="stroke-zinc-100 size-5 block md:hidden"/>
        </Button>
      </form>
      <div className="flex-grow w-full flex">
        <ResponseView
          isPending={isPending}
          isError={isError}
          isSuccess={isSuccess}
          data={data}
          question={chatQuestion.question}
        />
      </div>
    </div>
  );
}

type ResponseViewProps = {
  isPending: boolean;
  isError: boolean;
  isSuccess: boolean;
  data: ChatResponse | undefined;
  question: string | undefined;
};
function ResponseView(props: ResponseViewProps) {
  if (props.isPending) {
    return <LoadingSpinner />;
  }

  if (props.isError) {
    return <ErrorMessage />;
  }

  if (props.isSuccess) {
    return <Response data={props.data} question={props.question} />;
  }

  return <div></div>;
}

function Response({ data, question }: { data: ChatResponse | undefined, question: string | undefined }) {
  if (!data || data.error) return <ErrorMessage />;

  return (
    <div className="flex-grow flex flex-col gap-3 px-2 py-4">
      <div className="w-full flex justify-between items-center gap-5">
        <p className="text-zinc-950 font-bold">{question}</p>
        <CopyButton text={data.data}/>
      </div>
      <p className="text-zinc-950">{data.data}</p>
    </div>
  );
}
