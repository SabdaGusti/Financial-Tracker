import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Landmark, WalletCards, Banknote } from "lucide-react";
import PageHeader from "../components/layout/PageHeader";
import ProviderSelector from "../components/accounts/ProviderSelector";
import AccountForm from "../components/accounts/AccountForm";
import { useAppContext } from "../context/AppContext";
import { createAccount, getAccountProviders } from "../services/accountService";

const typeOptions = [
  { value: "bank", label: "Bank", icon: Landmark },
  { value: "ewallet", label: "E-Wallet", icon: WalletCards },
  { value: "cash", label: "Cash", icon: Banknote },
];

// Add Account wizard (blueprint 6.5): Step 1 type, Step 2 provider (master
// data, not free text - rule 14), Step 3 initial balance & account name.
export default function AddAccount() {
  const navigate = useNavigate();
  const { notifyDataChange, showToast } = useAppContext();
  const [step, setStep] = useState(1);
  const [accountType, setAccountType] = useState(null);
  const [providers, setProviders] = useState([]);
  const [providerId, setProviderId] = useState(null);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    if (accountType && accountType !== "cash") {
      getAccountProviders({ type: accountType }).then(setProviders);
    }
  }, [accountType]);

  function selectType(type) {
    setAccountType(type);
    setProviderId(null);
    setStep(type === "cash" ? 3 : 2);
  }

  function selectProvider(id) {
    setProviderId(id);
    setStep(3);
  }

  async function handleSubmit({ name, initialBalance }) {
    setSubmitError("");
    try {
      await createAccount({ type: accountType, providerId, name, initialBalance });
      notifyDataChange();
      showToast("Account berhasil ditambahkan.", "success");
      navigate("/accounts");
    } catch (err) {
      setSubmitError(err.message || "Account gagal ditambahkan.");
    }
  }

  function handleBack() {
    if (step === 3 && accountType !== "cash") setStep(2);
    else if (step === 2 || (step === 3 && accountType === "cash")) setStep(1);
    else navigate(-1);
  }

  const selectedProvider = providers.find((p) => p.id === providerId);
  const defaultName = accountType === "cash" ? "Cash" : selectedProvider?.shortName || "";

  return (
    <div>
      <PageHeader title="Add Account" onBack={handleBack} />

      <div style={{ display: "flex", gap: 6, marginBottom: 24 }}>
        {[1, 2, 3].map((s) => (
          <div
            key={s}
            style={{
              flex: 1,
              height: 4,
              borderRadius: "var(--radius-pill)",
              background: s <= step ? "var(--color-primary)" : "var(--color-border)",
            }}
          />
        ))}
      </div>

      {step === 1 && (
        <div>
          <div className="section-title">Pilih Account Type</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {typeOptions.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => selectType(opt.value)}
                className="card"
                style={{ display: "flex", alignItems: "center", gap: 14, padding: 16, cursor: "pointer", textAlign: "left" }}
              >
                <div
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: "var(--radius-md)",
                    background: "var(--color-primary-soft)",
                    color: "var(--color-primary)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <opt.icon size={19} />
                </div>
                <span style={{ fontWeight: 700, fontSize: 15 }}>{opt.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 2 && accountType !== "cash" && (
        <div>
          <div className="section-title">Pilih Provider</div>
          <ProviderSelector providers={providers} value={providerId} onChange={selectProvider} />
        </div>
      )}

      {step === 3 && (
        <div>
          <div className="section-title">Detail Account</div>
          <AccountForm
            initialName={defaultName}
            initialBalance={0}
            onSubmit={handleSubmit}
            submitLabel="Simpan Account"
            submitError={submitError}
          />
        </div>
      )}
    </div>
  );
}
