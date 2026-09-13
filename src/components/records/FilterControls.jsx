import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import BottomSheet from "../common/BottomSheet";
import Select from "../common/Select";
import Input from "../common/Input";
import Button from "../common/Button";
import IconButton from "../common/IconButton";

const typeTabs = [
  { value: "all", label: "All" },
  { value: "income", label: "Income" },
  { value: "expense", label: "Expense" },
  { value: "transfer", label: "Transfer" },
];

// Filter All/Income/Expense/Transfer inline, Account/Category/Date via bottom sheet
// (blueprint 6.2 + 5.3 "Filter mobile menggunakan bottom sheet").
export default function FilterControls({
  typeFilter,
  onTypeChange,
  accounts,
  categories,
  accountFilter,
  categoryFilter,
  dateFrom,
  dateTo,
  onApplyAdvanced,
}) {
  const [open, setOpen] = useState(false);
  const [draftAccount, setDraftAccount] = useState(accountFilter || "");
  const [draftCategory, setDraftCategory] = useState(categoryFilter || "");
  const [draftFrom, setDraftFrom] = useState(dateFrom || "");
  const [draftTo, setDraftTo] = useState(dateTo || "");

  function openSheet() {
    setDraftAccount(accountFilter || "");
    setDraftCategory(categoryFilter || "");
    setDraftFrom(dateFrom || "");
    setDraftTo(dateTo || "");
    setOpen(true);
  }

  function apply() {
    onApplyAdvanced({
      accountFilter: draftAccount,
      categoryFilter: draftCategory,
      dateFrom: draftFrom,
      dateTo: draftTo,
    });
    setOpen(false);
  }

  function reset() {
    setDraftAccount("");
    setDraftCategory("");
    setDraftFrom("");
    setDraftTo("");
    onApplyAdvanced({ accountFilter: "", categoryFilter: "", dateFrom: "", dateTo: "" });
    setOpen(false);
  }

  const activeAdvancedCount = [accountFilter, categoryFilter, dateFrom, dateTo].filter(Boolean).length;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
      <div style={{ display: "flex", gap: 6, overflowX: "auto", flex: 1 }}>
        {typeTabs.map((tab) => {
          const active = typeFilter === tab.value;
          return (
            <button
              key={tab.value}
              type="button"
              onClick={() => onTypeChange(tab.value)}
              style={{
                padding: "8px 16px",
                borderRadius: "var(--radius-pill)",
                border: "1px solid var(--color-border)",
                background: active ? "var(--color-primary)" : "var(--color-surface)",
                color: active ? "#fff" : "var(--color-text-secondary)",
                fontWeight: 600,
                fontSize: 13,
                whiteSpace: "nowrap",
                cursor: "pointer",
                flexShrink: 0,
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
      <div style={{ position: "relative" }}>
        <IconButton icon={SlidersHorizontal} onClick={openSheet} />
        {activeAdvancedCount > 0 && (
          <span
            style={{
              position: "absolute",
              top: -2,
              right: -2,
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "var(--color-primary)",
            }}
          />
        )}
      </div>

      <BottomSheet open={open} onClose={() => setOpen(false)} title="Filter Transaksi">
        <Select
          label="Account"
          placeholder="Semua account"
          value={draftAccount}
          onChange={(e) => setDraftAccount(e.target.value)}
          options={accounts.map((a) => ({ value: String(a.id), label: a.name }))}
        />
        <Select
          label="Category"
          placeholder="Semua kategori"
          value={draftCategory}
          onChange={(e) => setDraftCategory(e.target.value)}
          options={categories.map((c) => ({ value: String(c.id), label: c.name }))}
        />
        <div style={{ display: "flex", gap: 10 }}>
          <Input label="Dari tanggal" type="date" value={draftFrom} onChange={(e) => setDraftFrom(e.target.value)} />
          <Input label="Sampai tanggal" type="date" value={draftTo} onChange={(e) => setDraftTo(e.target.value)} />
        </div>
        <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
          <Button variant="ghost" block onClick={reset} type="button">
            Reset
          </Button>
          <Button block onClick={apply} type="button">
            Terapkan
          </Button>
        </div>
      </BottomSheet>
    </div>
  );
}
