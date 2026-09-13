export default function Modal({ open, onClose, title, children, footer }) {
  if (!open) return null;
  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        {title && (
          <h3 style={{ marginBottom: 16, fontSize: 17, fontWeight: 700 }}>{title}</h3>
        )}
        {children}
        {footer && (
          <div style={{ marginTop: 20, display: "flex", gap: 8, justifyContent: "flex-end" }}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
