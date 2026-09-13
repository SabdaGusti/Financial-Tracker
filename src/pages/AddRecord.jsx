import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/layout/PageHeader";
import TransactionForm from "../components/records/TransactionForm";
import { useAccounts } from "../hooks/useAccounts";
import { useAccountProviders } from "../hooks/useAccountProviders";
import { useCategories } from "../hooks/useCategories";
import { useAppContext } from "../context/AppContext";
import { createExpense, createIncome, createTransfer } from "../services/recordService";

export default function AddRecord() {
  const navigate = useNavigate();
  const { accounts, balances } = useAccounts();
  const { providersById } = useAccountProviders();
  const { categories } = useCategories();
  const { notifyDataChange, showToast } = useAppContext();
  const [submitError, setSubmitError] = useState("");

  async function handleSubmit(values) {
    setSubmitError("");
    try {
      if (values.type === "expense") await createExpense(values);
      else if (values.type === "income") await createIncome(values);
      else await createTransfer(values);
      notifyDataChange();
      showToast("Transaksi berhasil disimpan.", "success");
      navigate("/records");
    } catch (err) {
      setSubmitError(err.message || "Transaksi gagal disimpan.");
    }
  }

  return (
    <div>
      <PageHeader title="Add Record" onBack={true} />
      <TransactionForm
        accounts={accounts}
        balances={balances}
        providersById={providersById}
        categories={categories}
        onSubmit={handleSubmit}
        submitLabel="Simpan Transaksi"
        submitError={submitError}
      />
    </div>
  );
}
