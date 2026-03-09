import { useState } from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import InvoiceForm from "./components/InvoiceForm";
import InvoicePDF from "./components/InvoicePDF";
import { Button } from "@/components/ui/button";
import type { InvoiceData } from "./types/invoice";
import InvoicePreview from "./components/InvoicePreview";

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
  const [activeTab, setActiveTab] = useState<"form" | "preview">("form");

  function handleChange(
    field: keyof InvoiceData,
    value: InvoiceData[keyof InvoiceData],
  ) {
    setInvoiceData((prev) => ({ ...prev, [field]: value }));
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">Invoice Generator</h1>
        <PDFDownloadLink
          document={<InvoicePDF data={invoiceData} />}
          fileName={`${invoiceData.invoiceNumber}.pdf`}
        >
          {({ loading }) => (
            <Button>{loading ? "Preparing..." : "Download PDF"}</Button>
          )}
        </PDFDownloadLink>
      </header>

      {/* Mobile Tab Toggle */}
      <div className="flex md:hidden border-b bg-white">
        <button
          className={`flex-1 py-3 text-sm font-medium ${
            activeTab === "form"
              ? "border-b-2 border-black text-black"
              : "text-gray-400"
          }`}
          onClick={() => setActiveTab("form")}
        >
          Edit
        </button>
        <button
          className={`flex-1 py-3 text-sm font-medium ${
            activeTab === "preview"
              ? "border-b-2 border-black text-black"
              : "text-gray-400"
          }`}
          onClick={() => setActiveTab("preview")}
        >
          Preview
        </button>
      </div>

      {/* Main Layout */}
      <div className="flex h-[calc(100vh-65px)]">
        {/* Left Panel — Form */}
        <div
          className={`
            w-full md:w-1/2 overflow-y-auto p-6
            ${activeTab === "preview" ? "hidden md:block" : "block"}
          `}
        >
          <InvoiceForm data={invoiceData} onChange={handleChange} />
        </div>

        {/* Divider */}
        <div className="hidden md:block w-px bg-gray-200" />

        {/* Right Panel — Preview */}
        <div
          className={`
            w-full md:w-1/2 bg-gray-100
            ${activeTab === "form" ? "hidden md:block" : "block"}
          `}
        >
          <InvoicePreview data={invoiceData} />
        </div>
      </div>
    </div>
  );
}

export default App;
