import { TrendingUp, TrendingDown } from "lucide-react";
import { formatCurrency } from "../../utils/currency";

export default function IncomeExpenseSummary({ income, expense }) {
  return (
    <div className="grid-2">
      <div className="card" style={{ padding: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: "var(--radius-md)",
              background: "var(--color-income-soft)",
              color: "var(--color-income)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <TrendingUp size={16} />
          </div>
          <span style={{ fontSize: 12.5, color: "var(--color-text-secondary)", fontWeight: 600 }}>Income</span>
        </div>
        <div style={{ fontSize: 17, fontWeight: 700, color: "var(--color-income)" }}>{formatCurrency(income)}</div>
      </div>
      <div className="card" style={{ padding: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: "var(--radius-md)",
              background: "var(--color-expense-soft)",
              color: "var(--color-expense)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <TrendingDown size={16} />
          </div>
          <span style={{ fontSize: 12.5, color: "var(--color-text-secondary)", fontWeight: 600 }}>Expense</span>
        </div>
        <div style={{ fontSize: 17, fontWeight: 700, color: "var(--color-expense)" }}>{formatCurrency(expense)}</div>
      </div>
    </div>
  );
}
