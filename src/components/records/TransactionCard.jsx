import { ArrowRightLeft, TrendingUp, TrendingDown, SlidersHorizontal } from "lucide-react";
import { formatCurrency, formatSignedCurrency } from "../../utils/currency";
import { formatDate } from "../../utils/date";

const typeMeta = {
  income: { icon: TrendingUp, color: "var(--color-income)", bg: "var(--color-income-soft)" },
  expense: { icon: TrendingDown, color: "var(--color-expense)", bg: "var(--color-expense-soft)" },
  transfer: { icon: ArrowRightLeft, color: "var(--color-transfer)", bg: "var(--color-transfer-soft)" },
  adjustment: { icon: SlidersHorizontal, color: "var(--color-adjustment)", bg: "var(--color-adjustment-soft)" },
};

// perspectiveAccountId lets the same card show the correct sign for a
// transfer when viewed from a specific account (Account Detail context).
function signedAmount(record, perspectiveAccountId) {
  if (record.type === "expense") return -record.amount;
  if (record.type === "income") return record.amount;
  if (record.type === "adjustment") {
    return record.adjustmentType === "decrease" ? -record.amount : record.amount;
  }
  if (record.type === "transfer" && perspectiveAccountId) {
    if (record.destinationAccountId === perspectiveAccountId) return record.amount;
    if (record.accountId === perspectiveAccountId) return -record.amount;
  }
  return record.amount;
}

export default function TransactionCard({
  record,
  accountName,
  destinationAccountName,
  categoryName,
  perspectiveAccountId,
  onClick,
}) {
  const meta = typeMeta[record.type] || typeMeta.expense;
  const Icon = meta.icon;
  const amount = signedAmount(record, perspectiveAccountId);

  let subtitle;
  if (record.type === "transfer") {
    subtitle = `${accountName} \u2192 ${destinationAccountName}`;
  } else {
    subtitle = [accountName, categoryName].filter(Boolean).join(" \u2022 ");
  }

  const title =
    record.description ||
    categoryName ||
    (record.type === "transfer" ? "Transfer" : record.type === "adjustment" ? "Penyesuaian Saldo" : "Transaksi");

  const amountColor =
    record.type === "transfer" && !perspectiveAccountId
      ? "var(--color-transfer)"
      : amount < 0
      ? "var(--color-expense)"
      : "var(--color-income)";

  const amountText =
    record.type === "transfer" && !perspectiveAccountId
      ? formatCurrency(record.amount)
      : formatSignedCurrency(amount);

  return (
    <button
      type="button"
      onClick={onClick}
      className="card"
      style={{ display: "flex", alignItems: "center", gap: 12, padding: 14, width: "100%", textAlign: "left", cursor: "pointer" }}
    >
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: "var(--radius-md)",
          background: meta.bg,
          color: meta.color,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Icon size={18} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 600, fontSize: 14, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {title}
        </div>
        <div
          style={{
            fontSize: 12,
            color: "var(--color-text-secondary)",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {subtitle}
        </div>
      </div>
      <div style={{ textAlign: "right", flexShrink: 0 }}>
        <div style={{ fontWeight: 700, fontSize: 14, color: amountColor }}>{amountText}</div>
        <div style={{ fontSize: 11, color: "var(--color-text-muted)" }}>{formatDate(record.date)}</div>
      </div>
    </button>
  );
}
