import { useCallback, useEffect, useState } from "react";
import { getAccounts } from "../services/accountService";
import { getAccountBalancesMap } from "../services/balanceService";
import { useAppContext } from "../context/AppContext";

export function useAccounts({ includeArchived = true } = {}) {
  const { dataVersion } = useAppContext();
  const [accounts, setAccounts] = useState([]);
  const [balances, setBalances] = useState({});
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    setLoading(true);
    const [accts, balanceMap] = await Promise.all([
      getAccounts({ includeArchived }),
      getAccountBalancesMap(),
    ]);
    setAccounts(accts);
    setBalances(balanceMap);
    setLoading(false);
  }, [includeArchived]);

  useEffect(() => {
    reload();
  }, [reload, dataVersion]);

  return { accounts, balances, loading, reload };
}
