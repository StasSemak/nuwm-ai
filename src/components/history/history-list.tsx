import { useInfiniteQuery } from "@tanstack/react-query";
import { http } from "../../lib/http";
import { LoadingSpinner } from "../ui/loading-spinner";
import { ErrorMessage } from "../ui/error-message";
import { Button } from "../ui/button";
import { useState } from "react";

const ITEMS_PER_PAGE = 50;

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
        <div className="flex flex-col gap-3 w-full">
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
        <div className=""></div>
    )
}