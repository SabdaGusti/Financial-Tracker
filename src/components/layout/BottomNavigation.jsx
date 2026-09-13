import { NavLink } from "react-router-dom";
import { Home, ListOrdered, Wallet } from "lucide-react";

const navItems = [
  { to: "/", label: "Home", icon: Home, end: true },
  { to: "/records", label: "Records", icon: ListOrdered },
  { to: "/accounts", label: "Accounts", icon: Wallet },
];

export default function BottomNavigation() {
  return (
    <nav className="bottom-nav mobile-only">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          style={({ isActive }) => ({
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 3,
            fontSize: 11,
            fontWeight: 600,
            color: isActive ? "var(--color-primary)" : "var(--color-text-muted)",
            flex: 1,
          })}
        >
          <item.icon size={21} />
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
}
