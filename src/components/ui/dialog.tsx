import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { Button } from "./button";
import { Loader2 } from "lucide-react";

type DialogProps = {
  trigger: React.ReactNode;
  title: React.ReactNode;
  description: React.ReactNode;
  onActionClick: () => void;
  isLoading?: boolean;
};

export function Dialog({ trigger, description, title, onActionClick, isLoading }: DialogProps) {
  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger asChild>{trigger}</AlertDialog.Trigger>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="bg-zinc-900/30 fixed inset-0 overlayShowClass" />
        <AlertDialog.Content className="bg-zinc-100 rounded-md shadow-md fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-[500px] max-h-[85vh] p-6 focus:outline-none contentShowClass">
          <AlertDialog.Title className="m-0 text-main text-xl font-bold mb-3">
            {title}
          </AlertDialog.Title>
          <AlertDialog.Description className="mb-5 text-zinc-950">
            {description}
          </AlertDialog.Description>
          <div className="flex gap-5 justify-end">
            <AlertDialog.Cancel asChild>
              <Button className="bg-transparent text-main hover:bg-main/10 border border-main">Скасувати</Button>
            </AlertDialog.Cancel>
            <AlertDialog.Action asChild>
              <Button onClick={onActionClick} disabled={isLoading}>
                {isLoading && (
                  <Loader2 className="stroke-zinc-100 h-4 w-4 animate-spin mr-2" />
                )}
                Підтвердити
              </Button>
            </AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}
