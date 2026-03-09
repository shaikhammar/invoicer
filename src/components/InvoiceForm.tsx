import type { InvoiceData } from "@/types/invoice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import LineItems from "./LineItems";
import {
  calculateSubtotal,
  calculateTax,
  calculateTotal,
} from "@/utils/calculations";

interface InvoiceFormProps {
  data: InvoiceData;
  onChange: (
    field: keyof InvoiceData,
    value: InvoiceData[keyof InvoiceData],
  ) => void;
}

function InvoiceForm({ data, onChange }: InvoiceFormProps) {
  const subtotal = calculateSubtotal(data.lineItems);
  const tax = calculateTax(subtotal, data.taxRate);
  const total = calculateTotal(subtotal, tax);

  return (
    <div className="space-y-6">
      {/* Sender + Client */}
      <Card>
        <CardHeader>
          <CardTitle>Details</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Business Name</Label>
            <Input
              value={data.businessName}
              onChange={(e) => onChange("businessName", e.target.value)}
              placeholder="Your business name"
            />
          </div>
          <div className="space-y-2">
            <Label>Client Name</Label>
            <Input
              value={data.clientName}
              onChange={(e) => onChange("clientName", e.target.value)}
              placeholder="Client name"
            />
          </div>
          <div className="space-y-2">
            <Label>Invoice Number</Label>
            <Input
              value={data.invoiceNumber}
              onChange={(e) => onChange("invoiceNumber", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Date</Label>
            <Input
              type="date"
              value={data.date}
              onChange={(e) => onChange("date", e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Line Items */}
      <Card>
        <CardHeader>
          <CardTitle>Line Items</CardTitle>
        </CardHeader>
        <CardContent>
          <LineItems
            items={data.lineItems}
            onChange={(items) => onChange("lineItems", items)}
          />
        </CardContent>
      </Card>

      {/* Totals */}
      <Card>
        <CardContent className="pt-6 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm items-center">
            <div className="flex items-center gap-2">
              <span className="text-gray-500">Tax</span>
              <Input
                type="number"
                value={data.taxRate}
                onChange={(e) =>
                  onChange("taxRate", parseFloat(e.target.value) || 0)
                }
                className="w-16 h-7 text-sm"
                min={0}
                max={100}
              />
              <span className="text-gray-500 text-sm">%</span>
            </div>
            <span>${tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold text-lg border-t pt-3">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default InvoiceForm;
