import { Landmark, WalletCards, Banknote } from "lucide-react";
import { getProviderLogo } from "../../utils/providerLogos";

const fallbackIconByType = { bank: Landmark, ewallet: WalletCards, cash: Banknote };

/**
 * Renders a provider's real logo (bank/e-wallet) when available, padded
 * inside a white rounded box with objectFit:contain so wide wordmark logos
 * (e.g. Danamon, Maybank, OCBC) never get stretched or cropped. Falls back
 * to a generic lucide icon for cash accounts or providers without a logo.
 */
export default function ProviderLogo({ provider, type, size = 40, radius = "var(--radius-md)" }) {
  const logoUrl = provider?.logo ? getProviderLogo(provider.logo) : null;
  const Fallback = fallbackIconByType[type] || WalletCards;

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: radius,
        background: logoUrl ? "#fff" : "var(--color-primary-soft)",
        border: logoUrl ? "1px solid var(--color-border)" : "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        overflow: "hidden",
        padding: logoUrl ? Math.round(size * 0.16) : 0,
      }}
    >
      {logoUrl ? (
        <img
          src={logoUrl}
          alt={provider?.name || ""}
          style={{ width: "100%", height: "100%", objectFit: "contain" }}
        />
      ) : (
        <Fallback size={Math.round(size * 0.45)} color="var(--color-primary)" />
      )}
    </div>
  );
}
