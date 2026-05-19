import { useEffect, useMemo, useState } from "react";
import { getCountries } from "../../services/countriesService";
import {
  getLegalBases,
  getRaffleConfig,
  registerUser,
} from "../../services/googleSheetService";
import AlertMessage from "../../components/AlertMessage/AlertMessage";
import CountryAutocomplete from "../../components/CountryAutocomplete/CountryAutocomplete";
import LegalBasesModal from "../../components/LegalBasesModal/LegalBasesModal";
import Loader from "../../components/Loader/Loader";
import styles from "./RegisterSorteoPage.module.scss";

export default function RegisterSorteoPage() {
  const [form, setForm] = useState({ name: "", email: "", country: "" });
  const [countries, setCountries] = useState([]);
  const [raffleConfig, setRaffleConfig] = useState(null);
  const [legalBases, setLegalBases] = useState(null);
  const [loadingConfig, setLoadingConfig] = useState(true);
  const [loading, setLoading] = useState(false);
  const [loadingLegalBases, setLoadingLegalBases] = useState(false);
  const [legalBasesError, setLegalBasesError] = useState("");
  const [isLegalModalOpen, setIsLegalModalOpen] = useState(false);
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

  const winnerName = useMemo(() => {
    const name =
      raffleConfig?.ganador ??
      raffleConfig?.Ganador ??
      raffleConfig?.winner ??
      "";

    return typeof name === "string" ? name.trim() : "";
  }, [raffleConfig]);

  const hasWinner = winnerName.length > 0;

  const isRaffleExpired = useMemo(() => {
    if (!raffleConfig?.endDate) return true;

    const endDate = new Date(raffleConfig.endDate);
    const now = new Date();

    return endDate.getTime() <= now.getTime();
  }, [raffleConfig]);

  const isRegistrationClosed = isRaffleExpired || hasWinner;

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCountryChange = (country) => {
    setForm((prev) => ({
      ...prev,
      country,
    }));
  };

  const validateForm = () => {
    if (hasWinner) {
      setMessage(
        `El sorteo ya tiene ganador (${winnerName}). No es posible registrarse.`
      );
      setMessageType("error");
      return false;
    }

    if (isRaffleExpired) {
      setMessage("El sorteo ya finalizó. No es posible registrarse.");
      setMessageType("error");
      return false;
    }

    const isValidCountry = countries.some(
      (country) => country.name === form.country
    );

    if (!form.country || !isValidCountry) {
      setMessage("Seleccioná un país válido de la lista.");
      setMessageType("error");
      return false;
    }

    return true;
  };

  const loadLegalBases = async () => {
    if (legalBases !== null) {
      return legalBases;
    }

    setLoadingLegalBases(true);
    setLegalBasesError("");

    try {
      const bases = await getLegalBases();
      setLegalBases(bases);
      return bases;
    } catch (error) {
      setLegalBasesError(error.message);
      throw error;
    } finally {
      setLoadingLegalBases(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setMessage("");
    setMessageType("");
    setIsLegalModalOpen(true);

    try {
      await loadLegalBases();
    } catch {
      // El error se muestra dentro del modal.
    }
  };

  const handleCloseLegalModal = () => {
    if (loading) {
      return;
    }

    setIsLegalModalOpen(false);
    setLegalBasesError("");
  };

  const handleAcceptLegalBases = async () => {
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
      setIsLegalModalOpen(false);
    } catch (error) {
      setMessage(error.message);
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  const isDisabled = loading || loadingConfig || isRegistrationClosed;

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
            {isRegistrationClosed ? "Sorteo finalizado" : "Registro sorteo"}
          </span>

          <h1>{raffleConfig?.title}</h1>

          <p>
            {hasWinner
              ? `¡Felicidades ${winnerName}! El sorteo ya tiene ganador y no se aceptan nuevas participaciones.`
              : isRaffleExpired
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
            <CountryAutocomplete
              countries={countries}
              value={form.country}
              onChange={handleCountryChange}
              disabled={isDisabled}
              required
            />
          </label>

          <button
            className={`btn-primary ${styles.submitBtn}`}
            type="submit"
            disabled={isDisabled}
          >
            {isRegistrationClosed
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
              {isRegistrationClosed ? "Registro cerrado" : "¿Cómo participo?"}
            </h2>

            <p>
              {hasWinner
                ? "Este sorteo ya se realizó y tenemos un ganador. No se pueden registrar nuevos participantes."
                : isRaffleExpired
                  ? "La fecha límite para registrarse en este sorteo ya pasó."
                  : "Registrate con tu nombre y email. Después vas a poder sumar más participaciones usando códigos secretos."}
            </p>
          </div>
        </div>
      </section>

      <LegalBasesModal
        isOpen={isLegalModalOpen}
        legalBases={legalBases}
        loading={loadingLegalBases}
        submitting={loading}
        error={legalBasesError}
        onClose={handleCloseLegalModal}
        onAccept={handleAcceptLegalBases}
      />
    </div>
  );
}
