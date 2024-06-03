import ReactTextareaAutosize from "react-textarea-autosize";
import { cn } from "../../lib/utils";
import React from "react";

export interface TextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ className, style, ...props }, ref) => {
    return (
      <ReactTextareaAutosize
        className={cn(
          "resize-none flex h-10 w-full rounded-md border border-main bg-zinc-100 px-3 py-2 text-base ring-offset-zinc-100 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-main/70 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        maxRows={10}
        {...props}
      />
    );
  }
);
TextArea.displayName = "TextArea";

export { TextArea };
