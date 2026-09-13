import { db } from "../db/database";

// Rule 14: provider is selected from master data (accountProviders), never free text.
export async function getAccountProviders({ type } = {}) {
  let providers = await db.accountProviders.toArray();
  providers = providers.filter((p) => p.isActive);
  if (type) providers = providers.filter((p) => p.type === type);
  return providers.sort((a, b) => Number(b.isPopular) - Number(a.isPopular));
}

export async function getAccountProvider(id) {
  if (id == null) return null;
  return db.accountProviders.get(id);
}

export async function getAccounts({ includeArchived = true } = {}) {
  const accounts = await db.accounts.toArray();
  const filtered = includeArchived
    ? accounts
    : accounts.filter((a) => a.status === "active");
  return filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export async function getAccount(id) {
  return db.accounts.get(id);
}

export async function createAccount(data) {
  const name = (data.name || "").trim();
  if (!name) {
    throw new Error("Nama account wajib diisi.");
  }
  const now = new Date().toISOString();
  const id = await db.accounts.add({
    providerId: data.providerId ?? null,
    type: data.type,
    name,
    initialBalance: Number(data.initialBalance) || 0,
    status: "active",
    createdAt: now,
    updatedAt: now,
  });
  return db.accounts.get(id);
}

export async function updateAccount(id, updates) {
  await db.accounts.update(id, { ...updates, updatedAt: new Date().toISOString() });
  return db.accounts.get(id);
}

// Rule 9 & 10: account with transactions must be archived, keeps history & balance.
export async function archiveAccount(id) {
  return updateAccount(id, { status: "archived" });
}

export async function unarchiveAccount(id) {
  return updateAccount(id, { status: "active" });
}

export async function accountHasTransactions(id) {
  const count = await db.financialRecords
    .filter((r) => r.accountId === id || r.destinationAccountId === id)
    .count();
  return count > 0;
}

// Rule 8 & 12: only accounts without transactions can be permanently deleted.
export async function deleteAccount(id) {
  const hasTransactions = await accountHasTransactions(id);
  if (hasTransactions) {
    throw new Error(
      "Account ini sudah memiliki transaksi sehingga tidak bisa dihapus permanen. Arsipkan account ini sebagai gantinya."
    );
  }
  return db.accounts.delete(id);
}
