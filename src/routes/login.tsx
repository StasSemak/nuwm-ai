import { LoginForm } from "../components/auth/login";

export function Login() {
  return (
    <div className="max-w-[1240px] mx-auto py-4 px-8 flex flex-col gap-8 pt-8">
      <p className="text-center text-2xl text-main font-bold">Для доступу потрібно увійти</p>
      <LoginForm />
    </div>
  );
}
