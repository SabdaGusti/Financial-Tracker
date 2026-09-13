export default function IconButton({ icon: Icon, size = 18, className = "", ...props }) {
  return (
    <button type="button" className={`icon-btn ${className}`} {...props}>
      <Icon size={size} />
    </button>
  );
}
