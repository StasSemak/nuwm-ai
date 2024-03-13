import { Check, Clipboard } from "lucide-react";
import { useState } from "react";

export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState<boolean>(false);

  function onClick() {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    });
  }

  return (
    <button
      className="inline-flex items-center justify-center rounded-md text-sm transition-all bg-transparent hover:bg-zinc-200 h-9 px-2 flex-shrink-0"
      onClick={onClick}
      aria-label="Копіювати відповідь"
    >
      <span className="mr-1.5 mt-0.5 text-main hidden md:block">
        {copied ? "Відповідь зкопійовано!" : "Копіювати відповідь"}
      </span>
      {copied ? (
        <Check className="stroke-main h-4 w-4" />
      ) : (
        <Clipboard className="stroke-main h-4 w-4" />
      )}
    </button>
  );
}
