import { useInfiniteQuery } from "@tanstack/react-query";
import { http } from "../../lib/http";
import { LoadingSpinner } from "../ui/loading-spinner";
import { ErrorMessage } from "../ui/error-message";
import { Button } from "../ui/button";
import { useState } from "react";
import { User as UserIcon, Bot as BotIcon, XCircle, CheckCircle2 } from "lucide-react";
import { formatDate } from "../../lib/utils";
import { MDXContent } from "../mdx";

const ITEMS_PER_PAGE = 30;

type HistoryItem = {
    id: number;
    chatId: string;
    role: string;
    content: string;
    createdAt: string;
    isAnswered: boolean;
}
type HistoryResponse = {
    error: boolean;
    message: string;
    data: HistoryItem[];
};

export function HistoryList() {
    return(
        <div className="flex flex-col gap-4 w-full">
          {/* TODO: search bar */}
          <List />
        </div>
    )
}

function List() {
    const [isFetchedAll, setIsFetchedAll] = useState<boolean>(false);

    const {data, fetchNextPage, isLoading, isError, isFetchingNextPage} = useInfiniteQuery({
        queryKey: ['infinite-history-query'],
        queryFn: async ({ pageParam }) => {
            const { data } = await http.get<HistoryResponse>(`/history?page=${pageParam}&take=${ITEMS_PER_PAGE}`);
            if(data.data.length < ITEMS_PER_PAGE) {
                setIsFetchedAll(true);
            }
            return data;
        },
        initialPageParam: 1,
        getNextPageParam: (_, pages) => pages.length + 1,
    })

    if(isLoading) return <LoadingSpinner/>
    if(isError || !data) return <ErrorMessage/>
    for(let i = 0; i < data.pages.length; i++) {
        if(data.pages[i].error === true) return <ErrorMessage/>
    } 

    const historyResponses = data.pages.flatMap((item) => item);
    const historyData = historyResponses.flatMap((item) => item.data);

    return(
        <div className="flex flex-col gap-4 w-full">
            {historyData.map((item, index) => (
                <ListItem key={`${index} ${item.id}`} {...item}/>
            ))}
            <FetchStatusBar 
                fetchNextPage={fetchNextPage} 
                isFetchingNextPage={isFetchingNextPage}
                isFetchedAll={isFetchedAll}
            />
        </div>
    )
}

type FetchStatusBarProps = {
    isFetchingNextPage: boolean;
    fetchNextPage: any;
    isFetchedAll: boolean;
}
function FetchStatusBar(props: FetchStatusBarProps) {
    if(props.isFetchingNextPage) return <LoadingSpinner/>
    
    if(props.isFetchedAll) return null;

    return( 
        <div className="w-full flex justify-center">
            <Button onClick={() => props.fetchNextPage()}>
                Завантажити більше
            </Button>
        </div>
    )
}

function ListItem(props: HistoryItem) {
    return(
        <div className="w-full flex flex-col gap-2 bg-zinc-100 p-3 rounded-md">
            <ListItemHeader {...props}/>
            <MDXContent>{props.content}</MDXContent>
        </div>
    )
}

type ListItemHeaderProps = Omit<HistoryItem, "content">
function ListItemHeader(props: ListItemHeaderProps) {
    return(
        <div className="flex flex-row justify-between items-center">
            <div className="flex flex-row gap-3">
                <ListItemAuthorIcon role={props.role}/>
                <span className="text-zinc-700 text-sm mt-0.5">Чат #{props.chatId}</span>
            </div>
            <div className="flex flex-row gap-3">
                <ListItemStatusIcon isAnswered={props.isAnswered}/>
                <span className="text-sm mt-0.5">{formatDate(props.createdAt)}</span>
            </div>
        </div>
    )
}
function ListItemAuthorIcon({role}: {role: string}) {
    if (role === "user") return <UserIcon className="size-5 stroke-main"/>
    return <BotIcon className="size-5 stroke-main"/>
}
function ListItemStatusIcon({isAnswered}: {isAnswered: boolean}) {
    if(isAnswered) return <CheckCircle2 className="size-5 stroke-emerald-700"/>
    return <XCircle className="size-5 stroke-red-700"/>
}