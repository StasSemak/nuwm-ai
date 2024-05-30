import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { http } from "../../../lib/http";
import { LoadingSpinner } from "../../ui/loading-spinner";
import { ErrorMessage } from "../../ui/error-message";
import { Button } from "../../ui/button";
import { useEffect, useState } from "react";
import {
  User as UserIcon,
  Bot as BotIcon,
  XCircle,
  CheckCircle2,
} from "lucide-react";
import { formatDate } from "../../../lib/utils";
import { MDXContent } from "../../mdx";
import { Checkbox } from "../../ui/checkbox";
import { useNavigate } from "react-router-dom";
import { RefreshingStatus } from "../../ui/refreshing";

const ITEMS_PER_PAGE = 30;

export function HistoryList() {
  return (
    <div className="flex flex-col gap-5 w-full">
      <FilterForm />
      <List />
    </div>
  );
}

function FilterForm() {
  const [isUnansweredOnly, setIsUnansweredOnly] = useState<boolean>(false);
  const [isQuestionsOnly, setIsQuestionsOnly] = useState<boolean>(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const isUnansweredParam = params.get("unansweredOnly");
    setIsUnansweredOnly(isUnansweredParam === "true");

    const isQuestionsParam = params.get("questionsOnly");
    setIsQuestionsOnly(isQuestionsParam === "true");
  }, [])

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const params = new URLSearchParams(window.location.search);

    if(isUnansweredOnly) params.set("unansweredOnly", isUnansweredOnly.toString());
    else params.delete("unansweredOnly");

    if(isQuestionsOnly) params.set("questionsOnly", isQuestionsOnly.toString());
    else params.delete("questionsOnly");

    navigate(`?${params}`);
    queryClient.invalidateQueries({
      queryKey: ["infinite-history-query"],
    });
  }

  return(
    <form className="flex flex-row justify-between items-center" onSubmit={onSubmit}> 
      <div className="flex flex-row gap-5">
        <Checkbox
          name="unansweredOnly"
          id="unansweredOnly"
          labelChildren="Лише без відповіді"
          onChange={(e) => {
            setIsUnansweredOnly(e.target.checked);
          }}
          checked={isUnansweredOnly}
        />
        <Checkbox
          name="questionsOnly"
          id="questionsOnly"
          labelChildren="Лише запитання"
          onChange={(e) => {
            setIsQuestionsOnly(e.target.checked);
          }}
          checked={isQuestionsOnly}
        />
      </div>
      <div className="flex gap-3 items-center">
        <RefreshingStatus queryKey={["infinite-history-query"]}/>
        <Button type="submit">
          Застосувати
        </Button>
      </div>
    </form>
  )
}

function List() {
  const [isFetchedAll, setIsFetchedAll] = useState<boolean>(false);

  const { data, fetchNextPage, isLoading, isError, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["infinite-history-query"],
      queryFn: async ({ pageParam }) => {
        const params = new URLSearchParams(window.location.search);
        const isUnansweredParam = params.get("unansweredOnly");
        const isQuestionsParam = params.get("questionsOnly");

        let url = `/history?page=${pageParam}&take=${ITEMS_PER_PAGE}`;
        if(isUnansweredParam) url += `&isAnswered=${!(isUnansweredParam === "true")}`;
        if(isQuestionsParam) url += `&questionsOnly=${isQuestionsParam}`;        

        const { data } = await http.get<HistoryResponse>(url);
        if (data.data.length < ITEMS_PER_PAGE) {
          setIsFetchedAll(true);
        }
        return data;
      },
      initialPageParam: 1,
      getNextPageParam: (_, pages) => pages.length + 1,
    });

  if (isLoading) return <LoadingSpinner />;
  if (isError || !data) return <ErrorMessage />;
  for (let i = 0; i < data.pages.length; i++) {
    if (data.pages[i].error === true) return <ErrorMessage />;
  }

  const historyResponses = data.pages.flatMap((item) => item);
  const historyData = historyResponses.flatMap((item) => item.data);

  return (
    <div className="flex flex-col gap-4 w-full">
      {historyData.map((item, index) => (
        <HistoryListItem key={`${index} ${item.id}`} {...item} />
      ))}
      <FetchStatusBar
        fetchNextPage={fetchNextPage}
        isFetchingNextPage={isFetchingNextPage}
        isFetchedAll={isFetchedAll}
      />
    </div>
  );
}

type FetchStatusBarProps = {
  isFetchingNextPage: boolean;
  fetchNextPage: any;
  isFetchedAll: boolean;
};
function FetchStatusBar(props: FetchStatusBarProps) {
  if (props.isFetchingNextPage) return <LoadingSpinner />;

  if (props.isFetchedAll) return null;

  return (
    <div className="w-full flex justify-center">
      <Button onClick={() => props.fetchNextPage()}>Завантажити більше</Button>
    </div>
  );
}

export function HistoryListItem(props: HistoryItem) {
  return (
    <div className="w-full flex flex-col gap-2 bg-zinc-100 p-3 rounded-md">
      <ListItemHeader {...props} />
      <MDXContent>{props.content}</MDXContent>
    </div>
  );
}

type ListItemHeaderProps = Omit<HistoryItem, "content">;
function ListItemHeader(props: ListItemHeaderProps) {
  return (
    <div className="flex flex-row justify-between items-center">
      <div className="flex flex-row gap-3">
        <ListItemAuthorIcon role={props.role} />
        <span className="text-zinc-700 text-sm mt-0.5">
          Чат #{props.chatId}
        </span>
      </div>
      <div className="flex flex-row gap-3">
        <ListItemStatusIcon isAnswered={props.isAnswered} />
        <span className="text-sm mt-0.5">{formatDate(props.createdAt)}</span>
      </div>
    </div>
  );
}
function ListItemAuthorIcon({ role }: { role: string }) {
  if (role === "user") return <UserIcon className="size-5 stroke-main" />;
  return <BotIcon className="size-5 stroke-main" />;
}
function ListItemStatusIcon({ isAnswered }: { isAnswered: boolean }) {
  if (isAnswered) return <CheckCircle2 className="size-5 stroke-emerald-700" />;
  return <XCircle className="size-5 stroke-red-700" />;
}
