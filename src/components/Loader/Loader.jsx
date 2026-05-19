import styles from "./Loader.module.scss";

export default function Loader({ message = "Cargando..." }) {
  return (
    <section className={styles.loadingCard} aria-busy="true" aria-live="polite">
      <span className={styles.loader} aria-hidden="true" />
      <p>{message}</p>
    </section>
  );
}
