import { useState } from "react";
import BottomSheet from "../common/BottomSheet";
import { getCategoryIcon } from "../../utils/icons";

export default function CategorySelector({ label = "Category", categories, value, onChange, error }) {
  const [open, setOpen] = useState(false);
  const selected = categories.find((c) => c.id === value);
  const SelectedIcon = selected ? getCategoryIcon(selected.icon) : null;

  return (
    <div className="field">
      <label className="field-label">{label}</label>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`field-select ${error ? "has-error" : ""}`}
        style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}
      >
        {selected ? (
          <>
            <SelectedIcon size={16} color="var(--color-primary)" />
            <span>{selected.name}</span>
          </>
        ) : (
          <span style={{ color: "var(--color-text-muted)" }}>Pilih kategori</span>
        )}
      </button>
      {error && <span className="field-error">{error}</span>}

      <BottomSheet open={open} onClose={() => setOpen(false)} title="Pilih Kategori">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
          {categories.map((cat) => {
            const Icon = getCategoryIcon(cat.icon);
            const isSelected = value === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  onChange(cat.id);
                  setOpen(false);
                }}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 8,
                  padding: "14px 6px",
                  borderRadius: "var(--radius-md)",
                  border: isSelected ? "1.5px solid var(--color-primary)" : "1px solid var(--color-border)",
                  background: isSelected ? "var(--color-primary-soft)" : "var(--color-surface)",
                  cursor: "pointer",
                }}
              >
                <Icon size={18} color="var(--color-primary)" />
                <span style={{ fontSize: 11.5, fontWeight: 600, textAlign: "center", lineHeight: 1.2 }}>
                  {cat.name}
                </span>
              </button>
            );
          })}
        </div>
        {categories.length === 0 && (
          <p style={{ fontSize: 13.5, color: "var(--color-text-secondary)", textAlign: "center", padding: 20 }}>
            Belum ada kategori untuk tipe ini.
          </p>
        )}
      </BottomSheet>
    </div>
  );
}
