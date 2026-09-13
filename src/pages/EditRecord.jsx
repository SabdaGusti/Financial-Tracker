import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PageHeader from "../components/layout/PageHeader";
import TransactionForm from "../components/records/TransactionForm";
import Skeleton from "../components/common/Skeleton";
import { useAccounts } from "../hooks/useAccounts";
import { useAccountProviders } from "../hooks/useAccountProviders";
import { useCategories } from "../hooks/useCategories";
import { useAppContext } from "../context/AppContext";
import { getRecord, updateRecord } from "../services/recordService";

export default function EditRecord() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { accounts, balances } = useAccounts();
  const { providersById } = useAccountProviders();
  const { categories } = useCategories();
  const { notifyDataChange, showToast } = useAppContext();
  const [record, setRecord] = useState(null);
  const [submitError, setSubmitError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await getRecord(Number(id));
      setRecord(data);
      setLoading(false);
    }
    load();
  }, [id]);

  async function handleSubmit(values) {
    setSubmitError("");
    try {
      await updateRecord(Number(id), values);
      notifyDataChange();
      showToast("Transaksi berhasil diperbarui.", "success");
      navigate(`/records/${id}`);
    } catch (err) {
      setSubmitError(err.message || "Transaksi gagal diperbarui.");
    }
  }

  return (
    <div>
      <PageHeader title="Edit Record" onBack={true} />
      {loading || !record ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <Skeleton height={80} />
          <Skeleton height={48} />
          <Skeleton height={48} />
        </div>
      ) : (
        <TransactionForm
          accounts={accounts}
          balances={balances}
          providersById={providersById}
          categories={categories}
          initialValues={record}
          lockType
          onSubmit={handleSubmit}
          submitLabel="Simpan Perubahan"
          submitError={submitError}
        />
      )}
    </div>
  );
}
