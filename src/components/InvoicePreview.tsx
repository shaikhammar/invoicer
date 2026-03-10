import type { InvoiceData, InvoiceSettings } from "@/types/invoice";
import { PDFViewer } from "@react-pdf/renderer";
import InvoicePDF from "./InvoicePDF";
import InvoicePDFMinimal from "./InvoicePDFMinimal";
import InvoicePDFClassic from "./InvoicePDFClassic";
import { useDebounce } from "@uidotdev/usehooks";
import useIsMounted from "@/hooks/useIsMounted";

interface InvoicePreviewProps {
  data: InvoiceData;
  settings: InvoiceSettings;
}

function InvoicePreview({ data, settings }: InvoicePreviewProps) {
  const isMounted = useIsMounted();

  const debouncedData = useDebounce(data, 300);
  const debouncedSettings = useDebounce(settings, 300);

  if (!isMounted)
    return (
      <div className="w-full h-full flex items-center justify-center text-gray-400">
        Loading preview...
      </div>
    );

  const TemplateComponent =
    debouncedSettings.template === "minimal"
      ? InvoicePDFMinimal
      : debouncedSettings.template === "classic"
        ? InvoicePDFClassic
        : InvoicePDF;

  return (
    <PDFViewer width="100%" height="100%" showToolbar={false}>
      <TemplateComponent
        data={debouncedData}
        accentColor={debouncedSettings.accentColor}
        pageSize={debouncedSettings.pageSize}
      />
    </PDFViewer>
  );
}

export default InvoicePreview;
