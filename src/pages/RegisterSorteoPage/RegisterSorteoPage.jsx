import { useEffect, useMemo, useState } from "react";
import { getCountries } from "../../services/countriesService";
import {
  getRaffleConfig,
  registerUser,
} from "../../services/googleSheetService";
import AlertMessage from "../../components/AlertMessage/AlertMessage";
import Loader from "../../components/Loader/Loader";
import styles from "./RegisterSorteoPage.module.scss";

export default function RegisterSorteoPage() {
  const [form, setForm] = useState({ name: "", email: "", country: "" });
  const [countries, setCountries] = useState([]);
  const [raffleConfig, setRaffleConfig] = useState(null);
  const [loadingConfig, setLoadingConfig] = useState(true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  useEffect(() => {
    async function loadInitialData() {
      setLoadingConfig(true);

      try {
        const [config, countriesList] = await Promise.all([
          getRaffleConfig(),
          getCountries(),
        ]);
        setRaffleConfig(config);
        setCountries(countriesList);
      } catch (error) {
        console.error(error.message);
      } finally {
        setLoadingConfig(false);
      }
    }

    loadInitialData();
  }, []);

  const isRaffleExpired = useMemo(() => {
    if (!raffleConfig?.endDate) return true;

    const endDate = new Date(raffleConfig.endDate);
    const now = new Date();

    return endDate.getTime() <= now.getTime();
  }, [raffleConfig]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isRaffleExpired) {
      setMessage("El sorteo ya finalizó. No es posible registrarse.");
      setMessageType("error");
      return;
    }

    setLoading(true);
    setMessage("");
    setMessageType("");

    try {
      const data = await registerUser({
        name: form.name,
        email: form.email,
        country: form.country,
      });

      setMessage(data.message);
      setMessageType("success");
      setForm({ name: "", email: "", country: "" });
    } catch (error) {
      setMessage(error.message);
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  const isDisabled = loading || loadingConfig || isRaffleExpired;

  if (loadingConfig) {
    return (
      <div className={styles.page}>
        <Loader message="Cargando sorteo..." />
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <section className={styles.card}>
        {raffleConfig?.image && (
          <div className={styles.prizeImage}>
            <img
              src={raffleConfig.image}
              alt={raffleConfig.title || "Premio del sorteo"}
            />
          </div>
        )}

        <div className={styles.header}>
          <span className={styles.badge}>
            {isRaffleExpired ? "Sorteo finalizado" : "Registro sorteo"}
          </span>

          <h1>{raffleConfig?.title}</h1>

          <p>
            {isRaffleExpired
              ? "Este sorteo ya finalizó. Ya no se aceptan nuevas participaciones."
              : raffleConfig?.description}
          </p>
        </div>

        <form className="form-stack" onSubmit={handleSubmit}>
          <label className="form-field">
            <input
              type="text"
              name="name"
              placeholder="Nombre y apellido"
              value={form.name}
              onChange={handleChange}
              required
              disabled={isDisabled}
            />
          </label>

          <label className="form-field">
            <input
              type="email"
              name="email"
              placeholder="Tu email"
              value={form.email}
              onChange={handleChange}
              required
              disabled={isDisabled}
            />
          </label>

          <label className="form-field">
            <select
              name="country"
              value={form.country}
              onChange={handleChange}
              required
              disabled={isDisabled}
            >
              <option value="" disabled>
                Seleccioná tu país
              </option>
              {countries.map((country) => (
                <option key={country.code} value={country.name}>
                  {country.name}
                </option>
              ))}
            </select>
          </label>

          <button
            className={`btn-primary ${styles.submitBtn}`}
            type="submit"
            disabled={isDisabled}
          >
            {isRaffleExpired
              ? "Sorteo finalizado"
              : loading
                ? "Guardando..."
                : "Registrarme"}
          </button>
        </form>

        <AlertMessage type={messageType}>{message}</AlertMessage>

        <div className={styles.infoBox}>
          <div className={styles.infoIcon}>?</div>

          <div className={styles.infoContent}>
            <h2>
              {isRaffleExpired ? "Registro cerrado" : "¿Cómo participo?"}
            </h2>

            <p>
              {isRaffleExpired
                ? "La fecha límite para registrarse en este sorteo ya pasó."
                : "Registrate con tu nombre y email. Después vas a poder sumar más participaciones usando códigos secretos."}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}