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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CURRENCIES } from "@/config/currencies";
import useLogoUpload from "@/hooks/useLogoUpload";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

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

  const [logoUrl, setLogoUrl] = useState<string | null>("");
  const [logoError, setLogoError] = useState<string | null>("");
  const [logoLoading, setLogoLoading] = useState<boolean>(false);

  const { handleUpload, handleUrlImport, handleRemove } = useLogoUpload(
    (base64) => onChange("logo", base64),
  );
  async function handleUrlSubmit() {
    if (!logoUrl?.trim()) return;
    setLogoError("");
    setLogoLoading(true);
    try {
      await handleUrlImport(logoUrl.trim());
      setLogoUrl("");
    } catch (error) {
      setLogoError(
        error instanceof Error ? error.message : "Image failed to load",
      );
    } finally {
      setLogoLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Logo Upload */}
      <Card>
        <CardHeader>
          <CardTitle>Logo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {data.logo ? (
            <div className="flex items-center gap-4">
              <img
                src={data.logo}
                alt="Logo"
                className="h-16 object-contain rounded border p-1"
              />
              <Button variant="outline" size="sm" onClick={handleRemove}>
                Remove
              </Button>
            </div>
          ) : (
            <Tabs defaultValue="file">
              <TabsList className="mb-3">
                <TabsTrigger value="file">Upload File</TabsTrigger>
                <TabsTrigger value="url">From URL</TabsTrigger>
              </TabsList>

              <TabsContent value="file">
                <Input type="file" accept="image/*" onChange={handleUpload} />
              </TabsContent>

              <TabsContent value="url" className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    value={logoUrl ?? ""}
                    onChange={(e) => {
                      setLogoUrl(e.target.value);
                      setLogoError("");
                    }}
                    placeholder="https://yourwebsite.com/logo.png"
                    onKeyDown={(e) => e.key === "Enter" && handleUrlSubmit()}
                  />
                  <Button
                    variant="outline"
                    onClick={handleUrlSubmit}
                    disabled={logoLoading || !logoUrl?.trim()}
                  >
                    {logoLoading ? "Loading..." : "Import"}
                  </Button>
                </div>
                {logoError && (
                  <p className="text-sm text-red-500">{logoError}</p>
                )}
                <p className="text-xs text-gray-400">
                  Press Enter or click Import. The image will be embedded in
                  your PDF.
                </p>
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>

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
            <Label>Business Address</Label>
            <Textarea
              value={data.businessAddress}
              onChange={(e) => onChange("businessAddress", e.target.value)}
              placeholder="Your address"
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label>Client Address</Label>
            <Textarea
              value={data.clientAddress}
              onChange={(e) => onChange("clientAddress", e.target.value)}
              placeholder="Client address"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Invoice Meta */}
      <Card>
        <CardHeader>
          <CardTitle>Invoice Details</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Invoice Number</Label>
            <Input
              value={data.invoiceNumber}
              onChange={(e) => onChange("invoiceNumber", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Currency</Label>
            <Select
              value={data.currency}
              onValueChange={(value) => onChange("currency", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CURRENCIES.map((c) => (
                  <SelectItem key={c.symbol} value={c.symbol}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Issue Date</Label>
            <Input
              type="date"
              value={data.date}
              onChange={(e) => onChange("date", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Due Date</Label>
            <Input
              type="date"
              value={data.dueDate}
              onChange={(e) => onChange("dueDate", e.target.value)}
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
            currency={data.currency}
            onChange={(items) => onChange("lineItems", items)}
          />
        </CardContent>
      </Card>

      {/* Totals */}
      <Card>
        <CardContent className="pt-6 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Subtotal</span>
            <span>
              {data.currency}
              {subtotal.toFixed(2)}
            </span>
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
            <span>
              {data.currency}
              {tax.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between font-bold text-lg border-t pt-3">
            <span>Total</span>
            <span>
              {data.currency}
              {total.toFixed(2)}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Notes */}
      <Card>
        <CardHeader>
          <CardTitle>Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={data.notes}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              onChange("notes", e.target.value)
            }
            placeholder="Payment terms, bank details, thank you note..."
            rows={4}
          />
        </CardContent>
      </Card>
    </div>
  );
}

export default InvoiceForm;
