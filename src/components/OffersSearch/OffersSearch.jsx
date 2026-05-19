import { FaSearch } from "react-icons/fa";

import styles from "./OffersSearch.module.scss";

export default function OffersSearch({
  value,
  onChange,
  placeholder = "Buscar ofertas por título, tienda o descripción...",
}) {
  return (
    <label className={styles.search}>
      <FaSearch className={styles.icon} aria-hidden="true" />

      <input
        type="search"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        maxLength={50}
        aria-label="Buscar ofertas"
      />
    </label>
  );
}
