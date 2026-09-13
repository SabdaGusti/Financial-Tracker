import { ChevronDown } from "lucide-react";

export default function Select({
  label,
  error,
  helper,
  id,
  options = [],
  placeholder,
  className = "",
  ...props
}) {
  const selectId = id || props.name;
  return (
    <div className="field">
      {label && (
        <label className="field-label" htmlFor={selectId}>
          {label}
        </label>
      )}
      <div style={{ position: "relative" }}>
        <select
          id={selectId}
          className={`field-select ${error ? "has-error" : ""} ${className}`}
          style={{ appearance: "none", paddingRight: 36 }}
          {...props}
        >
          {placeholder !== undefined && <option value="">{placeholder}</option>}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown
          size={16}
          style={{
            position: "absolute",
            right: 12,
            top: "50%",
            transform: "translateY(-50%)",
            color: "var(--color-text-muted)",
            pointerEvents: "none",
          }}
        />
      </div>
      {error ? (
        <span className="field-error">{error}</span>
      ) : helper ? (
        <span className="field-helper">{helper}</span>
      ) : null}
    </div>
  );
}
