import type { LineItem } from "@/types/invoice";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { Delete02Icon } from "@hugeicons/core-free-icons";
import { Textarea } from "./ui/textarea";

interface LineItemsProps {
  items: LineItem[];
  currency: string;
  onChange: (items: LineItem[]) => void;
}

function LineItems({ items, currency, onChange }: LineItemsProps) {
  function handleItemChange(
    id: string,
    field: keyof LineItem,
    value: string | number,
  ) {
    const updated = items.map((item) =>
      item.id === id ? { ...item, [field]: value } : item,
    );
    onChange(updated);
  }

  function addItem() {
    onChange([
      ...items,
      { id: crypto.randomUUID(), description: "", quantity: 1, rate: 0 },
    ]);
  }

  function removeItem(id: string) {
    onChange(items.filter((item) => item.id !== id));
  }

  return (
    <div className="space-y-3">
      {/* Header Row */}
      <div className="grid grid-cols-12 gap-2 text-sm font-medium text-gray-500 px-1">
        <span className="col-span-5">Description</span>
        <span className="col-span-2">Qty</span>
        <span className="col-span-3">Rate</span>
        <span className="col-span-2 text-right">Total</span>
      </div>

      {/* Line Item Rows */}
      {items.map((item) => (
        <div key={item.id} className="grid grid-cols-12 gap-2 items-center">
          <div className="col-span-5">
            <Textarea
              value={item.description}
              onChange={(e) =>
                handleItemChange(item.id, "description", e.target.value)
              }
              placeholder="Description"
            />
          </div>
          <div className="col-span-2">
            <Input
              type="number"
              value={item.quantity}
              min={1}
              onChange={(e) =>
                handleItemChange(
                  item.id,
                  "quantity",
                  parseFloat(e.target.value) || 0,
                )
              }
            />
          </div>
          <div className="col-span-3">
            <Input
              type="number"
              value={item.rate}
              min={0}
              onChange={(e) =>
                handleItemChange(
                  item.id,
                  "rate",
                  parseFloat(e.target.value) || 0,
                )
              }
              placeholder="0.00"
            />
          </div>
          <div className="col-span-1 text-right text-sm font-medium">
            {currency} {(item.quantity * item.rate).toFixed(2)}
          </div>
          <div className="col-span-1 flex justify-end">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => removeItem(item.id)}
              disabled={items.length === 1}
            >
              <HugeiconsIcon
                icon={Delete02Icon}
                size={24}
                color="currentColor"
                strokeWidth={1.5}
              />
            </Button>
          </div>
        </div>
      ))}

      <Button variant="outline" size="sm" onClick={addItem}>
        + Add Line Item
      </Button>
    </div>
  );
}

export default LineItems;
