import { LoginForm } from "../components/auth-guard";

export function Login() {
  return (
    <div className="max-w-[1240px] mx-auto py-4 px-8 flex flex-col gap-8">
      <LoginForm />
    </div>
  );
}
