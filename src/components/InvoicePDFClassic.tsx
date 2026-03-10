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
import { hexToLightTint } from "@/utils/colorUtils";

/* ─── neutral tokens ─── */
const DARK = "#1E1E1E";
const MUTED = "#555555";
const BORDER = "#CCCCCC";

function buildStyles(accent: string, accentLight: string) {
  return StyleSheet.create({
    page: {
      paddingTop: 0,
      paddingBottom: 48,
      paddingHorizontal: 0,
      fontSize: 10,
      fontFamily: "Times-Roman",
      color: DARK,
      backgroundColor: "#FFFFFF",
    },

    /* ── header band ─────────────────────── */
    headerBand: {
      backgroundColor: accent,
      paddingVertical: 28,
      paddingHorizontal: 48,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    headerLeft: {
      flexDirection: "column",
      gap: 4,
    },
    logo: {
      width: 90,
      height: 45,
      objectFit: "contain",
    },
    businessName: {
      fontSize: 20,
      fontFamily: "Times-Bold",
      color: "#FFFFFF",
    },
    businessAddress: {
      fontSize: 9,
      color: "#FFFFFF",
      opacity: 0.85,
      lineHeight: 1.5,
      marginTop: 2,
    },
    headerRight: {
      alignItems: "flex-end",
    },
    invoiceTitle: {
      fontSize: 30,
      fontFamily: "Times-Bold",
      color: "#FFFFFF",
      letterSpacing: 2,
      textTransform: "uppercase",
    },
    invoiceNumber: {
      fontSize: 11,
      color: "#FFFFFF",
      opacity: 0.85,
      marginTop: 4,
    },

    /* ── body ────────────────────────────── */
    body: {
      paddingHorizontal: 48,
      paddingTop: 28,
    },

    /* ── meta row ────────────────────────── */
    metaRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 24,
      paddingBottom: 16,
      borderBottomWidth: 1,
      borderBottomColor: BORDER,
    },
    metaItem: {
      flexDirection: "column",
      alignItems: "center",
    },
    metaLabel: {
      fontSize: 8,
      fontFamily: "Times-Bold",
      color: MUTED,
      textTransform: "uppercase",
      letterSpacing: 1,
      marginBottom: 3,
    },
    metaValue: {
      fontFamily: "Times-Bold",
      fontSize: 11,
      color: DARK,
    },

    /* ── parties ─────────────────────────── */
    partiesRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 24,
    },
    partyBlock: {
      width: "48%",
    },
    partyLabel: {
      fontSize: 8,
      fontFamily: "Times-Bold",
      color: accent,
      textTransform: "uppercase",
      letterSpacing: 1.5,
      marginBottom: 6,
      paddingBottom: 4,
      borderBottomWidth: 1,
      borderBottomColor: accent,
    },
    partyName: {
      fontFamily: "Times-Bold",
      fontSize: 12,
      color: DARK,
      marginBottom: 2,
      marginTop: 6,
    },
    partyAddress: {
      color: MUTED,
      lineHeight: 1.6,
      fontSize: 10,
    },

    /* ── table ───────────────────────────── */
    tableHeader: {
      flexDirection: "row",
      backgroundColor: accent,
      paddingVertical: 8,
      paddingHorizontal: 10,
    },
    tableHeaderText: {
      fontSize: 9,
      fontFamily: "Times-Bold",
      color: "#FFFFFF",
      textTransform: "uppercase",
      letterSpacing: 0.5,
    },
    tableRow: {
      flexDirection: "row",
      paddingVertical: 9,
      paddingHorizontal: 10,
      borderBottomWidth: 1,
      borderBottomColor: BORDER,
    },
    tableRowAlt: {
      flexDirection: "row",
      paddingVertical: 9,
      paddingHorizontal: 10,
      borderBottomWidth: 1,
      borderBottomColor: BORDER,
      backgroundColor: accentLight,
    },
    colDesc: { flex: 3 },
    colQty: { flex: 1, textAlign: "center" },
    colRate: { flex: 1, textAlign: "right" },
    colTotal: { flex: 1, textAlign: "right", fontFamily: "Times-Bold" },

    /* ── totals ──────────────────────────── */
    totalsWrapper: {
      flexDirection: "row",
      justifyContent: "flex-end",
      marginTop: 20,
    },
    totalsBox: {
      width: 240,
      overflow: "hidden",
    },
    totalRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingVertical: 5,
      paddingHorizontal: 12,
    },
    totalLabel: {
      color: MUTED,
      fontSize: 10,
    },
    totalValue: {
      fontFamily: "Times-Bold",
      fontSize: 10,
      color: DARK,
    },
    grandTotalRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      backgroundColor: accent,
      paddingVertical: 10,
      paddingHorizontal: 12,
      marginTop: 4,
    },
    grandTotalLabel: {
      fontFamily: "Times-Bold",
      fontSize: 13,
      color: "#FFFFFF",
    },
    grandTotalValue: {
      fontFamily: "Times-Bold",
      fontSize: 13,
      color: "#FFFFFF",
    },

    /* ── notes ───────────────────────────── */
    notesContainer: {
      marginTop: 32,
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: BORDER,
    },
    notesLabel: {
      fontSize: 9,
      fontFamily: "Times-Bold",
      color: accent,
      textTransform: "uppercase",
      letterSpacing: 1,
      marginBottom: 6,
    },
    notesText: {
      color: MUTED,
      lineHeight: 1.6,
      fontSize: 10,
    },

    /* ── footer ──────────────────────────── */
    footer: {
      position: "absolute",
      bottom: 24,
      left: 48,
      right: 48,
      flexDirection: "row",
      justifyContent: "center",
      paddingTop: 10,
      borderTopWidth: 1,
      borderTopColor: BORDER,
    },
    footerText: {
      fontSize: 8,
      color: MUTED,
      fontFamily: "Times-Roman",
    },
  });
}

interface InvoicePDFClassicProps {
  data: InvoiceData;
  accentColor?: string;
  pageSize?: PageSize;
}

function InvoicePDFClassic({
  data,
  accentColor = "#0084c7",
  pageSize = "A4",
}: InvoicePDFClassicProps) {
  const accentLight = hexToLightTint(accentColor, 0.92);
  const styles = buildStyles(accentColor, accentLight);

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
        {/* ── Header Band ────────────────── */}
        <View style={styles.headerBand}>
          <View style={styles.headerLeft}>
            {data.logo ? (
              <Image src={data.logo} style={styles.logo} />
            ) : (
              <Text style={styles.businessName}>
                {data.businessName || "Your Business"}
              </Text>
            )}
            {data.businessAddress ? (
              <Text style={styles.businessAddress}>{data.businessAddress}</Text>
            ) : null}
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.invoiceTitle}>Invoice</Text>
            <Text style={styles.invoiceNumber}># {data.invoiceNumber}</Text>
          </View>
        </View>

        <View style={styles.body}>
          {/* ── Meta ─────────────────────── */}
          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Invoice No.</Text>
              <Text style={styles.metaValue}>{data.invoiceNumber}</Text>
            </View>
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Issue Date</Text>
              <Text style={styles.metaValue}>{data.date}</Text>
            </View>
            {data.dueDate ? (
              <View style={styles.metaItem}>
                <Text style={styles.metaLabel}>Due Date</Text>
                <Text style={styles.metaValue}>{data.dueDate}</Text>
              </View>
            ) : null}
          </View>

          {/* ── Parties ───────────────────── */}
          <View style={styles.partiesRow}>
            <View style={styles.partyBlock}>
              <Text style={styles.partyLabel}>From</Text>
              <Text style={styles.partyName}>{data.businessName || "—"}</Text>
              <Text style={styles.partyAddress}>{data.businessAddress}</Text>
            </View>
            <View style={styles.partyBlock}>
              <Text style={styles.partyLabel}>Bill To</Text>
              <Text style={styles.partyName}>{data.clientName || "—"}</Text>
              <Text style={styles.partyAddress}>{data.clientAddress}</Text>
            </View>
          </View>

          {/* ── Line Items Table ──────────── */}
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderText, styles.colDesc]}>
              Description
            </Text>
            <Text style={[styles.tableHeaderText, styles.colQty]}>Qty</Text>
            <Text style={[styles.tableHeaderText, styles.colRate]}>Rate</Text>
            <Text style={[styles.tableHeaderText, styles.colTotal]}>
              Amount
            </Text>
          </View>

          {data.lineItems.map((item, idx) => (
            <View
              key={item.id}
              style={idx % 2 === 1 ? styles.tableRowAlt : styles.tableRow}
            >
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
              <Text style={styles.notesLabel}>Notes / Terms</Text>
              <Text style={styles.notesText}>{data.notes}</Text>
            </View>
          ) : null}
        </View>

        {/* ── Footer ────────────────────── */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>{data.businessName}</Text>
        </View>
      </Page>
    </Document>
  );
}

export default InvoicePDFClassic;
