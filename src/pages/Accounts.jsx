import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Wallet } from "lucide-react";
import PageHeader from "../components/layout/PageHeader";
import AccountCard from "../components/accounts/AccountCard";
import EmptyState from "../components/common/EmptyState";
import Skeleton from "../components/common/Skeleton";
import MaskedAmount from "../components/common/MaskedAmount";
import { useAccounts } from "../hooks/useAccounts";
import { useAccountProviders } from "../hooks/useAccountProviders";
import { useAppContext } from "../context/AppContext";
import { getTotalBalance } from "../services/balanceService";

const groupOrder = ["bank", "ewallet", "cash"];
const groupLabels = { bank: "Bank", ewallet: "E-Wallet", cash: "Cash" };

// Financial Accounts page (blueprint 6.4): Total Balance, accounts grouped
// by type/provider, Add Account.
export default function Accounts() {
  const navigate = useNavigate();
  const { dataVersion } = useAppContext();
  const { accounts, balances, loading } = useAccounts();
  const { providersById } = useAccountProviders();
  const [totalBalance, setTotalBalance] = useState(0);

  useEffect(() => {
    getTotalBalance().then(setTotalBalance);
  }, [dataVersion]);

  const grouped = useMemo(() => {
    const groups = { bank: [], ewallet: [], cash: [] };
    accounts.forEach((account) => {
      if (!groups[account.type]) groups[account.type] = [];
      groups[account.type].push(account);
    });
    return groups;
  }, [accounts]);

  function providerLabel(account) {
    if (account.type === "cash") return "Cash";
    const provider = providersById[account.providerId];
    return provider?.name || "-";
  }

  return (
    <div>
      <PageHeader
        title="Accounts"
        onBack={false}
        action={
          <button type="button" className="btn btn-primary btn-sm" onClick={() => navigate("/accounts/add")}>
            <Plus size={15} /> Add Account
          </button>
        }
      />

      <div className="card" style={{ padding: 20, marginBottom: 24 }}>
        <div style={{ fontSize: 13, color: "var(--color-text-secondary)", fontWeight: 600, marginBottom: 6 }}>
          Total Balance
        </div>
        <MaskedAmount value={totalBalance} style={{ fontSize: 26, fontWeight: 800 }} />
      </div>

      {loading ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} height={72} />
          ))}
        </div>
      ) : accounts.length === 0 ? (
        <EmptyState
          icon={Wallet}
          title="Belum ada account"
          description="Tambahkan bank, e-wallet, atau cash untuk mulai mencatat transaksi."
          action={
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => navigate("/accounts/add")}
              style={{ marginTop: 8 }}
            >
              <Plus size={16} /> Tambah Account
            </button>
          }
        />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {groupOrder.map((type) =>
            grouped[type] && grouped[type].length > 0 ? (
              <div key={type}>
                <div className="section-title">{groupLabels[type]}</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {grouped[type].map((account) => (
                    <AccountCard
                      key={account.id}
                      account={account}
                      balance={balances[account.id] ?? 0}
                      provider={providersById[account.providerId]}
                      providerName={providerLabel(account)}
                      onClick={() => navigate(`/accounts/${account.id}`)}
                    />
                  ))}
                </div>
              </div>
            ) : null
          )}
        </div>
      )}
    </div>
  );
}
