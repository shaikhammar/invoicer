import type { InvoiceData, InvoiceSettings } from "@/types/invoice";
import {
  calculateDiscount,
  calculateSubtotal,
  calculateTax,
  calculateTotal,
} from "@/utils/calculations";

interface PrintViewProps {
  data: InvoiceData;
  settings: InvoiceSettings;
}

/* ─── shared helpers ────────────────────── */
function useCalcs(data: InvoiceData) {
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
  return { subtotal, discount, tax, total };
}

type CalcResult = ReturnType<typeof useCalcs>;

/* ─── shared parts ──────────────────────── */
function TotalsBlock({
  data,
  calcs,
  accent,
  grandTotalStyle,
}: {
  data: InvoiceData;
  calcs: CalcResult;
  accent: string;
  grandTotalStyle?: React.CSSProperties;
}) {
  const c = data.currency;
  const defaultGrandTotal: React.CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    backgroundColor: accent,
    color: "#fff",
    padding: "10px 16px",
    borderRadius: 4,
    marginTop: 4,
    fontWeight: 700,
    fontSize: 14,
  };
  return (
    <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 20 }}>
      <div style={{ width: 240 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "6px 16px",
          }}
        >
          <span style={{ color: "#64748B" }}>Subtotal</span>
          <span style={{ fontWeight: 700 }}>
            {c}
            {calcs.subtotal.toFixed(2)}
          </span>
        </div>
        {calcs.discount > 0 && (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "6px 16px",
            }}
          >
            <span style={{ color: "#64748B" }}>
              {data.discountType === "fixed"
                ? "Discount"
                : `Discount (${data.discountRate}%)`}
            </span>
            <span style={{ fontWeight: 700 }}>
              -{c}
              {calcs.discount.toFixed(2)}
            </span>
          </div>
        )}
        {data.taxRate > 0 && (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "6px 16px",
            }}
          >
            <span style={{ color: "#64748B" }}>Tax ({data.taxRate}%)</span>
            <span style={{ fontWeight: 700 }}>
              {c}
              {calcs.tax.toFixed(2)}
            </span>
          </div>
        )}
        <div style={grandTotalStyle ?? defaultGrandTotal}>
          <span>Total Due</span>
          <span>
            {c}
            {calcs.total.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}

function Footer({ name }: { name: string }) {
  return (
    <div
      style={{
        marginTop: 48,
        paddingTop: 12,
        borderTop: "1px solid #E2E8F0",
        textAlign: "center",
        fontSize: 9,
        color: "#64748B",
      }}
    >
      {name}
    </div>
  );
}

/* ═══════════════════════════════════════════
   Modern template
   ═══════════════════════════════════════════ */
function PrintModern({
  data,
  accent,
  calcs,
}: {
  data: InvoiceData;
  accent: string;
  calcs: CalcResult;
}) {
  const c = data.currency;
  return (
    <>
      <div style={{ height: 6, backgroundColor: accent, marginBottom: 32 }} />
      <div style={{ padding: "0 48px" }}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: 32,
          }}
        >
          <div>
            {data.logo ? (
              <img
                src={data.logo}
                alt="Logo"
                style={{ height: 50, objectFit: "contain" }}
              />
            ) : (
              <div style={{ fontSize: 20, fontWeight: 700 }}>
                {data.businessName || "Your Business"}
              </div>
            )}
          </div>
          <div style={{ textAlign: "right" }}>
            <div
              style={{
                fontSize: 32,
                fontWeight: 700,
                color: accent,
                letterSpacing: 1,
                textTransform: "uppercase",
              }}
            >
              Invoice
            </div>
            {data.invoiceNumber && (
              <div
                style={{
                  marginTop: 6,
                  display: "inline-block",
                  backgroundColor: `${accent}15`,
                  padding: "4px 12px",
                  borderRadius: 4,
                  fontSize: 11,
                  fontWeight: 700,
                  color: accent,
                }}
              >
                # {data.invoiceNumber}
              </div>
            )}
          </div>
        </div>

        <hr
          style={{
            border: "none",
            borderTop: "1px solid #E2E8F0",
            margin: "20px 0",
          }}
        />

        {/* Parties */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 8,
          }}
        >
          <div style={{ width: "48%" }}>
            <div
              style={{
                fontSize: 9,
                fontWeight: 700,
                color: accent,
                textTransform: "uppercase",
                letterSpacing: 1.5,
                marginBottom: 6,
              }}
            >
              From
            </div>
            <div style={{ fontWeight: 700, fontSize: 13 }}>
              {data.businessName || "—"}
            </div>
            <div
              style={{
                color: "#64748B",
                lineHeight: 1.6,
                fontSize: 11,
                whiteSpace: "pre-wrap",
              }}
            >
              {data.businessAddress}
            </div>
          </div>
          <div style={{ width: "48%" }}>
            <div
              style={{
                fontSize: 9,
                fontWeight: 700,
                color: accent,
                textTransform: "uppercase",
                letterSpacing: 1.5,
                marginBottom: 6,
              }}
            >
              Bill To
            </div>
            <div style={{ fontWeight: 700, fontSize: 13 }}>
              {data.clientName || "—"}
            </div>
            <div
              style={{
                color: "#64748B",
                lineHeight: 1.6,
                fontSize: 11,
                whiteSpace: "pre-wrap",
              }}
            >
              {data.clientAddress}
            </div>
          </div>
        </div>

        <hr
          style={{
            border: "none",
            borderTop: "1px solid #E2E8F0",
            margin: "20px 0",
          }}
        />

        {/* Meta */}
        <div
          style={{
            display: "flex",
            backgroundColor: "#F8FAFC",
            borderRadius: 4,
            padding: "12px 16px",
            marginBottom: 28,
            textAlign: "center",
          }}
        >
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontSize: 9,
                fontWeight: 700,
                color: "#64748B",
                textTransform: "uppercase",
                letterSpacing: 1,
                marginBottom: 3,
              }}
            >
              Invoice No.
            </div>
            <div style={{ fontWeight: 700, fontSize: 12 }}>
              {data.invoiceNumber}
            </div>
          </div>
          <div style={{ flex: 1, borderLeft: "1px solid #E2E8F0" }}>
            <div
              style={{
                fontSize: 9,
                fontWeight: 700,
                color: "#64748B",
                textTransform: "uppercase",
                letterSpacing: 1,
                marginBottom: 3,
              }}
            >
              Issue Date
            </div>
            <div style={{ fontWeight: 700, fontSize: 12 }}>{data.date}</div>
          </div>
          {data.dueDate && (
            <div style={{ flex: 1, borderLeft: "1px solid #E2E8F0" }}>
              <div
                style={{
                  fontSize: 9,
                  fontWeight: 700,
                  color: "#64748B",
                  textTransform: "uppercase",
                  letterSpacing: 1,
                  marginBottom: 3,
                }}
              >
                Due Date
              </div>
              <div style={{ fontWeight: 700, fontSize: 12 }}>
                {data.dueDate}
              </div>
            </div>
          )}
        </div>

        {/* Table */}
        <table
          style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}
        >
          <thead>
            <tr style={{ backgroundColor: accent, color: "#fff" }}>
              <th
                style={{
                  textAlign: "left",
                  padding: "8px 12px",
                  fontSize: 9,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: 1,
                }}
              >
                Description
              </th>
              <th
                style={{
                  textAlign: "center",
                  padding: "8px 12px",
                  fontSize: 9,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: 1,
                }}
              >
                Qty
              </th>
              <th
                style={{
                  textAlign: "right",
                  padding: "8px 12px",
                  fontSize: 9,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: 1,
                }}
              >
                Rate
              </th>
              <th
                style={{
                  textAlign: "right",
                  padding: "8px 12px",
                  fontSize: 9,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: 1,
                }}
              >
                Amount
              </th>
            </tr>
          </thead>
          <tbody>
            {data.lineItems.map((item, idx) => (
              <tr
                key={item.id}
                style={{
                  backgroundColor: idx % 2 === 1 ? "#F8FAFC" : "transparent",
                  borderBottom: "1px solid #E2E8F0",
                }}
              >
                <td style={{ padding: "10px 12px" }}>
                  {item.description || "—"}
                </td>
                <td style={{ padding: "10px 12px", textAlign: "center" }}>
                  {item.quantity}
                </td>
                <td style={{ padding: "10px 12px", textAlign: "right" }}>
                  {c}
                  {item.rate.toFixed(2)}
                </td>
                <td
                  style={{
                    padding: "10px 12px",
                    textAlign: "right",
                    fontWeight: 700,
                  }}
                >
                  {c}
                  {(item.quantity * item.rate).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <TotalsBlock data={data} calcs={calcs} accent={accent} />

        {data.notes && (
          <div
            style={{
              marginTop: 36,
              padding: 16,
              backgroundColor: "#F8FAFC",
              borderRadius: 4,
              borderLeft: `3px solid ${accent}`,
            }}
          >
            <div
              style={{
                fontSize: 9,
                fontWeight: 700,
                color: accent,
                textTransform: "uppercase",
                letterSpacing: 1,
                marginBottom: 6,
              }}
            >
              Notes / Terms
            </div>
            <div
              style={{
                color: "#64748B",
                lineHeight: 1.6,
                fontSize: 11,
                whiteSpace: "pre-wrap",
              }}
            >
              {data.notes}
            </div>
          </div>
        )}

        <Footer name={data.businessName} />
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════
   Minimal template
   ═══════════════════════════════════════════ */
function PrintMinimal({
  data,
  accent,
  calcs,
}: {
  data: InvoiceData;
  accent: string;
  calcs: CalcResult;
}) {
  const c = data.currency;
  return (
    <div style={{ padding: "60px" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 48,
        }}
      >
        <div>
          {data.logo && (
            <img
              src={data.logo}
              alt="Logo"
              style={{ height: 40, objectFit: "contain", marginBottom: 6 }}
            />
          )}
          <div style={{ fontSize: 14, fontWeight: 700 }}>
            {data.businessName || "Your Business"}
          </div>
          {data.businessAddress && (
            <div
              style={{
                fontSize: 9,
                color: "#888",
                lineHeight: 1.6,
                marginTop: 4,
                whiteSpace: "pre-wrap",
              }}
            >
              {data.businessAddress}
            </div>
          )}
        </div>
        <div style={{ textAlign: "right" }}>
          <div
            style={{
              fontSize: 28,
              color: accent,
              letterSpacing: 3,
              textTransform: "uppercase",
            }}
          >
            Invoice
          </div>
          <div style={{ fontSize: 9, color: "#888", marginTop: 6 }}>
            {data.invoiceNumber}
          </div>
        </div>
      </div>

      {/* Parties + Meta */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 36,
        }}
      >
        <div style={{ width: "45%" }}>
          <div
            style={{
              fontSize: 8,
              color: "#888",
              textTransform: "uppercase",
              letterSpacing: 1.5,
              marginBottom: 6,
            }}
          >
            Bill To
          </div>
          <div style={{ fontWeight: 700, fontSize: 11 }}>
            {data.clientName || "—"}
          </div>
          <div
            style={{
              color: "#888",
              lineHeight: 1.6,
              fontSize: 9,
              whiteSpace: "pre-wrap",
            }}
          >
            {data.clientAddress}
          </div>
        </div>
        <div style={{ width: "45%", display: "flex", gap: 40 }}>
          <div>
            <div
              style={{
                fontSize: 8,
                color: "#888",
                textTransform: "uppercase",
                letterSpacing: 1,
                marginBottom: 3,
              }}
            >
              Date
            </div>
            <div style={{ fontWeight: 700, fontSize: 10 }}>{data.date}</div>
          </div>
          {data.dueDate && (
            <div>
              <div
                style={{
                  fontSize: 8,
                  color: "#888",
                  textTransform: "uppercase",
                  letterSpacing: 1,
                  marginBottom: 3,
                }}
              >
                Due
              </div>
              <div style={{ fontWeight: 700, fontSize: 10 }}>
                {data.dueDate}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <table
        style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}
      >
        <thead>
          <tr style={{ borderBottom: "2px solid #1A1A1A" }}>
            <th
              style={{
                textAlign: "left",
                padding: "0 0 8px",
                fontSize: 8,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: 0.5,
              }}
            >
              Description
            </th>
            <th
              style={{
                textAlign: "center",
                padding: "0 0 8px",
                fontSize: 8,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: 0.5,
              }}
            >
              Qty
            </th>
            <th
              style={{
                textAlign: "right",
                padding: "0 0 8px",
                fontSize: 8,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: 0.5,
              }}
            >
              Rate
            </th>
            <th
              style={{
                textAlign: "right",
                padding: "0 0 8px",
                fontSize: 8,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: 0.5,
              }}
            >
              Amount
            </th>
          </tr>
        </thead>
        <tbody>
          {data.lineItems.map((item) => (
            <tr key={item.id} style={{ borderBottom: "1px solid #E5E5E5" }}>
              <td style={{ padding: "10px 0" }}>{item.description || "—"}</td>
              <td style={{ padding: "10px 0", textAlign: "center" }}>
                {item.quantity}
              </td>
              <td style={{ padding: "10px 0", textAlign: "right" }}>
                {c}
                {item.rate.toFixed(2)}
              </td>
              <td
                style={{
                  padding: "10px 0",
                  textAlign: "right",
                  fontWeight: 700,
                }}
              >
                {c}
                {(item.quantity * item.rate).toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <TotalsBlock
        data={data}
        calcs={calcs}
        accent={accent}
        grandTotalStyle={{
          display: "flex",
          justifyContent: "space-between",
          paddingTop: 8,
          marginTop: 6,
          borderTop: `2px solid ${accent}`,
          fontWeight: 700,
          fontSize: 12,
          color: accent,
        }}
      />

      {data.notes && (
        <div style={{ marginTop: 36 }}>
          <div
            style={{
              fontSize: 8,
              color: "#888",
              textTransform: "uppercase",
              letterSpacing: 1,
              marginBottom: 6,
            }}
          >
            Notes
          </div>
          <div
            style={{
              color: "#888",
              lineHeight: 1.6,
              fontSize: 9,
              whiteSpace: "pre-wrap",
            }}
          >
            {data.notes}
          </div>
        </div>
      )}

      <Footer name={data.businessName} />
    </div>
  );
}

/* ═══════════════════════════════════════════
   Classic template
   ═══════════════════════════════════════════ */
function PrintClassic({
  data,
  accent,
  calcs,
}: {
  data: InvoiceData;
  accent: string;
  calcs: CalcResult;
}) {
  const c = data.currency;
  return (
    <>
      {/* Header band */}
      <div
        style={{
          backgroundColor: accent,
          padding: "28px 48px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          color: "#fff",
        }}
      >
        <div>
          {data.logo ? (
            <img
              src={data.logo}
              alt="Logo"
              style={{ height: 45, objectFit: "contain" }}
            />
          ) : (
            <div
              style={{
                fontSize: 20,
                fontWeight: 700,
                fontFamily: "'Times New Roman', Times, serif",
              }}
            >
              {data.businessName || "Your Business"}
            </div>
          )}
          {data.businessAddress && (
            <div
              style={{
                fontSize: 9,
                opacity: 0.85,
                lineHeight: 1.5,
                marginTop: 2,
                whiteSpace: "pre-wrap",
              }}
            >
              {data.businessAddress}
            </div>
          )}
        </div>
        <div style={{ textAlign: "right" }}>
          <div
            style={{
              fontSize: 30,
              fontWeight: 700,
              fontFamily: "'Times New Roman', Times, serif",
              letterSpacing: 2,
              textTransform: "uppercase",
            }}
          >
            Invoice
          </div>
          <div style={{ fontSize: 11, opacity: 0.85, marginTop: 4 }}>
            # {data.invoiceNumber}
          </div>
        </div>
      </div>

      <div
        style={{
          padding: "28px 48px",
          fontFamily: "'Times New Roman', Times, serif",
        }}
      >
        {/* Meta */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 24,
            paddingBottom: 16,
            borderBottom: "1px solid #CCC",
            textAlign: "center",
          }}
        >
          <div>
            <div
              style={{
                fontSize: 8,
                fontWeight: 700,
                color: "#555",
                textTransform: "uppercase",
                letterSpacing: 1,
                marginBottom: 3,
              }}
            >
              Invoice No.
            </div>
            <div style={{ fontWeight: 700, fontSize: 11 }}>
              {data.invoiceNumber}
            </div>
          </div>
          <div>
            <div
              style={{
                fontSize: 8,
                fontWeight: 700,
                color: "#555",
                textTransform: "uppercase",
                letterSpacing: 1,
                marginBottom: 3,
              }}
            >
              Issue Date
            </div>
            <div style={{ fontWeight: 700, fontSize: 11 }}>{data.date}</div>
          </div>
          {data.dueDate && (
            <div>
              <div
                style={{
                  fontSize: 8,
                  fontWeight: 700,
                  color: "#555",
                  textTransform: "uppercase",
                  letterSpacing: 1,
                  marginBottom: 3,
                }}
              >
                Due Date
              </div>
              <div style={{ fontWeight: 700, fontSize: 11 }}>
                {data.dueDate}
              </div>
            </div>
          )}
        </div>

        {/* Parties */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 24,
          }}
        >
          <div style={{ width: "48%" }}>
            <div
              style={{
                fontSize: 8,
                fontWeight: 700,
                color: accent,
                textTransform: "uppercase",
                letterSpacing: 1.5,
                marginBottom: 6,
                paddingBottom: 4,
                borderBottom: `1px solid ${accent}`,
              }}
            >
              From
            </div>
            <div style={{ fontWeight: 700, fontSize: 12, marginTop: 6 }}>
              {data.businessName || "—"}
            </div>
            <div
              style={{
                color: "#555",
                lineHeight: 1.6,
                fontSize: 10,
                whiteSpace: "pre-wrap",
              }}
            >
              {data.businessAddress}
            </div>
          </div>
          <div style={{ width: "48%" }}>
            <div
              style={{
                fontSize: 8,
                fontWeight: 700,
                color: accent,
                textTransform: "uppercase",
                letterSpacing: 1.5,
                marginBottom: 6,
                paddingBottom: 4,
                borderBottom: `1px solid ${accent}`,
              }}
            >
              Bill To
            </div>
            <div style={{ fontWeight: 700, fontSize: 12, marginTop: 6 }}>
              {data.clientName || "—"}
            </div>
            <div
              style={{
                color: "#555",
                lineHeight: 1.6,
                fontSize: 10,
                whiteSpace: "pre-wrap",
              }}
            >
              {data.clientAddress}
            </div>
          </div>
        </div>

        {/* Table */}
        <table
          style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}
        >
          <thead>
            <tr style={{ backgroundColor: accent, color: "#fff" }}>
              <th
                style={{
                  textAlign: "left",
                  padding: "8px 10px",
                  fontSize: 9,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                }}
              >
                Description
              </th>
              <th
                style={{
                  textAlign: "center",
                  padding: "8px 10px",
                  fontSize: 9,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                }}
              >
                Qty
              </th>
              <th
                style={{
                  textAlign: "right",
                  padding: "8px 10px",
                  fontSize: 9,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                }}
              >
                Rate
              </th>
              <th
                style={{
                  textAlign: "right",
                  padding: "8px 10px",
                  fontSize: 9,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                }}
              >
                Amount
              </th>
            </tr>
          </thead>
          <tbody>
            {data.lineItems.map((item, idx) => (
              <tr
                key={item.id}
                style={{
                  backgroundColor:
                    idx % 2 === 1 ? `${accent}10` : "transparent",
                  borderBottom: "1px solid #CCC",
                }}
              >
                <td style={{ padding: "9px 10px" }}>
                  {item.description || "—"}
                </td>
                <td style={{ padding: "9px 10px", textAlign: "center" }}>
                  {item.quantity}
                </td>
                <td style={{ padding: "9px 10px", textAlign: "right" }}>
                  {c}
                  {item.rate.toFixed(2)}
                </td>
                <td
                  style={{
                    padding: "9px 10px",
                    textAlign: "right",
                    fontWeight: 700,
                  }}
                >
                  {c}
                  {(item.quantity * item.rate).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <TotalsBlock data={data} calcs={calcs} accent={accent} />

        {data.notes && (
          <div
            style={{
              marginTop: 32,
              paddingTop: 12,
              borderTop: "1px solid #CCC",
            }}
          >
            <div
              style={{
                fontSize: 9,
                fontWeight: 700,
                color: accent,
                textTransform: "uppercase",
                letterSpacing: 1,
                marginBottom: 6,
              }}
            >
              Notes / Terms
            </div>
            <div
              style={{
                color: "#555",
                lineHeight: 1.6,
                fontSize: 10,
                whiteSpace: "pre-wrap",
              }}
            >
              {data.notes}
            </div>
          </div>
        )}

        <Footer name={data.businessName} />
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════
   Main PrintView — delegates to template
   ═══════════════════════════════════════════ */
function PrintView({ data, settings }: PrintViewProps) {
  const accent = settings.accentColor;
  const calcs = useCalcs(data);

  return (
    <div className="print-view">
      {settings.template === "minimal" ? (
        <PrintMinimal data={data} accent={accent} calcs={calcs} />
      ) : settings.template === "classic" ? (
        <PrintClassic data={data} accent={accent} calcs={calcs} />
      ) : (
        <PrintModern data={data} accent={accent} calcs={calcs} />
      )}
    </div>
  );
}

export default PrintView;
