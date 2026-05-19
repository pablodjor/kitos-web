import { useState } from "react";
import { redeemCode } from "../../services/googleSheetService";
import AlertMessage from "../../components/AlertMessage/AlertMessage";
import styles from "./CodePage.module.scss";

export default function CodePage() {
  const [form, setForm] = useState({
    email: "",
    code: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [participations, setParticipations] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");
    setMessageType("");
    setParticipations(null);

    try {
      const data = await redeemCode({
        email: form.email,
        code: form.code,
      });

      setMessage(data.message);
      setMessageType("success");
      setParticipations(data.participations);

      setForm({
        email: "",
        code: "",
      });
    } catch (error) {
      setMessage(error.message);
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <section className={styles.card}>
        <div className={styles.header}>
          <span className={styles.badge}>Código Sorteo</span>

          <h1>Gana participaciones</h1>

          <p>
            Ingresá tu email registrado y el código del sorteo.
          </p>
        </div>

        <form className="form-stack" onSubmit={handleSubmit}>
          <label className="form-field">
            <span>Email</span>

            <input
              type="email"
              name="email"
              placeholder="Ej: tuemail@gmail.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </label>

          <label className="form-field">
            <span>Código sorteo</span>

            <input
              type="text"
              name="code"
              placeholder="Ej: ABC123"
              value={form.code}
              onChange={handleChange}
              required
            />
          </label>

          <button
            className={`btn-primary ${styles.submitBtn}`}
            type="submit"
            disabled={loading}
          >
            {loading ? "Validando..." : "Cargar código"}
          </button>
        </form>

        <AlertMessage type={messageType}>
          {message}
        </AlertMessage>

        {participations !== null && (
          <div className={styles.participations}>
            🎟️ Participaciones actuales: <strong>{participations}</strong>
          </div>
        )}
      </section>
    </div>
  );
}