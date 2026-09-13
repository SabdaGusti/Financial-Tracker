import { useNavigate } from "react-router-dom";
import { Plus, Wallet } from "lucide-react";

export default function QuickActions() {
  const navigate = useNavigate();
  return (
    <div className="grid-2">
      <button type="button" className="btn btn-primary" onClick={() => navigate("/records/add")}>
        <Plus size={17} /> Add Record
      </button>
      <button type="button" className="btn btn-secondary" onClick={() => navigate("/accounts/add")}>
        <Wallet size={17} /> Add Account
      </button>
    </div>
  );
}
