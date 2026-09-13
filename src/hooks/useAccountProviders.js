import { useCallback, useEffect, useState } from "react";
import { getAccountProviders } from "../services/accountService";
import { useAppContext } from "../context/AppContext";

export function useAccountProviders() {
  const { dataVersion } = useAppContext();
  const [providersById, setProvidersById] = useState({});
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    setLoading(true);
    const providers = await getAccountProviders();
    setProvidersById(Object.fromEntries(providers.map((p) => [p.id, p])));
    setLoading(false);
  }, []);

  useEffect(() => {
    reload();
  }, [reload, dataVersion]);

  return { providersById, loading, reload };
}
