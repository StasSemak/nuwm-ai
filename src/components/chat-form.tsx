import { useState } from "react";
import { Button } from "./button";
import { Input } from "./input";
import { useMutation } from "@tanstack/react-query";
import { http } from "../lib/http";
import { AlertCircle, Loader2 } from 'lucide-react';

type ChatQuestion = {
    question: string
}
type ChatResponse = {
    error: boolean
    message: string
    data: string
}

export function ChatForm () {
    const [chatQuestion, setChatQuestion] = useState<ChatQuestion>({
        question: ""
    })
    
    const { mutate, isPending, isError, isSuccess, data } = useMutation({
        mutationKey: ["answer"],
        mutationFn: async (payload: ChatQuestion) => {
            const { data } = await http.post<ChatResponse>("/answer", payload)
            return data
        }
    })

    function onSubmit (e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        mutate(chatQuestion);
    }

    return(
        <div className="flex flex-col p-2 w-full items-center flex-grow">
            <form className="flex gap-2 w-full" onSubmit={onSubmit}>
                <Input 
                    placeholder="Введіть ваше запитання" 
                    name="question" 
                    onChange={(e) => {
                        setChatQuestion({...chatQuestion, question: e.target.value})
                    }}
                />
                <Button 
                    type="submit" 
                    disabled={chatQuestion.question === ""}
                    className="disabled:select-none"
                >
                    Запитати
                </Button>
            </form>
            <div className="flex-grow w-full flex">
                <ResponseView
                    isPending={isPending}
                    isError={isError}
                    isSuccess={isSuccess}
                    data={data}
                />
            </div>
        </div>
    )
}

type ResponseViewProps = {
    isPending: boolean;
    isError: boolean;
    isSuccess: boolean;
    data: ChatResponse | undefined;
}
function ResponseView (props: ResponseViewProps) {
    if(props.isPending) {
        return <LoadingSpinner/>
    }

    if(props.isError) {
        return <ErrorMessage/>
    }

    if(props.isSuccess) {
        return <Response data={props.data}/>
    }
    
    return(
        <div>
            
        </div>
    )
}

function LoadingSpinner () {
    return(
        <div className="flex-grow flex flex-col items-center justify-center">
            <Loader2 className="stroke-main h-12 w-12 animate-spin"/>
        </div>
    )
}
function ErrorMessage () {
    return(
        <div className="flex-grow flex flex-col justify-center items-center">
            <div className="flex gap-2 items-center">
                <AlertCircle className="h-8 w-8 stroke-main"/>
                <p className="text-main text-xl">Виникла помилка</p>
            </div>
        </div>
    )
}

function Response ({data}: {data: ChatResponse | undefined}) {
    if(!data || data.error) return <ErrorMessage/>

    return(
        <div className="flex-grow flex flex-col px-2 py-4">
            <p className="text-zinc-950">{data.data}</p>
        </div>
    )
}