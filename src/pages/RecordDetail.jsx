import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Pencil, Trash2 } from "lucide-react";
import PageHeader from "../components/layout/PageHeader";
import Badge from "../components/common/Badge";
import ConfirmDialog from "../components/common/ConfirmDialog";
import Skeleton from "../components/common/Skeleton";
import IconButton from "../components/common/IconButton";
import { getRecord, deleteRecord } from "../services/recordService";
import { getAccount } from "../services/accountService";
import { getCategory } from "../services/categoryService";
import { useAppContext } from "../context/AppContext";
import { formatCurrency } from "../utils/currency";
import { formatDate, formatDateTime } from "../utils/date";

const typeLabel = { income: "Income", expense: "Expense", transfer: "Transfer", adjustment: "Adjustment" };
const typeBadgeVariant = { income: "income", expense: "expense", transfer: "transfer", adjustment: "adjustment" };

export default function RecordDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { notifyDataChange, showToast } = useAppContext();
  const [record, setRecord] = useState(null);
  const [account, setAccount] = useState(null);
  const [destination, setDestination] = useState(null);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const data = await getRecord(Number(id));
      if (!data) {
        setRecord(null);
        setLoading(false);
        return;
      }
      const [acc, dest, cat] = await Promise.all([
        data.accountId ? getAccount(data.accountId) : null,
        data.destinationAccountId ? getAccount(data.destinationAccountId) : null,
        data.categoryId ? getCategory(data.categoryId) : null,
      ]);
      setRecord(data);
      setAccount(acc);
      setDestination(dest);
      setCategory(cat);
      setLoading(false);
    }
    load();
  }, [id]);

  async function handleDelete() {
    try {
      await deleteRecord(Number(id));
      notifyDataChange();
      showToast("Transaksi berhasil dihapus.", "success");
      navigate("/records");
    } catch (err) {
      showToast(err.message || "Gagal menghapus transaksi.", "error");
    } finally {
      setConfirmOpen(false);
    }
  }

  if (loading) {
    return (
      <div>
        <PageHeader title="Detail Transaksi" onBack={true} />
        <Skeleton height={140} />
      </div>
    );
  }

  if (!record) {
    return (
      <div>
        <PageHeader title="Detail Transaksi" onBack={true} />
        <p style={{ color: "var(--color-text-secondary)" }}>Transaksi tidak ditemukan.</p>
      </div>
    );
  }

  const isTransfer = record.type === "transfer";
  const isEditable = record.type !== "adjustment";

  return (
    <div>
      <PageHeader
        title="Detail Transaksi"
        onBack={true}
        action={
          isEditable ? (
            <IconButton icon={Pencil} onClick={() => navigate(`/records/${id}/edit`)} />
          ) : null
        }
      />

      <div className="card" style={{ padding: 24, textAlign: "center", marginBottom: 20 }}>
        <Badge variant={typeBadgeVariant[record.type]}>{typeLabel[record.type]}</Badge>
        <div style={{ fontSize: 30, fontWeight: 800, margin: "12px 0 4px" }}>{formatCurrency(record.amount)}</div>
        <div style={{ fontSize: 13, color: "var(--color-text-secondary)" }}>{record.description || "-"}</div>
      </div>

      <div className="card" style={{ padding: 18, display: "flex", flexDirection: "column", gap: 14, marginBottom: 20 }}>
        {isTransfer ? (
          <>
            <DetailRow label="From" value={account?.name || "-"} />
            <DetailRow label="To" value={destination?.name || "-"} />
          </>
        ) : (
          <>
            <DetailRow label="Account" value={account?.name || "-"} />
            {category && <DetailRow label="Category" value={category.name} />}
          </>
        )}
        <DetailRow label="Date" value={formatDate(record.date, { day: "2-digit", month: "long", year: "numeric" })} />
        {record.note && <DetailRow label="Note" value={record.note} />}
        <DetailRow label="Dicatat" value={formatDateTime(record.createdAt)} />
      </div>

      <button type="button" className="btn btn-danger" style={{ width: "100%" }} onClick={() => setConfirmOpen(true)}>
        <Trash2 size={16} /> Hapus Transaksi
      </button>

      <ConfirmDialog
        open={confirmOpen}
        title="Hapus transaksi ini?"
        description="Saldo account akan dihitung ulang setelah transaksi ini dihapus. Tindakan ini tidak bisa dibatalkan."
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
}

function DetailRow({ label, value }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
      <span style={{ fontSize: 13, color: "var(--color-text-secondary)" }}>{label}</span>
      <span style={{ fontSize: 13.5, fontWeight: 600, textAlign: "right" }}>{value}</span>
    </div>
  );
}
