import { CheckCircle2, XCircle, Info } from "lucide-react";
import { useAppContext } from "../../context/AppContext";

// Renders the toast stack driven by AppContext (section 15.1 "Toast").
export default function ToastContainer() {
  const { toasts } = useAppContext();
  if (!toasts.length) return null;

  return (
    <div className="toast-container">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`toast ${
            t.variant === "success" ? "toast-success" : t.variant === "error" ? "toast-error" : ""
          }`}
        >
          {t.variant === "success" ? (
            <CheckCircle2 size={16} />
          ) : t.variant === "error" ? (
            <XCircle size={16} />
          ) : (
            <Info size={16} />
          )}
          <span>{t.message}</span>
        </div>
      ))}
    </div>
  );
}
