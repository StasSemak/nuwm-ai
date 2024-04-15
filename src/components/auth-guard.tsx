import { useMutation, useQuery } from "@tanstack/react-query";
import { useCookies } from "react-cookie"
import { http } from "../lib/http";
import { LoadingSpinner } from "./ui/loading-spinner";
import { ErrorMessage } from "./ui/error-message";
import { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

type TokenResponse = {
    error: boolean;
    message: string;
    data: {
        valid: boolean;
    };
}
type LoginPayload = {
    name: string;
    password: string;
}
type LoginResponse = {
    error: boolean;
    message: string;
    data: {
        token: string;
    };
}

export function AuthGuard({children}: {children: React.ReactNode}) {
    const [cookies] = useCookies(["authToken"]);

    const {data, isLoading, isError} = useQuery({
        queryKey: ["token"],
        queryFn: async () => {
            const { data } = await http.post<TokenResponse>("/users/token", {
                name: "ADMIN",
                token: `${cookies.authToken}`,
            })
            console.log("DATA", data)
            return data;
        }
    })

    if(isLoading) return <LoadingSpinner />;
    if(isError) return <ErrorMessage />;
    
    if(!data || data.error || !data.data.valid) return <LoginForm />;

    return(
        <>{children}</>
    )
} 

const cookieExpirationTime = 7 * 24 * 60 * 60 * 1000;
export function LoginForm() {
    const [password, setPassword] = useState<string>("");
    const [_, setCookie] = useCookies(["authToken"]); 
    
    const {data, isError, isPending, mutate, isSuccess} = useMutation({
        mutationKey: ["login"],
        mutationFn: async (payload: LoginPayload) => {
            const { data } = await http.post<LoginResponse>("/users/login", payload);
            return data;
        },
    });

    function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        mutate({
            name: "ADMIN",
            password: password,
        });
    }

    if(isPending) return <LoadingSpinner />;
    if(isError) return <ErrorMessage />;

    if(isSuccess) {
        setCookie("authToken", data.data.token, {
            expires: new Date(Date.now() + cookieExpirationTime),
        });
        window.location.reload();
    }

    return(
        <form className="flex flex-col w-full items-center gap-4" onSubmit={onSubmit}>
            <Input 
                placeholder="Пароль"
                onChange={(e) => {
                    setPassword(e.target.value);
                }}
                name="password"
            />
            <Button
                type="submit"
                disabled={password === ""}
                className="disabled:select-none"
            >
                Увійти
            </Button>
        </form>
    )
}