import { cn } from "../../lib/utils";

export interface Props extends React.BaseHTMLAttributes<HTMLDivElement> {}

export function Badge({ className, children, ...props }: Props) {
  return (
    <div
      className={cn(
        "inline-flex w-fit items-center whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs font-semibold border-transparent bg-main/90 text-zinc-100",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
