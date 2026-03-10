import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
} from "@react-pdf/renderer";
import type { InvoiceData } from "@/types/invoice";
import {
  calculateSubtotal,
  calculateTax,
  calculateTotal,
} from "@/utils/calculations";

const styles = StyleSheet.create({
  page: {
    padding: 48,
    fontSize: 10,
    fontFamily: "Helvetica",
    color: "#111",
  },

  // Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 40,
  },
  logo: {
    width: 80,
    height: 40,
    objectFit: "contain",
  },
  invoiceTitle: {
    fontSize: 28,
    fontFamily: "Helvetica-Bold",
    color: "#111",
  },

  // Party details
  partiesRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 40,
  },
  partyBlock: {
    width: "45%",
  },
  partyLabel: {
    fontSize: 9,
    color: "#888",
    marginBottom: 4,
    textTransform: "uppercase",
  },
  partyName: {
    fontFamily: "Helvetica-Bold",
    fontSize: 11,
    marginBottom: 2,
  },
  partyAddress: {
    color: "#555",
  },

  // Meta row
  metaRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 32,
    marginBottom: 40,
  },
  metaBlock: {
    alignItems: "flex-end",
  },
  metaLabel: {
    fontSize: 9,
    color: "#888",
    marginBottom: 2,
    textTransform: "uppercase",
  },
  metaValue: {
    fontFamily: "Helvetica-Bold",
  },

  // Table
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f4f4f4",
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 2,
    marginBottom: 4,
    fontSize: 9,
    color: "#888",
    textTransform: "uppercase",
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  colDesc: { flex: 3 },
  colQty: { flex: 1, textAlign: "center" },
  colRate: { flex: 1, textAlign: "right" },
  colTotal: { flex: 1, textAlign: "right" },

  // Totals
  totalsContainer: {
    marginTop: 16,
    alignItems: "flex-end",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: 200,
    paddingVertical: 3,
  },
  totalLabel: {
    color: "#888",
  },
  grandTotalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: 200,
    paddingVertical: 6,
    marginTop: 4,
    borderTopWidth: 1,
    borderTopColor: "#111",
  },
  grandTotalLabel: {
    fontFamily: "Helvetica-Bold",
    fontSize: 12,
  },
  grandTotalValue: {
    fontFamily: "Helvetica-Bold",
    fontSize: 12,
  },

  // Notes
  notes: {
    marginTop: 40,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    color: "#555",
    lineHeight: 1.6,
  },
  notesLabel: {
    fontSize: 9,
    color: "#888",
    textTransform: "uppercase",
    marginBottom: 4,
  },
});

interface InvoicePDFProps {
  data: InvoiceData;
}

function InvoicePDF({ data }: InvoicePDFProps) {
  const subtotal = calculateSubtotal(data.lineItems);
  const tax = calculateTax(subtotal, data.taxRate);
  const total = calculateTotal(subtotal, tax);
  const c = data.currency;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          {data.logo ? <Image src={data.logo} style={styles.logo} /> : <View />}
          <Text style={styles.invoiceTitle}>Invoice</Text>
        </View>

        {/* Parties */}
        <View style={styles.partiesRow}>
          <View style={styles.partyBlock}>
            <Text style={styles.partyLabel}>From</Text>
            <Text style={styles.partyName}>{data.businessName || "—"}</Text>
            <Text style={styles.partyAddress}>{data.businessAddress}</Text>
          </View>
          <View style={styles.partyBlock}>
            <Text style={styles.partyLabel}>To</Text>
            <Text style={styles.partyName}>{data.clientName || "—"}</Text>
            <Text style={styles.partyAddress}>{data.clientAddress}</Text>
          </View>
        </View>

        {/* Meta */}
        <View style={styles.metaRow}>
          <View style={styles.metaBlock}>
            <Text style={styles.metaLabel}>Invoice No.</Text>
            <Text style={styles.metaValue}>{data.invoiceNumber}</Text>
          </View>
          <View style={styles.metaBlock}>
            <Text style={styles.metaLabel}>Issue Date</Text>
            <Text style={styles.metaValue}>{data.date}</Text>
          </View>
          {data.dueDate && (
            <View style={styles.metaBlock}>
              <Text style={styles.metaLabel}>Due Date</Text>
              <Text style={styles.metaValue}>{data.dueDate}</Text>
            </View>
          )}
        </View>

        {/* Line Items Table */}
        <View style={styles.tableHeader}>
          <Text style={styles.colDesc}>Description</Text>
          <Text style={styles.colQty}>Qty</Text>
          <Text style={styles.colRate}>Rate</Text>
          <Text style={styles.colTotal}>Total</Text>
        </View>

        {data.lineItems.map((item) => (
          <View key={item.id} style={styles.tableRow}>
            <Text style={styles.colDesc}>{item.description || "—"}</Text>
            <Text style={styles.colQty}>{item.quantity}</Text>
            <Text style={styles.colRate}>
              {c}
              {item.rate.toFixed(2)}
            </Text>
            <Text style={styles.colTotal}>
              {c}
              {(item.quantity * item.rate).toFixed(2)}
            </Text>
          </View>
        ))}

        {/* Totals */}
        <View style={styles.totalsContainer}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Subtotal</Text>
            <Text>
              {c}
              {subtotal.toFixed(2)}
            </Text>
          </View>
          {data.taxRate > 0 && (
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Tax ({data.taxRate}%)</Text>
              <Text>
                {c}
                {tax.toFixed(2)}
              </Text>
            </View>
          )}
          <View style={styles.grandTotalRow}>
            <Text style={styles.grandTotalLabel}>Total</Text>
            <Text style={styles.grandTotalValue}>
              {c}
              {total.toFixed(2)}
            </Text>
          </View>
        </View>

        {/* Notes */}
        {data.notes ? (
          <View style={styles.notes}>
            <Text style={styles.notesLabel}>Notes</Text>
            <Text>{data.notes}</Text>
          </View>
        ) : null}
      </Page>
    </Document>
  );
}

export default InvoicePDF;
