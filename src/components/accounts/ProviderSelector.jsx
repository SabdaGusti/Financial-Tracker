import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import ProviderLogo from "./ProviderLogo";

// Provider is chosen from master data as an option, never free text (rule 14).
export default function ProviderSelector({ providers, value, onChange }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = q
      ? providers.filter(
          (p) => p.name.toLowerCase().includes(q) || p.shortName.toLowerCase().includes(q)
        )
      : providers;
    return [...list].sort((a, b) => Number(b.isPopular) - Number(a.isPopular));
  }, [providers, query]);

  return (
    <div>
      <div className="search-input" style={{ marginBottom: 14 }}>
        <Search size={16} />
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Cari provider" />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
        {filtered.map((provider) => {
          const isSelected = value === provider.id;
          return (
            <button
              key={provider.id}
              type="button"
              onClick={() => onChange(provider.id)}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 8,
                padding: "14px 8px",
                borderRadius: "var(--radius-md)",
                border: isSelected ? "1.5px solid var(--color-primary)" : "1px solid var(--color-border)",
                background: isSelected ? "var(--color-primary-soft)" : "var(--color-surface)",
                cursor: "pointer",
              }}
            >
              <ProviderLogo provider={provider} type={provider.type} size={38} radius="var(--radius-pill)" />
              <span style={{ fontSize: 12, fontWeight: 600, textAlign: "center", lineHeight: 1.2 }}>
                {provider.shortName}
              </span>
            </button>
          );
        })}
      </div>
      {filtered.length === 0 && (
        <p style={{ fontSize: 13.5, color: "var(--color-text-secondary)", textAlign: "center", padding: 24 }}>
          Provider tidak ditemukan.
        </p>
      )}
    </div>
  );
}
