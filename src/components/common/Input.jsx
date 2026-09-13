export default function Input({ label, error, helper, id, className = "", ...props }) {
  const inputId = id || props.name;
  return (
    <div className="field">
      {label && (
        <label className="field-label" htmlFor={inputId}>
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`field-input ${error ? "has-error" : ""} ${className}`}
        {...props}
      />
      {error ? (
        <span className="field-error">{error}</span>
      ) : helper ? (
        <span className="field-helper">{helper}</span>
      ) : null}
    </div>
  );
}
