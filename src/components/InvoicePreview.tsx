import type { InvoiceData } from "@/types/invoice";
import { PDFViewer } from "@react-pdf/renderer";
import InvoicePDF from "./InvoicePDF";
import { useDebounce } from "@uidotdev/usehooks";
import useIsMounted from "@/hooks/useIsMounted";

interface InvoicePreviewProps {
  data: InvoiceData;
}

function InvoicePreview({ data }: InvoicePreviewProps) {
  const isMounted = useIsMounted();

  const debouncedData = useDebounce(data, 300);
  if (!isMounted)
    return (
      <div className="w-full h-full flex items-center justify-center text-gray-400">
        Loading preview...
      </div>
    );

  return (
    <PDFViewer width="100%" height="100%" showToolbar={false}>
      <InvoicePDF data={debouncedData} />
    </PDFViewer>
  );
}

export default InvoicePreview;
