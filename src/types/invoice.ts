export interface LineItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
}

export interface InvoiceData {
  businessName: string;
  businessAddress: string;
  clientName: string;
  clientAddress: string;
  invoiceNumber: string;
  date: string;
  dueDate: string;
  lineItems: LineItem[];
  taxRate: number;
  discountType: "percentage" | "fixed";
  discountRate: number;
  discountAmount: number;
  notes: string;
  currency: string;
  logo: string | null;
}

export interface SavedInvoice {
  id: string;
  savedAt: string;
  data: InvoiceData;
}

export type TemplateStyle = "modern" | "minimal" | "classic";
export type PageSize = "A4" | "LETTER";

export interface InvoiceSettings {
  template: TemplateStyle;
  accentColor: string;
  pageSize: PageSize;
}
