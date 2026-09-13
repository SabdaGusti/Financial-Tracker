const types = [
  { value: "expense", label: "Expense" },
  { value: "income", label: "Income" },
  { value: "transfer", label: "Transfer" },
];

export default function TransactionTypeSelector({ value, onChange }) {
  return (
    <div
      style={{
        display: "flex",
        gap: 6,
        background: "var(--color-bg)",
        padding: 4,
        borderRadius: "var(--radius-pill)",
        marginBottom: 20,
      }}
    >
      {types.map((t) => {
        const active = value === t.value;
        const activeColor =
          t.value === "expense"
            ? "var(--color-expense)"
            : t.value === "income"
            ? "var(--color-income)"
            : "var(--color-transfer)";
        return (
          <button
            key={t.value}
            type="button"
            onClick={() => onChange(t.value)}
            style={{
              flex: 1,
              padding: "9px 0",
              borderRadius: "var(--radius-pill)",
              border: "none",
              fontWeight: 700,
              fontSize: 13.5,
              cursor: "pointer",
              background: active ? "var(--color-surface)" : "transparent",
              color: active ? activeColor : "var(--color-text-secondary)",
              boxShadow: active ? "var(--shadow-sm)" : "none",
              transition: "all var(--transition-fast)",
            }}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}
