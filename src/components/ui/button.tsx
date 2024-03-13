import React from "react";
import { cn } from "../../lib/utils";

export interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const Button = React.forwardRef<HTMLButtonElement, Props>(
  ({ className, children, ...props }, ref) => {
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center rounded-md text-base font-medium transition-all disabled:opacity-50 disabled:pointer-events-none bg-main hover:bg-main/80 text-zinc-100 h-10 py-2 px-4",
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button };
