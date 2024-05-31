import { useMutation, useQuery } from "@tanstack/react-query";
import { useCookies } from "react-cookie";
import { http } from "../lib/http";
import { LoadingSpinner } from "./ui/loading-spinner";
import { ErrorMessage } from "./ui/error-message";
import { useRef, useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Dialog } from "./ui/dialog";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useCustomToast } from "../hooks/use-custom-toast";

type TokenResponse = BaseResponse & {
  data: {
    valid: boolean;
  };
};
type LoginPayload = {
  name: string;
  password: string;
};
type LoginResponse = BaseResponse & {
  data: {
    token: string;
  };
};

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const [cookies] = useCookies(["authToken"]);
  const navigate = useNavigate();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["token"],
    queryFn: async () => {
      const { data } = await http.post<TokenResponse>("/users/token", {
        name: "ADMIN",
        token: `${cookies.authToken}`,
      });
      return data;
    },
  });

  if (isLoading) return <LoadingSpinner />;
  if (isError) return <ErrorMessage />;

  if (!data || data.error || !data.data.valid) navigate("/login");

  return <>{children}</>;
}

const cookieExpirationTime = 7 * 24 * 60 * 60 * 1000;
export function LoginForm() {
  const [username, setUsername] = useState<string>("ADMIN");
  const [password, setPassword] = useState<string>("");
  const passwordInputRef = useRef<HTMLInputElement>(null);
  const [_, setCookie] = useCookies(["authToken"]);
  const navigate = useNavigate();
  const toast = useCustomToast();

  const { isPending, mutate } = useMutation({
    mutationKey: ["login"],
    mutationFn: async (payload: LoginPayload) => {
      const { data } = await http.post<LoginResponse>("/users/login", payload);
      return data;
    },
    onSuccess: (data) => {
      setCookie("authToken", data.data.token, {
        expires: new Date(Date.now() + cookieExpirationTime),
      });
      navigate("/admin");
    },
    onError: () => {
      toast({
        type: "error",
        content: "Невірний логін чи пароль!",
      });
      setPassword("");
      if(passwordInputRef.current) passwordInputRef.current.value = "";
    },
  });

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    mutate({
      name: username,
      password: password,
    });
  }

  return (
    <div className="w-full max-w-[440px] mx-auto">
      <form
        className="flex flex-col w-full items-center gap-4"
        onSubmit={onSubmit}
      >
        <Input
          placeholder="Логін"
          onChange={(e) => {
            setUsername(e.target.value);
          }}
          name="login"
          defaultValue={username}
        />
        <Input
          placeholder="Пароль"
          onChange={(e) => {
            setPassword(e.target.value);
          }}
          name="password"
          type="password"
          ref={passwordInputRef}
        />
        <Button
          type="submit"
          disabled={username === "" || password === "" || isPending}
          className="disabled:select-none w-full mt-2"
        >
          {isPending && (
            <Loader2 className="stroke-zinc-100 size-4 animate-spin mr-2" />
          )}
          Увійти
        </Button>
      </form>
    </div>
  );
}

export function Logout() {
  const [cookies, _, removeCookie] = useCookies(["authToken"]);
  const navigate = useNavigate();

  function onClick() {
    if (!cookies.authToken) return;

    removeCookie("authToken");
    navigate("/login");
  }

  return( 
    <Dialog 
      trigger={<Button>Вийти</Button>}
      title={"Вийти з адмінпанелі?"}
      description={"Ви впевнені? Для повторного доступу потрібно буде знову ввести пароль"}
      onActionClick={onClick}
    />
  )
}
