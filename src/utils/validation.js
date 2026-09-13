export function validateAmount(amount) {
  if (!amount || Number(amount) <= 0) {
    return "Masukkan nominal lebih dari Rp0.";
  }
  return null;
}

export function validateRequired(value, fieldLabel) {
  if (value === undefined || value === null || String(value).trim() === "") {
    return `${fieldLabel} wajib diisi.`;
  }
  return null;
}

export function validateAccountSelected(accountId, fieldLabel = "Account") {
  if (!accountId) {
    return `Pilih ${fieldLabel} terlebih dahulu.`;
  }
  return null;
}

export function validateTransferAccounts(sourceId, destinationId) {
  if (!sourceId || !destinationId) {
    return "Pilih account asal dan tujuan.";
  }
  if (sourceId === destinationId) {
    return "Account asal dan tujuan tidak boleh sama.";
  }
  return null;
}

export function validateSufficientBalance(availableBalance, amount) {
  if (amount > availableBalance) {
    return `Saldo tidak mencukupi. Saldo tersedia ${availableBalance < 0 ? "Rp0" : ""}.`;
  }
  return null;
}

export function validateAccountName(name) {
  if (!name || !name.trim()) {
    return "Nama account wajib diisi.";
  }
  if (name.trim().length < 2) {
    return "Nama account terlalu pendek.";
  }
  return null;
}
