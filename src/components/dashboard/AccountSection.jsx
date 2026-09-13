import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { useAccountProviders } from "../../hooks/useAccountProviders";
import ProviderLogo from "../accounts/ProviderLogo";
import MaskedAmount from "../common/MaskedAmount";

export default function AccountSection({ accounts, balances }) {
  const navigate = useNavigate();
  const { providersById } = useAccountProviders();
  const activeAccounts = accounts.filter((a) => a.status === "active");

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <div className="section-title" style={{ marginBottom: 0 }}>
          Accounts
        </div>
        <button type="button" className="link-action" onClick={() => navigate("/accounts")}>
          Lihat semua
        </button>
      </div>
      <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 4 }}>
        {activeAccounts.map((account) => (
          <button
            key={account.id}
            type="button"
            onClick={() => navigate(`/accounts/${account.id}`)}
            className="card"
            style={{ minWidth: 150, padding: 14, textAlign: "left", cursor: "pointer", flexShrink: 0 }}
          >
            <div style={{ marginBottom: 10 }}>
              <ProviderLogo provider={providersById[account.providerId]} type={account.type} size={32} />
            </div>
            <div
              style={{
                fontSize: 12.5,
                fontWeight: 600,
                color: "var(--color-text-secondary)",
                marginBottom: 2,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {account.name}
            </div>
            <MaskedAmount value={balances[account.id] ?? 0} style={{ fontSize: 15, fontWeight: 700 }} />
          </button>
        ))}
        <button
          type="button"
          onClick={() => navigate("/accounts/add")}
          className="card"
          style={{
            minWidth: 90,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
            cursor: "pointer",
            color: "var(--color-primary)",
            flexShrink: 0,
          }}
        >
          <Plus size={20} />
          <span style={{ fontSize: 12, fontWeight: 600 }}>Tambah</span>
        </button>
      </div>
    </div>
  );
}
