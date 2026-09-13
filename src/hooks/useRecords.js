import { useCallback, useEffect, useState } from "react";
import { getRecords } from "../services/recordService";
import { useAppContext } from "../context/AppContext";

export function useRecords(filters = {}) {
  const { dataVersion } = useAppContext();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const filterKey = JSON.stringify(filters);

  const reload = useCallback(async () => {
    setLoading(true);
    const data = await getRecords(filters);
    setRecords(data);
    setLoading(false);
    // filterKey intentionally represents the dependency
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterKey]);

  useEffect(() => {
    reload();
  }, [reload, dataVersion]);

  return { records, loading, reload };
}
