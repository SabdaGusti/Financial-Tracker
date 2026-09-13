const formatter = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const plainFormatter = new Intl.NumberFormat("id-ID");

/**
 * Format a number as "Rp1.234.567"
 */
export function formatCurrency(value) {
  const safeValue = Number.isFinite(value) ? value : 0;
  return formatter.format(safeValue).replace(/\s/g, "");
}

/**
 * Format a number as signed currency, e.g. "+Rp50.000" / "-Rp25.000"
 */
export function formatSignedCurrency(value) {
  const safeValue = Number.isFinite(value) ? value : 0;
  const sign = safeValue > 0 ? "+" : safeValue < 0 ? "-" : "";
  return `${sign}${formatCurrency(Math.abs(safeValue))}`;
}

/**
 * Format a plain number with thousand separators (no currency symbol),
 * used while typing an amount into an input.
 */
export function formatNumberInput(value) {
  const digits = String(value ?? "").replace(/[^\d]/g, "");
  if (!digits) return "";
  return plainFormatter.format(Number(digits));
}

/**
 * Parse a formatted amount string back into a number.
 */
export function parseCurrencyInput(value) {
  const digits = String(value ?? "").replace(/[^\d]/g, "");
  return digits ? Number(digits) : 0;
}
