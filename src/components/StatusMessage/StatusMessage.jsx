import styles from "./StatusMessage.module.scss";

export default function StatusMessage({ children, variant = "default" }) {
  return (
    <p className={`${styles.status} ${variant !== "default" ? styles[variant] : ""}`.trim()}>
      {children}
    </p>
  );
}
