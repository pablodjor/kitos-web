import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Loader from "../Loader/Loader";
import styles from "./LegalBasesModal.module.scss";

function normalizeLegalBases(legalBases) {
  return {
    title: "Bases legales",
    content: typeof legalBases === "string" ? legalBases : "",
  };
}

export default function LegalBasesModal({
  isOpen,
  legalBases,
  loading,
  submitting,
  error,
  onClose,
  onAccept,
}) {
  const [accepted, setAccepted] = useState(false);
  const { title, content } = normalizeLegalBases(legalBases);

  useEffect(() => {
    if (!isOpen) {
      setAccepted(false);
      return;
    }

    const handleKeyDown = (event) => {
      if (event.key === "Escape" && !submitting) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose, submitting]);

  if (!isOpen) {
    return null;
  }

  return createPortal(
    <div
      className={styles.overlay}
      role="presentation"
      onClick={submitting ? undefined : onClose}
    >
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="legal-bases-title"
        onClick={(event) => event.stopPropagation()}
      >
        <header className={styles.header}>
          <h2 id="legal-bases-title">{title}</h2>
          <button
            type="button"
            className={styles.closeBtn}
            onClick={onClose}
            disabled={submitting}
            aria-label="Cerrar"
          >
            ×
          </button>
        </header>

        <div className={styles.body}>
          {loading ? (
            <Loader message="Cargando bases legales..." />
          ) : (
            <div className={styles.content}>
              {content.split("\n").map((paragraph, index) =>
                paragraph.trim() ? (
                  <p key={index}>{paragraph}</p>
                ) : (
                  <br key={index} />
                )
              )}
            </div>
          )}

          {error && !loading && (
            <p className={styles.error} role="alert">
              {error}
            </p>
          )}
        </div>

        <footer className={styles.footer}>
          <label className={styles.checkbox}>
            <input
              type="checkbox"
              checked={accepted}
              onChange={(event) => setAccepted(event.target.checked)}
              disabled={loading || submitting || Boolean(error)}
            />
            <span>Acepto las bases legales del sorteo</span>
          </label>

          <div className={styles.actions}>
            <button
              type="button"
              className={`p-2 ${styles.cancelBtn}`}
              onClick={onClose}
              disabled={submitting}
            >
              Cancelar
            </button>
            <button
              type="button"
              className={`p-2 btn-primary ${styles.acceptBtn}`}
              onClick={onAccept}
              disabled={!accepted || loading || submitting || Boolean(error)}
            >
              {submitting ? "Registrando..." : "Aceptar y registrarme"}
            </button>
          </div>
        </footer>
      </div>
    </div>,
    document.body
  );
}
