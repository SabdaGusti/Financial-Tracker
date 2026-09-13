import { useNavigate } from "react-router-dom";
import TransactionList from "../records/TransactionList";

export default function RecentTransactions({ records, accountsById, categoriesById, loading }) {
  const navigate = useNavigate();
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <div className="section-title" style={{ marginBottom: 0 }}>
          Recent Transactions
        </div>
        <button type="button" className="link-action" onClick={() => navigate("/records")}>
          Lihat semua
        </button>
      </div>
      <TransactionList
        records={records}
        accountsById={accountsById}
        categoriesById={categoriesById}
        loading={loading}
        onSelect={(record) => navigate(`/records/${record.id}`)}
        emptyTitle="Belum ada transaksi"
        emptyDescription="Tambahkan transaksi pertamamu untuk mulai melacak keuangan."
      />
    </div>
  );
}
