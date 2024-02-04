import { VariantProps, cva } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import React from "react";
import { cn } from "../../lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-sm text-sm font-medium transition-all disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        dark: "bg-main hover:bg-main-80 text-zinc-100",
        light: "bg-zinc-100 hover:bg-zinc-200 text-main",
        ghost: "bg-transparent text-main hover:bg-zinc-100",
        outline:
          "bg-transparent text-zinc-100 hover:bg-main-80 border border-zinc-100",
      },
      size: {
        default: "h-10 py-2 px-4",
        sm: "h-9 px-2",
        xs: "h-8 w-8",
        lg: "h-11 px-8",
      },
    },
    defaultVariants: {
      variant: "dark",
      size: "default",
    },
  }
);

export interface Props
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, Props>(
  ({ className, children, variant, isLoading, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={isLoading}
        {...props}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
