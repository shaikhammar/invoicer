import { useState, lazy, Suspense } from "react";
import type { InvoiceData, InvoiceSettings } from "@/types/invoice";
import InvoiceForm from "./components/InvoiceForm";
import InvoiceList from "./components/InvoiceList";
import PrintView from "./components/PrintView";
import { Button } from "@/components/ui/button";
import { useLocalStorage } from "@uidotdev/usehooks";
import useInvoices from "@/hooks/useInvoices";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { HugeiconsIcon } from "@hugeicons/react";
import { FolderOpenIcon, SaveIcon } from "@hugeicons/core-free-icons";

const InvoicePreview = lazy(() =>
  import("@/components/PDFComponents").then((m) => ({
    default: m.InvoicePreview as React.FC<{
      data: InvoiceData;
      settings: InvoiceSettings;
    }>,
  })),
);

const PDFDownloadButton = lazy(() =>
  import("@/components/PDFComponents").then((m) => {
    const {
      PDFDownloadLink,
      InvoicePDF,
      InvoicePDFMinimal,
      InvoicePDFClassic,
    } = m;
    return {
      default: function DownloadButton({
        data,
        settings,
      }: {
        data: InvoiceData;
        settings: InvoiceSettings;
      }) {
        const TemplateComponent =
          settings.template === "minimal"
            ? InvoicePDFMinimal
            : settings.template === "classic"
              ? InvoicePDFClassic
              : InvoicePDF;
        return (
          <PDFDownloadLink
            document={
              <TemplateComponent
                data={data}
                accentColor={settings.accentColor}
                pageSize={settings.pageSize}
              />
            }
            fileName={`${data.invoiceNumber}.pdf`}
          >
            {({ loading }: { loading: boolean }) => (
              <Button>{loading ? "Preparing..." : "Download PDF"}</Button>
            )}
          </PDFDownloadLink>
        );
      },
    };
  }),
);

const initialData: InvoiceData = {
  businessName: "",
  businessAddress: "",
  clientName: "",
  clientAddress: "",
  invoiceNumber: "INV-001",
  date: new Date().toISOString().split("T")[0],
  dueDate: "",
  lineItems: [
    { id: crypto.randomUUID(), description: "", quantity: 1, rate: 0 },
  ],
  taxRate: 0,
  discountType: "percentage",
  discountRate: 0,
  discountAmount: 0,
  notes: "",
  currency: "$",
  logo: null,
};

const defaultSettings: InvoiceSettings = {
  template: "modern",
  accentColor: "#0084c7",
  pageSize: "A4",
};

function App() {
  const [invoiceData, setInvoiceData] = useLocalStorage<InvoiceData>(
    "invoice-draft",
    initialData,
  );
  const [settings, setSettings] = useLocalStorage<InvoiceSettings>(
    "invoice-settings",
    defaultSettings,
  );
  const [activeTab, setActiveTab] = useLocalStorage<"form" | "preview">(
    "active-tab",
    "form",
  );
  const [sheetOpen, setSheetOpen] = useState(false);
  const { savedInvoices, saveInvoice, deleteInvoice, duplicateInvoice } =
    useInvoices();

  function handleChange(
    field: keyof InvoiceData,
    value: InvoiceData[keyof InvoiceData],
  ) {
    setInvoiceData({ ...invoiceData, [field]: value });
  }

  function handleNewInvoice() {
    const confirmed = window.confirm(
      "Start a new invoice? Your current work will be cleared.",
    );
    if (confirmed) {
      setInvoiceData({
        ...initialData,
        date: new Date().toISOString().split("T")[0],
        lineItems: [
          { id: crypto.randomUUID(), description: "", quantity: 1, rate: 0 },
        ],
      });
    }
  }

  function handleSave() {
    saveInvoice(invoiceData);
  }

  function handleLoad(data: InvoiceData) {
    setInvoiceData(data);
    setSheetOpen(false);
  }

  function handleDuplicate(id: string) {
    const duplicated = duplicateInvoice(id);
    if (duplicated) {
      setInvoiceData(duplicated);
      setSheetOpen(false);
    }
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50 print:hidden">
        {/* Header */}
        <header className="bg-white border-b px-6 py-4 flex items-center justify-between print:hidden">
          <h1 className="text-xl font-bold">Invoice Generator</h1>
          <div className="flex items-center gap-2">
            {/* Saved Invoices Sheet */}
            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
              <SheetTrigger
                render={
                  <Button variant="outline" size="icon">
                    <HugeiconsIcon icon={FolderOpenIcon} className="w-4 h-4" />
                  </Button>
                }
              ></SheetTrigger>
              <SheetContent side="left" className="w-80 p-0">
                <SheetHeader className="p-4 border-b">
                  <SheetTitle>Saved Invoices</SheetTitle>
                </SheetHeader>
                <InvoiceList
                  invoices={savedInvoices}
                  onLoad={handleLoad}
                  onDelete={deleteInvoice}
                  onDuplicate={handleDuplicate}
                />
              </SheetContent>
            </Sheet>

            <Button variant="outline" size="icon" onClick={handleSave}>
              <HugeiconsIcon icon={SaveIcon} className="w-4 h-4" />
            </Button>

            <Button variant="outline" onClick={handleNewInvoice}>
              New
            </Button>

            <Button variant="outline" onClick={() => window.print()}>
              Print
            </Button>

            <Suspense fallback={<Button disabled>Loading...</Button>}>
              <PDFDownloadButton data={invoiceData} settings={settings} />
            </Suspense>
          </div>
        </header>

        {/* Mobile Tab Toggle */}
        <div className="flex md:hidden border-b bg-white print:hidden">
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
            w-full md:w-1/2 overflow-y-auto p-6 print:hidden
            ${activeTab === "preview" ? "hidden md:block" : "block"}
          `}
          >
            <InvoiceForm
              data={invoiceData}
              onChange={handleChange}
              settings={settings}
              onSettingsChange={setSettings}
            />
          </div>

          {/* Divider */}
          <div className="hidden md:block w-px bg-gray-200 print:hidden" />

          {/* Right Panel — Preview (hidden in print) */}
          <div
            className={`
            w-full md:w-1/2 bg-gray-100 print:hidden
            ${activeTab === "form" ? "hidden md:block" : "block"}
          `}
          >
            <Suspense
              fallback={
                <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                  Loading preview...
                </div>
              }
            >
              <InvoicePreview data={invoiceData} settings={settings} />
            </Suspense>
          </div>
        </div>
      </div>

      {/* Print-only HTML view — hidden on screen, shown when printing */}
      <PrintView data={invoiceData} settings={settings} />
    </>
  );
}

export default App;
