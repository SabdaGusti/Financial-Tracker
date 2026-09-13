export default function BottomSheet({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div className="overlay bottom-sheet-wrap" onClick={onClose}>
      <div className="bottom-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="bottom-sheet-handle" />
        {title && (
          <h3 style={{ marginBottom: 16, fontSize: 16, fontWeight: 700 }}>{title}</h3>
        )}
        {children}
      </div>
    </div>
  );
}
