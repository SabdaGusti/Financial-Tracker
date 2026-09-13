import { useEffect, useMemo, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { useAccounts } from "../hooks/useAccounts";
import { useRecords } from "../hooks/useRecords";
import { useCategories } from "../hooks/useCategories";
import { getTotalBalance, getIncomeTotal, getExpenseTotal } from "../services/balanceService";
import BalanceCard from "../components/dashboard/BalanceCard";
import IncomeExpenseSummary from "../components/dashboard/IncomeExpenseSummary";
import AccountSection from "../components/dashboard/AccountSection";
import QuickActions from "../components/dashboard/QuickActions";
import RecentTransactions from "../components/dashboard/RecentTransactions";
import { greetingByTime } from "../utils/date";

function currentMonthRange() {
  const now = new Date();
  const from = new Date(now.getFullYear(), now.getMonth(), 1);
  const to = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  const iso = (d) => d.toISOString().slice(0, 10);
  return { from: iso(from), to: iso(to) };
}

// Dashboard / Home (blueprint 6.1): Greeting, Total Balance Card,
// Income/Expense Summary, Account Section, Quick Actions, Recent Transactions.
export default function Home() {
  const { dataVersion } = useAppContext();
  const { accounts, balances, loading: accountsLoading } = useAccounts();
  const { records, loading: recordsLoading } = useRecords();
  const { categories } = useCategories();
  const [totalBalance, setTotalBalance] = useState(0);
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);

  useEffect(() => {
    let active = true;
    async function load() {
      const { from, to } = currentMonthRange();
      const [total, inc, exp] = await Promise.all([
        getTotalBalance(),
        getIncomeTotal({ from, to }),
        getExpenseTotal({ from, to }),
      ]);
      if (active) {
        setTotalBalance(total);
        setIncome(inc);
        setExpense(exp);
      }
    }
    load();
    return () => {
      active = false;
    };
  }, [dataVersion]);

  const accountsById = useMemo(() => Object.fromEntries(accounts.map((a) => [a.id, a])), [accounts]);
  const categoriesById = useMemo(() => Object.fromEntries(categories.map((c) => [c.id, c])), [categories]);
  const recentRecords = records.slice(0, 5);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div>
        <div style={{ fontSize: 13, color: "var(--color-text-secondary)", fontWeight: 600, marginBottom: 4 }}>
          {greetingByTime()}
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 700 }}>Ringkasan Keuangan</h1>
      </div>

      <BalanceCard totalBalance={totalBalance} />
      <IncomeExpenseSummary income={income} expense={expense} />
      <AccountSection accounts={accounts} balances={balances} />
      <QuickActions />
      <RecentTransactions
        records={recentRecords}
        accountsById={accountsById}
        categoriesById={categoriesById}
        loading={recordsLoading || accountsLoading}
      />
    </div>
  );
}
