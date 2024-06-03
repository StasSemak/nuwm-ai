import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCustomToast } from "../../hooks/use-custom-toast";
import { useMutation } from "@tanstack/react-query";
import { login } from "../../lib/auth";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";

export function LoginForm() {
  const [username, setUsername] = useState<string>("ADMIN");
  const [password, setPassword] = useState<string>("");
  const passwordInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const toast = useCustomToast();

  const { isPending, mutate } = useMutation({
    mutationKey: ["login"],
    mutationFn: login,
    onSuccess: () => {
      navigate("/admin");
    },
    onError: () => {
      toast({
        type: "error",
        content: "Невірний логін чи пароль!",
      });
      setPassword("");
      if (passwordInputRef.current) passwordInputRef.current.value = "";
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
