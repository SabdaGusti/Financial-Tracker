import { useCallback, useEffect, useState } from "react";
import { getCategories } from "../services/categoryService";
import { useAppContext } from "../context/AppContext";

export function useCategories(type) {
  const { dataVersion } = useAppContext();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    setLoading(true);
    const data = await getCategories({ type });
    setCategories(data);
    setLoading(false);
  }, [type]);

  useEffect(() => {
    reload();
  }, [reload, dataVersion]);

  return { categories, loading, reload };
}
