import { Link } from "react-router-dom";
import styles from "./SectionHeader.module.scss";

export default function SectionHeader({ title, linkTo, linkText = "Ver todas →" }) {
  return (
    <div className={styles.header}>
      <h2>{title}</h2>
      {linkTo && <Link to={linkTo}>{linkText}</Link>}
    </div>
  );
}

