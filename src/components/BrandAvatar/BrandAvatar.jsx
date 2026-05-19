import logoKitos from "../../assets/images/logoKitos.jpg";
import styles from "./BrandAvatar.module.scss";

export default function BrandAvatar({ name, className = "", size = "default" }) {
  return (
    <div className={`${styles.brand} ${className}`.trim()}>
      <div className={styles.avatar}>
        <img src={logoKitos} alt="Kitos" />
      </div>
      {name && (
        <span
          className={`${styles.name} ${size === "large" ? styles.nameLarge : ""}`.trim()}
        >
          {name}
        </span>
      )}
    </div>
  );
}
