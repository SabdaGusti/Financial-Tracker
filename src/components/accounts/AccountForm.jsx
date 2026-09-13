import { useState } from "react";
import Input from "../common/Input";
import Button from "../common/Button";
import { formatNumberInput, parseCurrencyInput } from "../../utils/currency";

export default function AccountForm({
  initialName = "",
  initialBalance = 0,
  onSubmit,
  submitLabel = "Simpan Account",
  errors = {},
  disableBalance = false,
  submitError,
}) {
  const [name, setName] = useState(initialName);
  const [balanceInput, setBalanceInput] = useState(
    initialBalance ? formatNumberInput(initialBalance) : ""
  );

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit({ name, initialBalance: parseCurrencyInput(balanceInput) });
  }

  return (
    <form onSubmit={handleSubmit}>
      <Input
        label="Nama Account"
        placeholder="mis. BCA Utama, Dompet Harian"
        value={name}
        onChange={(e) => setName(e.target.value)}
        error={errors.name}
      />
      <Input
        label="Saldo Awal"
        inputMode="numeric"
        placeholder="0"
        value={balanceInput}
        onChange={(e) => setBalanceInput(formatNumberInput(e.target.value))}
        helper={disableBalance ? undefined : "Saldo saat account ini mulai dicatat."}
        error={errors.initialBalance}
        disabled={disableBalance}
      />
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
