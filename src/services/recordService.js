import { db } from "../db/database";
import { computeAccountBalance } from "./balanceService";

async function assertAccountExists(accountId, label = "Account") {
  const account = await db.accounts.get(accountId);
  if (!account) throw new Error(`${label} tidak ditemukan.`);
  return account;
}

// Rule 11: archived account cannot be used for NEW transactions.
async function assertAccountUsableForNew(accountId, label = "Account") {
  const account = await assertAccountExists(accountId, label);
  if (account.status === "archived") {
    throw new Error(`${label} sudah diarsipkan dan tidak bisa dipakai untuk transaksi baru.`);
  }
  return account;
}

// When editing, allow keeping the account that the record already used even
// if it has since been archived; only block switching to a *different*
// archived account.
async function assertAccountUsableForEdit(accountId, existingRecord, label = "Account") {
  const account = await assertAccountExists(accountId, label);
  const wasAlreadyUsed =
    existingRecord.accountId === accountId || existingRecord.destinationAccountId === accountId;
  if (account.status === "archived" && !wasAlreadyUsed) {
    throw new Error(`${label} sudah diarsipkan dan tidak bisa dipakai untuk transaksi baru.`);
  }
  return account;
}

// Rule 1 & 2: negative balance / insufficient balance is rejected.
// excludeRecordId lets edits "reverse the old record's effect" before checking (rule 6).
async function assertSufficientBalance(accountId, amount, excludeRecordId = null) {
  let records = await db.financialRecords
    .filter((r) => r.accountId === accountId || r.destinationAccountId === accountId)
    .toArray();
  if (excludeRecordId != null) {
    records = records.filter((r) => r.id !== excludeRecordId);
  }
  const balance = await computeAccountBalance(accountId, records);
  if (amount > balance) {
    throw new Error("Saldo tidak mencukupi untuk transaksi ini.");
  }
  return balance;
}

function nowISO() {
  return new Date().toISOString();
}

function assertPositiveAmount(amount) {
  if (!amount || Number(amount) <= 0) {
    throw new Error("Nominal harus lebih dari Rp0.");
  }
}

export async function createIncome(data) {
  assertPositiveAmount(data.amount);
  return db.transaction("rw", db.accounts, db.financialRecords, async () => {
    await assertAccountUsableForNew(data.accountId);
    const now = nowISO();
    const id = await db.financialRecords.add({
      type: "income",
      amount: Number(data.amount),
      description: data.description || "",
      categoryId: data.categoryId ?? null,
      accountId: data.accountId,
      destinationAccountId: null,
      adjustmentType: null,
      date: data.date,
      note: data.note || "",
      createdAt: now,
      updatedAt: now,
    });
    return db.financialRecords.get(id);
  });
}

export async function createExpense(data) {
  assertPositiveAmount(data.amount);
  return db.transaction("rw", db.accounts, db.financialRecords, async () => {
    await assertAccountUsableForNew(data.accountId);
    await assertSufficientBalance(data.accountId, Number(data.amount));
    const now = nowISO();
    const id = await db.financialRecords.add({
      type: "expense",
      amount: Number(data.amount),
      description: data.description || "",
      categoryId: data.categoryId ?? null,
      accountId: data.accountId,
      destinationAccountId: null,
      adjustmentType: null,
      date: data.date,
      note: data.note || "",
      createdAt: now,
      updatedAt: now,
    });
    return db.financialRecords.get(id);
  });
}

// Rule 3,4,5,13,18: transfer is atomic, validates both accounts, no self-transfer,
// and does not change total wealth (implicit in the balance formula).
export async function createTransfer(data) {
  assertPositiveAmount(data.amount);
  const { accountId, destinationAccountId } = data;
  if (!accountId || !destinationAccountId) {
    throw new Error("Pilih account asal dan tujuan.");
  }
  if (accountId === destinationAccountId) {
    throw new Error("Account asal dan tujuan tidak boleh sama.");
  }
  return db.transaction("rw", db.accounts, db.financialRecords, async () => {
    await assertAccountUsableForNew(accountId, "Account asal");
    await assertAccountUsableForNew(destinationAccountId, "Account tujuan");
    await assertSufficientBalance(accountId, Number(data.amount));
    const now = nowISO();
    const id = await db.financialRecords.add({
      type: "transfer",
      amount: Number(data.amount),
      description: data.description || "",
      categoryId: null,
      accountId,
      destinationAccountId,
      adjustmentType: null,
      date: data.date,
      note: data.note || "",
      createdAt: now,
      updatedAt: now,
    });
    return db.financialRecords.get(id);
  });
}

// Rule 16: balance adjustment is done through a dedicated mechanism and recorded.
export async function createAdjustment({ accountId, recordedBalance, actualBalance, reason, date }) {
  const difference = Number(actualBalance) - Number(recordedBalance);
  if (difference === 0) {
    throw new Error("Saldo aktual sama dengan saldo tercatat, tidak ada penyesuaian yang diperlukan.");
  }
  return db.transaction("rw", db.accounts, db.financialRecords, async () => {
    await assertAccountUsableForNew(accountId);
    if (difference < 0) {
      await assertSufficientBalance(accountId, Math.abs(difference));
    }
    const now = nowISO();
    const id = await db.financialRecords.add({
      type: "adjustment",
      amount: Math.abs(difference),
      description: "Penyesuaian saldo",
      categoryId: null,
      accountId,
      destinationAccountId: null,
      adjustmentType: difference > 0 ? "increase" : "decrease",
      date: date || new Date().toISOString().slice(0, 10),
      note: reason || "",
      createdAt: now,
      updatedAt: now,
    });
    return db.financialRecords.get(id);
  });
}

// Rule 6 & 17: edit reverses the old record's effect (by excluding it from the
// balance check), applies + validates the new one, keeping balances consistent.
export async function updateRecord(id, updates) {
  return db.transaction("rw", db.accounts, db.financialRecords, async () => {
    const existing = await db.financialRecords.get(id);
    if (!existing) throw new Error("Transaksi tidak ditemukan.");
    const merged = { ...existing, ...updates };
    if (updates.amount !== undefined) merged.amount = Number(updates.amount);
    assertPositiveAmount(merged.amount);

    if (merged.type === "transfer") {
      if (!merged.accountId || !merged.destinationAccountId) {
        throw new Error("Pilih account asal dan tujuan.");
      }
      if (merged.accountId === merged.destinationAccountId) {
        throw new Error("Account asal dan tujuan tidak boleh sama.");
      }
      await assertAccountUsableForEdit(merged.accountId, existing, "Account asal");
      await assertAccountUsableForEdit(merged.destinationAccountId, existing, "Account tujuan");
      await assertSufficientBalance(merged.accountId, merged.amount, existing.id);
    } else {
      await assertAccountUsableForEdit(merged.accountId, existing);
      if (merged.type === "expense") {
        await assertSufficientBalance(merged.accountId, merged.amount, existing.id);
      }
      if (merged.type === "adjustment" && merged.adjustmentType === "decrease") {
        await assertSufficientBalance(merged.accountId, merged.amount, existing.id);
      }
    }

    merged.updatedAt = nowISO();
    await db.financialRecords.put(merged);
    return merged;
  });
}

// Rule 7 & 17: after delete, balance is simply recalculated on the fly since
// it is always derived from the remaining records.
export async function deleteRecord(id) {
  return db.financialRecords.delete(id);
}

export async function getRecord(id) {
  return db.financialRecords.get(id);
}

export async function getRecords({ accountId, type, from, to } = {}) {
  let records = await db.financialRecords.toArray();
  if (accountId) {
    records = records.filter(
      (r) => r.accountId === accountId || r.destinationAccountId === accountId
    );
  }
  if (type && type !== "all") {
    records = records.filter((r) => r.type === type);
  }
  if (from) records = records.filter((r) => r.date >= from);
  if (to) records = records.filter((r) => r.date <= to);
  return records.sort((a, b) => {
    if (a.date !== b.date) return a.date < b.date ? 1 : -1;
    return new Date(b.createdAt) - new Date(a.createdAt);
  });
}
