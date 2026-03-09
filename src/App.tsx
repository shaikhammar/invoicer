import { useState } from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import InvoiceForm from "./components/InvoiceForm";
import InvoicePDF from "./components/InvoicePDF";
import { Button } from "@/components/ui/button";
import type { InvoiceData } from "./types/invoice";

const initialData: InvoiceData = {
  businessName: "",
  clientName: "",
  invoiceNumber: "INV-001",
  date: new Date().toISOString().split("T")[0],
  lineItems: [
    {
      id: crypto.randomUUID(),
      description: "",
      quantity: 1,
      rate: 0,
    },
  ],
  taxRate: 0,
};

function App() {
  const [invoiceData, setInvoiceData] = useState<InvoiceData>(initialData);

  function handleChange(
    field: keyof InvoiceData,
    value: InvoiceData[keyof InvoiceData],
  ) {
    setInvoiceData((prev) => ({ ...prev, [field]: value }));
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold">Invoice Generator</h1>

        <InvoiceForm data={invoiceData} onChange={handleChange} />

        <PDFDownloadLink
          document={<InvoicePDF data={invoiceData} />}
          fileName={`${invoiceData.invoiceNumber}.pdf`}
        >
          {({ loading }) => (
            <Button className="w-full">
              {loading ? "Preparing PDF..." : "Download Invoice PDF"}
            </Button>
          )}
        </PDFDownloadLink>
      </div>
    </div>
  );
}

export default App;
