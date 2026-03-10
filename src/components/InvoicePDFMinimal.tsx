import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
} from "@react-pdf/renderer";
import type { InvoiceData, PageSize } from "@/types/invoice";
import {
  calculateDiscount,
  calculateSubtotal,
  calculateTax,
  calculateTotal,
} from "@/utils/calculations";

/* ─── neutral tokens ─── */
const DARK = "#1A1A1A";
const MUTED = "#888888";
const BORDER = "#E5E5E5";

function buildStyles(accent: string) {
  return StyleSheet.create({
    page: {
      paddingTop: 60,
      paddingBottom: 60,
      paddingHorizontal: 60,
      fontSize: 10,
      fontFamily: "Helvetica",
      color: DARK,
      backgroundColor: "#FFFFFF",
    },

    /* ── header ──────────────────────────── */
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: 48,
    },
    headerLeft: {
      flexDirection: "column",
      gap: 4,
    },
    logo: {
      width: 80,
      height: 40,
      objectFit: "contain",
      marginBottom: 6,
    },
    businessName: {
      fontSize: 14,
      fontFamily: "Helvetica-Bold",
      color: DARK,
    },
    businessAddress: {
      fontSize: 9,
      color: MUTED,
      lineHeight: 1.6,
      marginTop: 4,
    },
    headerRight: {
      alignItems: "flex-end",
    },
    invoiceTitle: {
      fontSize: 28,
      fontFamily: "Helvetica",
      color: accent,
      letterSpacing: 3,
      textTransform: "uppercase",
    },
    invoiceNumber: {
      fontSize: 9,
      color: MUTED,
      marginTop: 6,
    },

    /* ── parties ─────────────────────────── */
    partiesRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 36,
    },
    partyBlock: {
      width: "45%",
    },
    partyLabel: {
      fontSize: 8,
      color: MUTED,
      textTransform: "uppercase",
      letterSpacing: 1.5,
      marginBottom: 6,
    },
    partyName: {
      fontFamily: "Helvetica-Bold",
      fontSize: 11,
      color: DARK,
      marginBottom: 2,
    },
    partyAddress: {
      color: MUTED,
      lineHeight: 1.6,
      fontSize: 9,
    },

    /* ── meta ────────────────────────────── */
    metaRow: {
      flexDirection: "row",
      marginBottom: 32,
      gap: 40,
    },
    metaItem: {
      flexDirection: "column",
    },
    metaLabel: {
      fontSize: 8,
      color: MUTED,
      textTransform: "uppercase",
      letterSpacing: 1,
      marginBottom: 3,
    },
    metaValue: {
      fontFamily: "Helvetica-Bold",
      fontSize: 10,
      color: DARK,
    },

    /* ── table ───────────────────────────── */
    tableHeader: {
      flexDirection: "row",
      paddingBottom: 8,
      borderBottomWidth: 1,
      borderBottomColor: DARK,
      marginBottom: 0,
    },
    tableHeaderText: {
      fontSize: 8,
      fontFamily: "Helvetica-Bold",
      color: DARK,
      textTransform: "uppercase",
      letterSpacing: 0.5,
    },
    tableRow: {
      flexDirection: "row",
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: BORDER,
    },
    colDesc: { flex: 3 },
    colQty: { flex: 1, textAlign: "center" },
    colRate: { flex: 1, textAlign: "right" },
    colTotal: { flex: 1, textAlign: "right", fontFamily: "Helvetica-Bold" },

    /* ── totals ──────────────────────────── */
    totalsWrapper: {
      flexDirection: "row",
      justifyContent: "flex-end",
      marginTop: 24,
    },
    totalsBox: {
      width: 220,
    },
    totalRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingVertical: 5,
    },
    totalLabel: {
      color: MUTED,
      fontSize: 10,
    },
    totalValue: {
      fontFamily: "Helvetica-Bold",
      fontSize: 10,
      color: DARK,
    },
    grandTotalRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingVertical: 8,
      marginTop: 6,
      borderTopWidth: 2,
      borderTopColor: accent,
    },
    grandTotalLabel: {
      fontFamily: "Helvetica-Bold",
      fontSize: 12,
      color: DARK,
    },
    grandTotalValue: {
      fontFamily: "Helvetica-Bold",
      fontSize: 12,
      color: accent,
    },

    /* ── notes ───────────────────────────── */
    notesContainer: {
      marginTop: 36,
    },
    notesLabel: {
      fontSize: 8,
      color: MUTED,
      textTransform: "uppercase",
      letterSpacing: 1,
      marginBottom: 6,
    },
    notesText: {
      color: MUTED,
      lineHeight: 1.6,
      fontSize: 9,
    },

    /* ── footer ──────────────────────────── */
    footer: {
      position: "absolute",
      bottom: 30,
      left: 60,
      right: 60,
      flexDirection: "row",
      justifyContent: "center",
    },
    footerText: {
      fontSize: 8,
      color: MUTED,
    },
  });
}

interface InvoicePDFMinimalProps {
  data: InvoiceData;
  accentColor?: string;
  pageSize?: PageSize;
}

function InvoicePDFMinimal({
  data,
  accentColor = "#0084c7",
  pageSize = "A4",
}: InvoicePDFMinimalProps) {
  const styles = buildStyles(accentColor);

  const subtotal = calculateSubtotal(data.lineItems);
  const discount = calculateDiscount(
    subtotal,
    data.discountType,
    data.discountRate,
    data.discountAmount,
  );
  const discountedSubtotal = subtotal - discount;
  const tax = calculateTax(discountedSubtotal, data.taxRate);
  const total = calculateTotal(discountedSubtotal, tax);
  const c = data.currency;

  return (
    <Document>
      <Page size={pageSize} style={styles.page}>
        {/* ── Header ────────────────────── */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            {data.logo ? <Image src={data.logo} style={styles.logo} /> : null}
            <Text style={styles.businessName}>
              {data.businessName || "Your Business"}
            </Text>
            {data.businessAddress ? (
              <Text style={styles.businessAddress}>{data.businessAddress}</Text>
            ) : null}
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.invoiceTitle}>Invoice</Text>
            <Text style={styles.invoiceNumber}>{data.invoiceNumber}</Text>
          </View>
        </View>

        {/* ── Parties ───────────────────── */}
        <View style={styles.partiesRow}>
          <View style={styles.partyBlock}>
            <Text style={styles.partyLabel}>Bill To</Text>
            <Text style={styles.partyName}>{data.clientName || "—"}</Text>
            <Text style={styles.partyAddress}>{data.clientAddress}</Text>
          </View>
          <View style={styles.partyBlock}>
            <View style={styles.metaRow}>
              <View style={styles.metaItem}>
                <Text style={styles.metaLabel}>Date</Text>
                <Text style={styles.metaValue}>{data.date}</Text>
              </View>
              {data.dueDate ? (
                <View style={styles.metaItem}>
                  <Text style={styles.metaLabel}>Due</Text>
                  <Text style={styles.metaValue}>{data.dueDate}</Text>
                </View>
              ) : null}
            </View>
          </View>
        </View>

        {/* ── Line Items Table ──────────── */}
        <View style={styles.tableHeader}>
          <Text style={[styles.tableHeaderText, styles.colDesc]}>
            Description
          </Text>
          <Text style={[styles.tableHeaderText, styles.colQty]}>Qty</Text>
          <Text style={[styles.tableHeaderText, styles.colRate]}>Rate</Text>
          <Text style={[styles.tableHeaderText, styles.colTotal]}>Amount</Text>
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

        {/* ── Totals ────────────────────── */}
        <View style={styles.totalsWrapper}>
          <View style={styles.totalsBox}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Subtotal</Text>
              <Text style={styles.totalValue}>
                {c}
                {subtotal.toFixed(2)}
              </Text>
            </View>
            {discount > 0 && (
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>
                  {data.discountType === "fixed"
                    ? "Discount"
                    : `Discount (${data.discountRate}%)`}
                </Text>
                <Text style={styles.totalValue}>
                  -{c}
                  {discount.toFixed(2)}
                </Text>
              </View>
            )}
            {data.taxRate > 0 && (
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Tax ({data.taxRate}%)</Text>
                <Text style={styles.totalValue}>
                  {c}
                  {tax.toFixed(2)}
                </Text>
              </View>
            )}
            <View style={styles.grandTotalRow}>
              <Text style={styles.grandTotalLabel}>Total Due</Text>
              <Text style={styles.grandTotalValue}>
                {c}
                {total.toFixed(2)}
              </Text>
            </View>
          </View>
        </View>

        {/* ── Notes ─────────────────────── */}
        {data.notes ? (
          <View style={styles.notesContainer}>
            <Text style={styles.notesLabel}>Notes</Text>
            <Text style={styles.notesText}>{data.notes}</Text>
          </View>
        ) : null}

        {/* ── Footer ────────────────────── */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>{data.businessName}</Text>
        </View>
      </Page>
    </Document>
  );
}

export default InvoicePDFMinimal;
