import { Search } from "lucide-react";

export default function SearchInput({ value, onChange, placeholder = "Cari transaksi" }) {
  return (
    <div className="search-input">
      <Search size={16} />
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
    </div>
  );
}
