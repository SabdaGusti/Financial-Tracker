import { useAppContext } from "../../context/AppContext";
import { formatCurrency } from "../../utils/currency";

// Renders a currency amount, or a masked placeholder when the user has
// toggled "Hide Balance" off. Length of the mask loosely follows the
// formatted amount so the layout doesn't jump around.
export default function MaskedAmount({ value, className, style }) {
  const { showBalance } = useAppContext();

  if (showBalance) {
    return (
      <span className={className} style={style}>
        {formatCurrency(value)}
      </span>
    );
  }

  return (
    <span className={className} style={{ letterSpacing: 2, ...style }}>
      Rp••••••
    </span>
  );
}
