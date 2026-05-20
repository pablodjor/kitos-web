import { useState } from "react";
import { getParticipations } from "../../services/googleSheetService";
import AlertMessage from "../../components/AlertMessage/AlertMessage";
import styles from "./MisParticipacionesPage.module.scss";

export default function MisParticipacionesPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [participations, setParticipations] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");
    setMessageType("");
    setParticipations(null);

    try {
      const data = await getParticipations({ email });

      setMessage(data.message || "Consulta realizada correctamente.");
      setMessageType("success");
      setParticipations(data.participations);
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
          <span className={styles.badge}>Sorteo activo</span>

          <h1>Tus participaciones</h1>

          <p>
            Introduce el correo electrónico con el que te registraste para consultar
            cuántas participaciones tienes acumuladas.
          </p>
        </div>

        <form className="form-stack" onSubmit={handleSubmit}>
          <label className="form-field">
            <span>Email</span>

            <input
              type="email"
              name="email"
              placeholder="Ej: tuemail@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              maxLength={50}
              required
            />
          </label>

          <button
            className={`btn-primary ${styles.submitBtn}`}
            type="submit"
            disabled={loading}
          >
            {loading ? "Consultando..." : "Consultar participaciones"}
          </button>
        </form>

        <AlertMessage type={messageType}>
          {message}
        </AlertMessage>

        {participations !== null && (
          <div className={styles.participations}>
            Participaciones acumuladas:{" "}
            <strong>{participations}</strong>
          </div>
        )}
      </section>
    </div>
  );
}
