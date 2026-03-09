import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import type { InvoiceData } from "@/types/invoice";
import {
  calculateSubtotal,
  calculateTax,
  calculateTotal,
} from "@/utils/calculations";

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 12, fontFamily: "Helvetica" },
  title: { fontSize: 24, marginBottom: 30, fontFamily: "Helvetica-Bold" },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  label: { fontSize: 10, color: "#888", marginBottom: 2 },
  section: { marginBottom: 24 },
  tableHeader: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    paddingBottom: 4,
    marginBottom: 6,
    fontSize: 10,
    color: "#888",
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  col_desc: { flex: 3 },
  col_qty: { flex: 1, textAlign: "center" },
  col_rate: { flex: 1, textAlign: "right" },
  col_total: { flex: 1, textAlign: "right" },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
  },
  totalLabel: { color: "#888", fontSize: 11 },
  grandTotal: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#000",
    fontFamily: "Helvetica-Bold",
  },
});

interface InvoicePDFProps {
  data: InvoiceData;
}

function InvoicePDF({ data }: InvoicePDFProps) {
  const subtotal = calculateSubtotal(data.lineItems);
  const tax = calculateTax(subtotal, data.taxRate);
  const total = calculateTotal(subtotal, tax);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>Invoice</Text>

        {/* Details */}
        <View style={styles.section}>
          <View style={styles.row}>
            <View>
              <Text style={styles.label}>FROM</Text>
              <Text>{data.businessName || "—"}</Text>
            </View>
            <View>
              <Text style={styles.label}>TO</Text>
              <Text>{data.clientName || "—"}</Text>
            </View>
            <View>
              <Text style={styles.label}>INVOICE NO.</Text>
              <Text>{data.invoiceNumber}</Text>
            </View>
            <View>
              <Text style={styles.label}>DATE</Text>
              <Text>{data.date}</Text>
            </View>
          </View>
        </View>

        {/* Line Items Table */}
        <View style={styles.section}>
          <View style={styles.tableHeader}>
            <Text style={styles.col_desc}>Description</Text>
            <Text style={styles.col_qty}>Qty</Text>
            <Text style={styles.col_rate}>Rate</Text>
            <Text style={styles.col_total}>Total</Text>
          </View>
          {data.lineItems.map((item) => (
            <View key={item.id} style={styles.tableRow}>
              <Text style={styles.col_desc}>{item.description || "—"}</Text>
              <Text style={styles.col_qty}>{item.quantity}</Text>
              <Text style={styles.col_rate}>${item.rate.toFixed(2)}</Text>
              <Text style={styles.col_total}>
                ${(item.quantity * item.rate).toFixed(2)}
              </Text>
            </View>
          ))}
        </View>

        {/* Totals */}
        <View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Subtotal</Text>
            <Text>${subtotal.toFixed(2)}</Text>
          </View>
          {data.taxRate > 0 && (
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Tax ({data.taxRate}%)</Text>
              <Text>${tax.toFixed(2)}</Text>
            </View>
          )}
          <View style={styles.grandTotal}>
            <Text>Total</Text>
            <Text>${total.toFixed(2)}</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}

export default InvoicePDF;
