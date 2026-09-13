import { NavLink } from "react-router-dom";
import { Home, ListOrdered, Wallet, Wallet2 } from "lucide-react";

const navItems = [
  { to: "/", label: "Home", icon: Home, end: true },
  { to: "/records", label: "Records", icon: ListOrdered },
  { to: "/accounts", label: "Accounts", icon: Wallet },
];

export default function Sidebar() {
  return (
    <aside className="sidebar desktop-only">
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "0 12px", marginBottom: 32 }}>
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: "var(--radius-md)",
            background: "var(--color-primary)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
          }}
        >
          <Wallet2 size={18} />
        </div>
        <span style={{ fontWeight: 700, fontSize: 16 }}>Financial Tracker</span>
      </div>

      <nav style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            style={({ isActive }) => ({
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "11px 12px",
              borderRadius: "var(--radius-md)",
              fontWeight: 600,
              fontSize: 14.5,
              color: isActive ? "var(--color-primary)" : "var(--color-text-secondary)",
              background: isActive ? "var(--color-primary-soft)" : "transparent",
            })}
          >
            <item.icon size={19} />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
