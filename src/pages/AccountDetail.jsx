import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { SlidersHorizontal } from "lucide-react";
import PageHeader from "../components/layout/PageHeader";
import AccountMenu from "../components/accounts/AccountMenu";
import AccountForm from "../components/accounts/AccountForm";
import ProviderLogo from "../components/accounts/ProviderLogo";
import Modal from "../components/common/Modal";
import ConfirmDialog from "../components/common/ConfirmDialog";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import TransactionList from "../components/records/TransactionList";
import Badge from "../components/common/Badge";
import Skeleton from "../components/common/Skeleton";
import { useAppContext } from "../context/AppContext";
import { useCategories } from "../hooks/useCategories";
import {
  getAccount,
  updateAccount,
  archiveAccount,
  unarchiveAccount,
  deleteAccount,
  getAccountProvider,
} from "../services/accountService";
import { getAccountBalance, getAccountStatistics } from "../services/balanceService";
import { getRecords, createAdjustment } from "../services/recordService";
import { formatCurrency, formatNumberInput, parseCurrencyInput } from "../utils/currency";
import MaskedAmount from "../components/common/MaskedAmount";

export default function AccountDetail() {
  const { id } = useParams();
  const accountId = Number(id);
  const navigate = useNavigate();
  const { dataVersion, notifyDataChange, showToast } = useAppContext();
  const { categories } = useCategories();

  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [balance, setBalance] = useState(0);
  const [stats, setStats] = useState({ income: 0, expense: 0 });
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editOpen, setEditOpen] = useState(false);
  const [adjustOpen, setAdjustOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const acc = await getAccount(accountId);
      if (!acc) {
        setAccount(null);
        setLoading(false);
        return;
      }
      const [prov, bal, stat, recs] = await Promise.all([
        acc.providerId ? getAccountProvider(acc.providerId) : null,
        getAccountBalance(accountId),
        getAccountStatistics(accountId),
        getRecords({ accountId }),
      ]);
      setAccount(acc);
      setProvider(prov);
      setBalance(bal);
      setStats(stat);
      setRecords(recs.slice(0, 10));
      setLoading(false);
    }
    load();
  }, [accountId, dataVersion]);

  const accountsById = useMemo(() => (account ? { [account.id]: account } : {}), [account]);
  const categoriesById = useMemo(() => Object.fromEntries(categories.map((c) => [c.id, c])), [categories]);

  async function handleArchive() {
    try {
      await archiveAccount(accountId);
      notifyDataChange();
      showToast("Account diarsipkan.", "success");
    } catch (err) {
      showToast(err.message || "Gagal mengarsipkan account.", "error");
    }
  }

  async function handleUnarchive() {
    try {
      await unarchiveAccount(accountId);
      notifyDataChange();
      showToast("Account diaktifkan kembali.", "success");
    } catch (err) {
      showToast(err.message || "Gagal mengaktifkan account.", "error");
    }
  }

  async function handleDelete() {
    try {
      await deleteAccount(accountId);
      notifyDataChange();
      showToast("Account berhasil dihapus.", "success");
      navigate("/accounts");
    } catch (err) {
      showToast(err.message || "Gagal menghapus account.", "error");
    } finally {
      setDeleteConfirmOpen(false);
    }
  }

  async function handleEditSubmit({ name, initialBalance }) {
    try {
      await updateAccount(accountId, { name, initialBalance });
      notifyDataChange();
      showToast("Account berhasil diperbarui.", "success");
      setEditOpen(false);
    } catch (err) {
      showToast(err.message || "Gagal memperbarui account.", "error");
    }
  }

  if (loading) {
    return (
      <div>
        <PageHeader title="Account Detail" onBack={true} />
        <Skeleton height={140} />
      </div>
    );
  }

  if (!account) {
    return (
      <div>
        <PageHeader title="Account Detail" onBack={true} />
        <p style={{ color: "var(--color-text-secondary)" }}>Account tidak ditemukan.</p>
      </div>
    );
  }

  const isArchived = account.status === "archived";

  return (
    <div>
      <PageHeader
        title={account.name}
        onBack={true}
        action={
          <AccountMenu
            account={account}
            onEdit={() => setEditOpen(true)}
            onArchive={handleArchive}
            onUnarchive={handleUnarchive}
            onDelete={() => setDeleteConfirmOpen(true)}
          />
        }
      />

      <div className="card" style={{ padding: 22, marginBottom: 16, textAlign: "center" }}>
        {isArchived && (
          <div style={{ marginBottom: 8 }}>
            <Badge variant="archived">Archived</Badge>
          </div>
        )}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 10 }}>
          <ProviderLogo provider={provider} type={account.type} size={52} />
        </div>
        <div style={{ fontSize: 13, color: "var(--color-text-secondary)", fontWeight: 600, marginBottom: 6 }}>
          {provider?.name || (account.type === "cash" ? "Cash" : "-")}
        </div>
        <MaskedAmount value={balance} style={{ fontSize: 30, fontWeight: 800 }} />
      </div>

      <div className="grid-2" style={{ marginBottom: 16 }}>
        <div className="card" style={{ padding: 14 }}>
          <div style={{ fontSize: 12, color: "var(--color-text-secondary)", fontWeight: 600, marginBottom: 6 }}>
            Income
          </div>
          <div style={{ fontWeight: 700, color: "var(--color-income)" }}>{formatCurrency(stats.income)}</div>
        </div>
        <div className="card" style={{ padding: 14 }}>
          <div style={{ fontSize: 12, color: "var(--color-text-secondary)", fontWeight: 600, marginBottom: 6 }}>
            Expense
          </div>
          <div style={{ fontWeight: 700, color: "var(--color-expense)" }}>{formatCurrency(stats.expense)}</div>
        </div>
      </div>

      {!isArchived && (
        <button
          type="button"
          className="btn btn-secondary"
          style={{ width: "100%", marginBottom: 20 }}
          onClick={() => setAdjustOpen(true)}
        >
          <SlidersHorizontal size={16} /> Adjust Balance
        </button>
      )}

      <div className="section-title">Recent Transactions</div>
      <TransactionList
        records={records}
        accountsById={accountsById}
        categoriesById={categoriesById}
        loading={false}
        perspectiveAccountId={accountId}
        onSelect={(record) => navigate(`/records/${record.id}`)}
        emptyTitle="Belum ada transaksi"
        emptyDescription="Transaksi pada account ini akan muncul di sini."
      />

      <Modal open={editOpen} onClose={() => setEditOpen(false)} title="Edit Account">
        <AccountForm
          initialName={account.name}
          initialBalance={account.initialBalance}
          onSubmit={handleEditSubmit}
          submitLabel="Simpan Perubahan"
        />
      </Modal>

      <BalanceAdjustmentModal
        open={adjustOpen}
        onClose={() => setAdjustOpen(false)}
        recordedBalance={balance}
        onSubmit={async ({ actualBalance, reason }) => {
          try {
            await createAdjustment({ accountId, recordedBalance: balance, actualBalance, reason });
            notifyDataChange();
            showToast("Penyesuaian saldo berhasil dicatat.", "success");
            setAdjustOpen(false);
          } catch (err) {
            showToast(err.message || "Gagal menyesuaikan saldo.", "error");
          }
        }}
      />

      <ConfirmDialog
        open={deleteConfirmOpen}
        title="Hapus account ini?"
        description="Account tanpa transaksi bisa dihapus permanen. Account yang sudah memiliki transaksi harus diarsipkan. Tindakan ini tidak bisa dibatalkan."
        onConfirm={handleDelete}
        onCancel={() => setDeleteConfirmOpen(false)}
      />
    </div>
  );
}

// Balance Adjustment (blueprint 6.7): Recorded Balance, Actual Balance,
// Difference, Reason — recorded as a controlled adjustment record.
function BalanceAdjustmentModal({ open, onClose, recordedBalance, onSubmit }) {
  const [actualInput, setActualInput] = useState("");
  const [reason, setReason] = useState("");

  useEffect(() => {
    if (open) {
      setActualInput(formatNumberInput(recordedBalance));
      setReason("");
    }
  }, [open, recordedBalance]);

  const actualBalance = parseCurrencyInput(actualInput);
  const difference = actualBalance - recordedBalance;

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit({ actualBalance, reason });
  }

  return (
    <Modal open={open} onClose={onClose} title="Balance Adjustment">
      <form onSubmit={handleSubmit}>
        <div className="field">
          <label className="field-label">Recorded Balance</label>
          <div style={{ fontSize: 18, fontWeight: 700 }}>{formatCurrency(recordedBalance)}</div>
        </div>
        <Input
          label="Actual Balance"
          inputMode="numeric"
          value={actualInput}
          onChange={(e) => setActualInput(formatNumberInput(e.target.value))}
        />
        <div className="field">
          <label className="field-label">Difference</label>
          <div
            style={{
              fontSize: 15,
              fontWeight: 700,
              color: difference < 0 ? "var(--color-expense)" : difference > 0 ? "var(--color-income)" : "var(--color-text-secondary)",
            }}
          >
            {difference === 0 ? "Rp0" : `${difference > 0 ? "+" : "-"}${formatCurrency(Math.abs(difference))}`}
          </div>
        </div>
        <Input
          label="Reason"
          placeholder="Alasan penyesuaian saldo"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />
        <Button type="submit" block disabled={difference === 0}>
          Simpan Penyesuaian
        </Button>
      </form>
    </Modal>
  );
}
