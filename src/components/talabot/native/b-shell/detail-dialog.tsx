import type { ReactNode } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { XIcon } from "@/icons";
import BackButton from "./back-button";
export default function DetailDialog({
  title,
  backLabel,
  closeLabel,
  onClose,
  children,
}: {
  title: string;
  backLabel: string;
  closeLabel: string;
  onClose: () => void;
  children: ReactNode;
}) {
  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent
        showCloseButton={false}
        className="flex max-h-[90dvh] flex-col gap-0 overflow-hidden p-0 sm:max-w-4xl"
        data-testid="record-details-dialog"
      >
        <div className="flex shrink-0 items-center gap-2 border-b border-gray-200 px-3 py-2 dark:border-gray-800">
          <BackButton label={backLabel} onClick={onClose} />
          <DialogTitle className="min-w-0 flex-1 text-base font-semibold">
            {title}
          </DialogTitle>
          <Button
            variant="ghost"
            size="icon-lg"
            aria-label={closeLabel}
            title={closeLabel}
            onClick={onClose}
          >
            <XIcon aria-hidden="true" />
          </Button>
        </div>
        <ScrollArea
          className="min-h-0"
          viewportClassName="max-h-[calc(90dvh-4.5rem)] overscroll-contain"
        >
          <div className="space-y-4 p-4 pb-6 sm:p-5">{children}</div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
