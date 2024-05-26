import * as RadixTooltip from "@radix-ui/react-tooltip";

type TooltipProps = {
  trigger: React.ReactNode;
  content: React.ReactNode;
};

export function Tooltip({ trigger, content }: TooltipProps) {
  return (
    <RadixTooltip.Provider>
      <RadixTooltip.Root>
        <RadixTooltip.Trigger>{trigger}</RadixTooltip.Trigger>
        <RadixTooltip.Portal>
          <RadixTooltip.Content 
            className="z-50 overflow-hidden text-sm border border-zinc-200 rounded-md py-1.5 px-2.5 text-zinc-950 bg-zinc-100 select-none shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
            sideOffset={4}
          >
            {content}
          </RadixTooltip.Content>
        </RadixTooltip.Portal>
      </RadixTooltip.Root>
    </RadixTooltip.Provider>
  );
}
