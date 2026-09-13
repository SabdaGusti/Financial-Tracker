import MaskedAmount from "../common/MaskedAmount";
import BalanceVisibilityToggle from "../common/BalanceVisibilityToggle";

export default function BalanceCard({ totalBalance }) {
  return (
    <div
      className="card"
      style={{
        padding: 24,
        background: "linear-gradient(135deg, var(--color-primary) 0%, #6D28D9 100%)",
        color: "#fff",
        border: "none",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
        <span style={{ fontSize: 13, opacity: 0.85, fontWeight: 600 }}>Total Balance</span>
        <BalanceVisibilityToggle light />
      </div>
      <MaskedAmount value={totalBalance} style={{ fontSize: 32, fontWeight: 800, letterSpacing: -0.5 }} />
    </div>
  );
}
