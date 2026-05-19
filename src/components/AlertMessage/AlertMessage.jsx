export default function AlertMessage({ type, children }) {
  if (!children || !type) return null;

  return <div className={`alert alert--${type}`}>{children}</div>;
}
