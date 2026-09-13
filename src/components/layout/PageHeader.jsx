import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import IconButton from "../common/IconButton";

export default function PageHeader({ title, onBack, action }) {
  const navigate = useNavigate();
  return (
    <div className="page-header">
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {onBack !== false && onBack !== undefined ? (
          <IconButton icon={ChevronLeft} onClick={onBack === true ? () => navigate(-1) : onBack} />
        ) : null}
        <h1 className="page-title">{title}</h1>
      </div>
      {action}
    </div>
  );
}
