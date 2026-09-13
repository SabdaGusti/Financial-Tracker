import { db } from "../db/database";

/**
 * Balance = Initial Balance + Income - Expense - Transfer Out + Transfer In ± Adjustment
 * (blueprint section 9). Balance is never stored as source of truth; it is
 * always derived from initialBalance + effect of financialRecords.
 */
function accountBalanceDelta(record, accountId) {
  if (record.type === "income" && record.accountId === accountId) {
    return record.amount;
  }
  if (record.type === "expense" && record.accountId === accountId) {
    return -record.amount;
  }
  if (record.type === "transfer") {
    if (record.accountId === accountId) return -record.amount;
    if (record.destinationAccountId === accountId) return record.amount;
  }
  if (record.type === "adjustment" && record.accountId === accountId) {
    return record.adjustmentType === "decrease" ? -record.amount : record.amount;
  }
  return 0;
}

async function getAccountRecords(accountId) {
  return db.financialRecords
    .filter((r) => r.accountId === accountId || r.destinationAccountId === accountId)
    .toArray();
}

/**
 * Compute the current balance of a single account.
 * `records` can be supplied to avoid an extra query (e.g. after excluding
 * a record being edited).
 */
export async function computeAccountBalance(accountId, records = null) {
  const account = await db.accounts.get(accountId);
  if (!account) return 0;
  const relevantRecords = records ?? (await getAccountRecords(accountId));
  let balance = account.initialBalance || 0;
  for (const record of relevantRecords) {
    balance += accountBalanceDelta(record, accountId);
  }
  return balance;
}

export async function getAccountBalance(accountId) {
  return computeAccountBalance(accountId);
}

/**
 * Compute balances for every account in a single pass over all records
 * (used by Dashboard/Accounts list to avoid N+1 queries).
 */
export async function getAccountBalancesMap() {
  const [accounts, records] = await Promise.all([
    db.accounts.toArray(),
    db.financialRecords.toArray(),
  ]);

  const map = {};
  accounts.forEach((account) => {
    map[account.id] = account.initialBalance || 0;
  });

  records.forEach((record) => {
    if (record.accountId != null && map[record.accountId] !== undefined) {
      map[record.accountId] += accountBalanceDelta(record, record.accountId);
    }
    if (
      record.type === "transfer" &&
      record.destinationAccountId != null &&
      map[record.destinationAccountId] !== undefined
    ) {
      map[record.destinationAccountId] += accountBalanceDelta(
        record,
        record.destinationAccountId
      );
    }
  });

  return map;
}

/**
 * Total balance = aggregation of all account balances. Archived accounts keep
 * their balance and history (section 10, rule 10 & 19) so they remain part
 * of the total; only accounts that have been permanently deleted are excluded
 * automatically because they no longer exist as rows.
 */
export async function getTotalBalance() {
  const map = await getAccountBalancesMap();
  return Object.values(map).reduce((sum, balance) => sum + balance, 0);
}

function inDateRange(record, from, to) {
  if (from && record.date < from) return false;
  if (to && record.date > to) return false;
  return true;
}

export async function getIncomeTotal({ from, to, accountId } = {}) {
  const records = await db.financialRecords.where("type").equals("income").toArray();
  return records
    .filter((r) => inDateRange(r, from, to))
    .filter((r) => !accountId || r.accountId === accountId)
    .reduce((sum, r) => sum + r.amount, 0);
}

export async function getExpenseTotal({ from, to, accountId } = {}) {
  const records = await db.financialRecords.where("type").equals("expense").toArray();
  return records
    .filter((r) => inDateRange(r, from, to))
    .filter((r) => !accountId || r.accountId === accountId)
    .reduce((sum, r) => sum + r.amount, 0);
}

/**
 * Income/expense statistics scoped to one account (used by Account Detail).
 */
export async function getAccountStatistics(accountId, { from, to } = {}) {
  const records = await getAccountRecords(accountId);
  const scoped = records.filter((r) => inDateRange(r, from, to));
  const income = scoped
    .filter((r) => r.type === "income" && r.accountId === accountId)
    .reduce((sum, r) => sum + r.amount, 0);
  const expense = scoped
    .filter((r) => r.type === "expense" && r.accountId === accountId)
    .reduce((sum, r) => sum + r.amount, 0);
  return { income, expense };
}
