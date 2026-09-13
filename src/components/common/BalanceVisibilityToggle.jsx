import { Eye, EyeOff } from "lucide-react";
import { useAppContext } from "../../context/AppContext";

export default function BalanceVisibilityToggle({ light = false }) {
  const { showBalance, toggleShowBalance } = useAppContext();

  return (
    <button
      type="button"
      onClick={toggleShowBalance}
      aria-label={showBalance ? "Sembunyikan saldo" : "Tampilkan saldo"}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: 32,
        height: 32,
        borderRadius: "var(--radius-pill)",
        border: "none",
        cursor: "pointer",
        background: light ? "rgba(255,255,255,0.18)" : "var(--color-bg)",
        color: light ? "#fff" : "var(--color-text-secondary)",
        flexShrink: 0,
      }}
    >
      {showBalance ? <Eye size={16} /> : <EyeOff size={16} />}
    </button>
  );
}
