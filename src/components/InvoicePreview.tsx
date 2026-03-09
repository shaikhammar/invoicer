import type { InvoiceData } from "@/types/invoice";
import { PDFViewer } from "@react-pdf/renderer";
import InvoicePDF from "./InvoicePDF";
import { useDebounce } from "@uidotdev/usehooks";
import useIsMounted from "@/hooks/useIsMounted";

interface InvoicePreviewProps {
  data: InvoiceData;
}

function InvoicePreview({ data }: InvoicePreviewProps) {
  //   const [ready, setReady] = useState<boolean>(false);
  const isMounted = useIsMounted();

  const debouncedData = useDebounce(data, 300);

  //   useEffect(() => {
  //     const timer = setTimeout(() => {
  //       setReady(true);
  //     }, 100);
  //     return () => clearTimeout(timer);
  //   }, [data]);

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
