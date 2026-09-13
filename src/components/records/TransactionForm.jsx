import { useMemo, useState } from "react";
import { ArrowDown } from "lucide-react";
import TransactionTypeSelector from "./TransactionTypeSelector";
import CategorySelector from "./CategorySelector";
import AccountSelector from "../accounts/AccountSelector";
import Input from "../common/Input";
import Button from "../common/Button";
import { formatNumberInput, parseCurrencyInput } from "../../utils/currency";
import { todayISODate } from "../../utils/date";
import { validateAmount, validateAccountSelected, validateTransferAccounts } from "../../utils/validation";

// Add/Edit Record form (blueprint 6.3): type selector, amount as the most
// prominent element, description/category/account/date/note, and From -> To
// for transfer.
export default function TransactionForm({
  accounts,
  balances,
  providersById = {},
  categories,
  initialValues,
  lockType = false,
  onSubmit,
  submitLabel = "Simpan",
  submitError,
}) {
  const [type, setType] = useState(initialValues?.type || "expense");
  const [amountInput, setAmountInput] = useState(
    initialValues?.amount ? formatNumberInput(initialValues.amount) : ""
  );
  const [description, setDescription] = useState(initialValues?.description || "");
  const [categoryId, setCategoryId] = useState(initialValues?.categoryId ?? "");
  const [accountId, setAccountId] = useState(initialValues?.accountId ?? "");
  const [destinationAccountId, setDestinationAccountId] = useState(
    initialValues?.destinationAccountId ?? ""
  );
  const [date, setDate] = useState(initialValues?.date || todayISODate());
  const [note, setNote] = useState(initialValues?.note || "");
  const [errors, setErrors] = useState({});

  const activeAccounts = useMemo(
    () => accounts.filter((a) => a.status === "active" || a.id === accountId || a.id === destinationAccountId),
    [accounts, accountId, destinationAccountId]
  );

  const categoryType = type === "income" ? "income" : type === "expense" ? "expense" : null;
  const filteredCategories = useMemo(
    () => (categoryType ? categories.filter((c) => c.type === categoryType || c.type === "general") : []),
    [categories, categoryType]
  );

  function handleSubmit(e) {
    e.preventDefault();
    const amount = parseCurrencyInput(amountInput);
    const nextErrors = {};

    const amountError = validateAmount(amount);
    if (amountError) nextErrors.amount = amountError;

    if (type === "transfer") {
      const transferError = validateTransferAccounts(accountId, destinationAccountId);
      if (transferError) nextErrors.account = transferError;
    } else {
      const accError = validateAccountSelected(accountId);
      if (accError) nextErrors.account = accError;
    }

    if (!date) nextErrors.date = "Tanggal wajib diisi.";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    onSubmit({
      type,
      amount,
      description,
      categoryId: type === "transfer" ? null : categoryId || null,
      accountId,
      destinationAccountId: type === "transfer" ? destinationAccountId : null,
      date,
      note,
    });
  }

  return (
    <form onSubmit={handleSubmit}>
      {!lockType && <TransactionTypeSelector value={type} onChange={setType} />}

      <div className="field">
        <label className="field-label">Amount</label>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "16px 4px",
            borderBottom: `2px solid ${errors.amount ? "var(--color-danger)" : "var(--color-border)"}`,
          }}
        >
          <span style={{ fontSize: 26, fontWeight: 700, color: "var(--color-text-muted)" }}>Rp</span>
          <input
            inputMode="numeric"
            placeholder="0"
            value={amountInput}
            onChange={(e) => setAmountInput(formatNumberInput(e.target.value))}
            style={{
              border: "none",
              outline: "none",
              fontSize: 30,
              fontWeight: 700,
              width: "100%",
              background: "transparent",
              color: "var(--color-text-primary)",
            }}
          />
        </div>
        {errors.amount && <span className="field-error">{errors.amount}</span>}
      </div>

      <Input
        label="Description"
        placeholder="mis. Makan siang"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      {type === "transfer" ? (
        <>
          <AccountSelector
            label="From"
            accounts={activeAccounts}
            balances={balances}
            providersById={providersById}
            value={accountId}
            onChange={setAccountId}
            error={errors.account}
          />
          <div style={{ display: "flex", justifyContent: "center", margin: "-8px 0 4px" }}>
            <ArrowDown size={16} color="var(--color-text-muted)" />
          </div>
          <AccountSelector
            label="To"
            accounts={activeAccounts}
            balances={balances}
            providersById={providersById}
            value={destinationAccountId}
            onChange={setDestinationAccountId}
          />
        </>
      ) : (
        <>
          <CategorySelector categories={filteredCategories} value={categoryId} onChange={setCategoryId} />
          <AccountSelector
            label="Account"
            accounts={activeAccounts}
            balances={balances}
            providersById={providersById}
            value={accountId}
            onChange={setAccountId}
            error={errors.account}
          />
        </>
      )}

      <Input label="Date" type="date" value={date} onChange={(e) => setDate(e.target.value)} error={errors.date} />
      <Input label="Note (opsional)" placeholder="Catatan tambahan" value={note} onChange={(e) => setNote(e.target.value)} />

      {submitError && (
        <p className="field-error" style={{ marginBottom: 12 }}>
          {submitError}
        </p>
      )}

      <Button type="submit" block>
        {submitLabel}
      </Button>
    </form>
  );
}
