export interface LineItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
}

export interface InvoiceData {
  businessName: string;
  clientName: string;
  invoiceNumber: string;
  date: string;
  lineItems: LineItem[];
  taxRate: number;
}
