import { useLocalStorage } from "@uidotdev/usehooks";
import type { InvoiceData, SavedInvoice } from "@/types/invoice";

function useInvoices() {
  const [savedInvoices, setSavedInvoices] = useLocalStorage<SavedInvoice[]>(
    "saved-invoices",
    [],
  );

  function saveInvoice(data: InvoiceData) {
    const existing = savedInvoices.find(
      (inv) => inv.data.invoiceNumber === data.invoiceNumber,
    );

    if (existing) {
      // Update existing invoice with same invoice number
      setSavedInvoices(
        savedInvoices.map((inv) =>
          inv.id === existing.id
            ? { ...inv, savedAt: new Date().toISOString(), data }
            : inv,
        ),
      );
    } else {
      // Save as new entry
      setSavedInvoices([
        ...savedInvoices,
        {
          id: crypto.randomUUID(),
          savedAt: new Date().toISOString(),
          data,
        },
      ]);
    }
  }

  function deleteInvoice(id: string) {
    setSavedInvoices(savedInvoices.filter((inv) => inv.id !== id));
  }

  function duplicateInvoice(id: string): InvoiceData | null {
    const invoice = savedInvoices.find((inv) => inv.id === id);
    if (!invoice) return null;

    const duplicated: InvoiceData = {
      ...invoice.data,
      invoiceNumber: `${invoice.data.invoiceNumber}-COPY`,
      date: new Date().toISOString().split("T")[0],
    };

    setSavedInvoices([
      ...savedInvoices,
      {
        id: crypto.randomUUID(),
        savedAt: new Date().toISOString(),
        data: duplicated,
      },
    ]);

    return duplicated;
  }

  return {
    savedInvoices,
    saveInvoice,
    deleteInvoice,
    duplicateInvoice,
  };
}

export default useInvoices;
