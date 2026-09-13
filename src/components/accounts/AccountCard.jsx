import { Archive } from "lucide-react";
import Badge from "../common/Badge";
import ProviderLogo from "./ProviderLogo";
import MaskedAmount from "../common/MaskedAmount";

export default function AccountCard({ account, balance, provider, providerName, onClick }) {
  const isArchived = account.status === "archived";

  return (
    <button
      type="button"
      onClick={onClick}
      className="card"
      style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        padding: 16,
        width: "100%",
        textAlign: "left",
        cursor: "pointer",
        opacity: isArchived ? 0.65 : 1,
      }}
    >
      <ProviderLogo provider={provider} type={account.type} size={44} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 700, fontSize: 14.5, display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {account.name}
          </span>
          {isArchived && (
            <Badge variant="archived">
              <Archive size={11} /> Arsip
            </Badge>
          )}
        </div>
        <div style={{ fontSize: 12.5, color: "var(--color-text-secondary)" }}>{providerName}</div>
      </div>
      <MaskedAmount value={balance} style={{ fontWeight: 700, fontSize: 15, flexShrink: 0 }} />
    </button>
  );
}
