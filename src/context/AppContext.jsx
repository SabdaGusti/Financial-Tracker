import { createContext, useCallback, useContext, useEffect, useState } from "react";

const AppContext = createContext(null);
const BALANCE_VISIBILITY_KEY = "financial-tracker:show-balance";

export function AppProvider({ children }) {
  const [dataVersion, setDataVersion] = useState(0);
  const [toasts, setToasts] = useState([]);

  // Global Hide/Show Balance toggle, remembered across sessions on this device.
  const [showBalance, setShowBalance] = useState(() => {
    try {
      const stored = localStorage.getItem(BALANCE_VISIBILITY_KEY);
      return stored === null ? true : stored === "true";
    } catch {
      return true;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(BALANCE_VISIBILITY_KEY, String(showBalance));
    } catch {
      // ignore storage errors (e.g. private browsing)
    }
  }, [showBalance]);

  const toggleShowBalance = useCallback(() => {
    setShowBalance((prev) => !prev);
  }, []);

  // Called by pages/forms after any mutation so hooks re-fetch fresh data.
  const notifyDataChange = useCallback(() => {
    setDataVersion((v) => v + 1);
  }, []);

  const showToast = useCallback((message, variant = "default") => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, message, variant }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 2800);
  }, []);

  const value = {
    dataVersion,
    notifyDataChange,
    toasts,
    showToast,
    showBalance,
    toggleShowBalance,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return ctx;
}
