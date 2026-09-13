import { useState } from "react";
import { ChevronDown } from "lucide-react";
import BottomSheet from "../common/BottomSheet";
import ProviderLogo from "./ProviderLogo";
import MaskedAmount from "../common/MaskedAmount";

// Account selector shows name + balance and opens a bottom sheet to choose
// (blueprint 6.3 "Account selector menampilkan nama account dan saldo",
// 5.3 "Selector account/provider dapat menggunakan bottom sheet di mobile").
export default function AccountSelector({
  label,
  accounts,
  balances,
  providersById = {},
  value,
  onChange,
  placeholder = "Pilih account",
  error,
}) {
  const [open, setOpen] = useState(false);
  const selected = accounts.find((a) => a.id === value);

  return (
    <div className="field">
      {label && <label className="field-label">{label}</label>}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`field-select ${error ? "has-error" : ""}`}
        style={{ display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }}
      >
        {selected ? (
          <span style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
            <span style={{ fontWeight: 600 }}>{selected.name}</span>
            <MaskedAmount value={balances[selected.id] ?? 0} style={{ fontSize: 12, color: "var(--color-text-secondary)" }} />
          </span>
        ) : (
          <span style={{ color: "var(--color-text-muted)" }}>{placeholder}</span>
        )}
        <ChevronDown size={16} color="var(--color-text-muted)" />
      </button>
      {error && <span className="field-error">{error}</span>}

      <BottomSheet open={open} onClose={() => setOpen(false)} title={label || "Pilih Account"}>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {accounts.length === 0 && (
            <p style={{ fontSize: 13.5, color: "var(--color-text-secondary)" }}>
              Belum ada account aktif. Tambahkan account terlebih dahulu.
            </p>
          )}
          {accounts.map((account) => {
            const isSelected = value === account.id;
            return (
              <button
                key={account.id}
                type="button"
                onClick={() => {
                  onChange(account.id);
                  setOpen(false);
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: 12,
                  borderRadius: "var(--radius-md)",
                  border: isSelected ? "1.5px solid var(--color-primary)" : "1px solid var(--color-border)",
                  background: isSelected ? "var(--color-primary-soft)" : "var(--color-surface)",
                  cursor: "pointer",
                  textAlign: "left",
                }}
              >
                <ProviderLogo provider={providersById[account.providerId]} type={account.type} size={36} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{account.name}</div>
                  <MaskedAmount value={balances[account.id] ?? 0} style={{ fontSize: 12, color: "var(--color-text-secondary)" }} />
                </div>
              </button>
            );
          })}
        </div>
      </BottomSheet>
    </div>
  );
}
