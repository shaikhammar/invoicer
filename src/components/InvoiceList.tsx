import type { SavedInvoice, InvoiceData } from "@/types/invoice";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Copy01Icon,
  Delete02Icon,
  FolderOpenIcon,
} from "@hugeicons/core-free-icons";

interface InvoiceListProps {
  invoices: SavedInvoice[];
  onLoad: (data: InvoiceData) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
}

function InvoiceList({
  invoices,
  onLoad,
  onDelete,
  onDuplicate,
}: InvoiceListProps) {
  if (invoices.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-40 text-gray-400 text-sm gap-2">
        <HugeiconsIcon icon={FolderOpenIcon} className="w-8 h-8" />
        <p>No saved invoices yet</p>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <ScrollArea className="h-[calc(100vh-120px)]">
        <div className="space-y-2 p-4">
          {invoices
            .slice()
            .sort(
              (a, b) =>
                new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime(),
            )
            .map((invoice) => (
              <div
                key={invoice.id}
                className="flex items-center justify-between p-3 bg-white rounded-lg border hover:border-gray-300 transition-colors"
              >
                <div
                  className="flex-1 cursor-pointer min-w-0"
                  onClick={() => onLoad(invoice.data)}
                >
                  <p className="font-medium text-sm truncate">
                    {invoice.data.invoiceNumber}
                  </p>
                  <p className="text-xs text-gray-400 truncate">
                    {invoice.data.clientName || "No client"}
                  </p>
                  <p className="text-xs text-gray-300 mt-1">
                    {new Date(invoice.savedAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex items-center gap-1 ml-2">
                  <Tooltip>
                    <TooltipTrigger
                      render={
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => onDuplicate(invoice.id)}
                        >
                          <HugeiconsIcon
                            icon={Copy01Icon}
                            className="w-3.5 h-3.5"
                          />
                        </Button>
                      }
                    ></TooltipTrigger>
                    <TooltipContent>Duplicate</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger
                      render={
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => onDelete(invoice.id)}
                        >
                          <HugeiconsIcon
                            icon={Delete02Icon}
                            className="w-3.5 h-3.5 text-red-400"
                          />
                        </Button>
                      }
                    ></TooltipTrigger>
                    <TooltipContent>Delete</TooltipContent>
                  </Tooltip>
                </div>
              </div>
            ))}
        </div>
      </ScrollArea>
    </TooltipProvider>
  );
}

export default InvoiceList;
