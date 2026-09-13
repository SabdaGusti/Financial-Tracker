import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/layout/PageHeader";
import SearchInput from "../components/common/SearchInput";
import FilterControls from "../components/records/FilterControls";
import TransactionList from "../components/records/TransactionList";
import { useAccounts } from "../hooks/useAccounts";
import { useRecords } from "../hooks/useRecords";
import { useCategories } from "../hooks/useCategories";

// Financial Records page (blueprint 6.2): header, search, type filter,
// account/category/date filter, transaction list, floating Add Record action.
export default function Records() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [accountFilter, setAccountFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const { accounts } = useAccounts();
  const { categories } = useCategories();
  const { records, loading } = useRecords({
    type: typeFilter,
    accountId: accountFilter ? Number(accountFilter) : undefined,
    from: dateFrom || undefined,
    to: dateTo || undefined,
  });

  const accountsById = useMemo(() => Object.fromEntries(accounts.map((a) => [a.id, a])), [accounts]);
  const categoriesById = useMemo(() => Object.fromEntries(categories.map((c) => [c.id, c])), [categories]);

  const filteredRecords = useMemo(() => {
    let list = records;
    if (categoryFilter) {
      list = list.filter((r) => String(r.categoryId) === categoryFilter);
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter((r) => {
        const account = accountsById[r.accountId];
        const category = categoriesById[r.categoryId];
        return (
          (r.description || "").toLowerCase().includes(q) ||
          (r.note || "").toLowerCase().includes(q) ||
          (account?.name || "").toLowerCase().includes(q) ||
          (category?.name || "").toLowerCase().includes(q)
        );
      });
    }
    return list;
  }, [records, categoryFilter, search, accountsById, categoriesById]);

  return (
    <div>
      <PageHeader
        title="Records"
        onBack={false}
        action={
          <button type="button" className="btn btn-primary btn-sm desktop-only" onClick={() => navigate("/records/add")}>
            <Plus size={15} /> Add Record
          </button>
        }
      />

      <div style={{ marginBottom: 14 }}>
        <SearchInput value={search} onChange={setSearch} placeholder="Cari transaksi" />
      </div>

      <FilterControls
        typeFilter={typeFilter}
        onTypeChange={setTypeFilter}
        accounts={accounts}
        categories={categories}
        accountFilter={accountFilter}
        categoryFilter={categoryFilter}
        dateFrom={dateFrom}
        dateTo={dateTo}
        onApplyAdvanced={({ accountFilter: af, categoryFilter: cf, dateFrom: df, dateTo: dt }) => {
          setAccountFilter(af);
          setCategoryFilter(cf);
          setDateFrom(df);
          setDateTo(dt);
        }}
      />

      <TransactionList
        records={filteredRecords}
        accountsById={accountsById}
        categoriesById={categoriesById}
        loading={loading}
        onSelect={(record) => navigate(`/records/${record.id}`)}
        emptyTitle="Tidak ada transaksi"
        emptyDescription="Coba ubah kata kunci pencarian atau filter."
      />

      <button
        type="button"
        className="mobile-only"
        onClick={() => navigate("/records/add")}
        aria-label="Add Record"
        style={{
          position: "fixed",
          right: 20,
          bottom: "calc(var(--bottomnav-height) + 20px)",
          width: 56,
          height: 56,
          borderRadius: "50%",
          background: "var(--color-primary)",
          color: "#fff",
          border: "none",
          boxShadow: "var(--shadow-lg)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          zIndex: 400,
        }}
      >
        <Plus size={24} />
      </button>
    </div>
  );
}
