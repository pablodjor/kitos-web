import { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import calendarioAdvientoImage from "../../assets/images/calendario_adviento.png";
import Loader from "../../components/Loader/Loader";
import PageSnow from "../../components/PageSnow/PageSnow";
import StatusMessage from "../../components/StatusMessage/StatusMessage";
import { getAdventCalendar } from "../../services/googleSheetService";
import {
  applyRevealState,
  formatCountdown,
  getRemainingMs,
  normalizeAdventCalendarDays,
} from "../../utils/adventCalendar";
import styles from "./CalendarioAdviento.module.scss";

const STORAGE_KEY = "kitos-opened-days";

const GOLD_CONFETTI_COLORS = [
  "#FFD700",
  "#FFC107",
  "#FDB931",
  "#FFE066",
  "#D4AF37",
  "#FFEC8B",
];

const GOLD_CONFETTI_BASE = {
  colors: GOLD_CONFETTI_COLORS,
  shapes: ["square"],
  scalar: 1.05,
  ticks: 220,
  gravity: 0.9,
  decay: 0.92,
};

function CalendarioAdviento() {
  const [calendarDays, setCalendarDays] = useState([]);
  const [selectedDay, setSelectedDay] = useState(null);
  const [openedDays, setOpenedDays] = useState([]);
  const [openingDay, setOpeningDay] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      const currentNow = Date.now();
      setNow(currentNow);
      setCalendarDays((prevDays) =>
        prevDays.map((item) => applyRevealState(item, currentNow))
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const savedDays = localStorage.getItem(STORAGE_KEY);

    if (!savedDays) return;

    try {
      setOpenedDays(JSON.parse(savedDays));
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    async function loadCalendar() {
      try {
        setIsLoading(true);
        setErrorMessage("");

        const days = await getAdventCalendar();
        setCalendarDays(normalizeAdventCalendarDays(days));
      } catch (error) {
        console.error("Error cargando calendario:", error);
        setErrorMessage("No pudimos cargar el calendario. Intentá nuevamente.");
        setCalendarDays([]);
      } finally {
        setIsLoading(false);
      }
    }

    loadCalendar();
  }, []);

  const launchConfetti = () => {
    confetti({
      ...GOLD_CONFETTI_BASE,
      particleCount: 120,
      spread: 80,
      origin: { y: 0.65 },
    });

    setTimeout(() => {
      confetti({
        ...GOLD_CONFETTI_BASE,
        particleCount: 80,
        spread: 120,
        origin: { x: 0.2, y: 0.55 },
      });
    }, 250);

    setTimeout(() => {
      confetti({
        ...GOLD_CONFETTI_BASE,
        particleCount: 80,
        spread: 120,
        origin: { x: 0.8, y: 0.55 },
      });
    }, 450);
  };

  const saveOpenedDay = (day) => {
    setOpenedDays((prevDays) => {
      const updatedDays = Array.from(new Set([...prevDays, day]));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedDays));
      return updatedDays;
    });
  };

  const handleOpenDay = (item) => {
    const isAvailable = item.canReveal && !item.locked;
    const isOpened = openedDays.includes(item.day);

    if (!isAvailable) return;

    if (isOpened) {
      setSelectedDay(item);
      return;
    }

    setOpeningDay(item.day);
    saveOpenedDay(item.day);
    launchConfetti();

    setTimeout(() => {
      setOpeningDay(null);
    }, 900);
  };

  const closeModal = () => {
    setSelectedDay(null);
  };

  return (
    <main className={styles.page}>
      <PageSnow />

      {isLoading ? (
        <Loader message="Cargando calendario..." />
      ) : (
        <>
          <section className={styles.hero}>
            <div className={styles.heroContent}>
              <span className={styles.heroBadge}>Navidad Kitos</span>

              <h1 className={styles.heroTitle}>
                Calendario de <span>Adviento</span>
              </h1>

              <p className={styles.heroDescription}>
                Cada día se desbloquea una puerta. Tocá el número, descubrí el
                regalo y conocé al ganador.
              </p>
            </div>

            <div className={styles.heroGift}>
              <img
                src={calendarioAdvientoImage}
                alt="Calendario de adviento Kitos"
                className={styles.heroImage}
              />
            </div>
            <div className={styles.heroJoyStrip} aria-hidden="true" />
          </section>

          <section className={styles.calendarSection}>
            {errorMessage && (
              <p className={styles.errorMessage}>{errorMessage}</p>
            )}

            {!errorMessage && calendarDays.length === 0 && (
              <StatusMessage>
                No hay días activos configurados en el calendario.
              </StatusMessage>
            )}

            {calendarDays.length > 0 && (
              <div className={styles.calendarGrid}>
                {calendarDays.map((item) => {
                  const isAvailable = item.canReveal && !item.locked;
                  const isOpened = isAvailable && openedDays.includes(item.day);
                  const isOpening = openingDay === item.day;
                  const remainingMs = !isAvailable
                    ? getRemainingMs(item.revealFrom, now)
                    : null;
                  const countdown = formatCountdown(remainingMs);

                  return (
                    <button
                      key={item.day}
                      type="button"
                      className={`${styles.calendarCard} ${
                        isAvailable ? styles.isAvailable : styles.isLocked
                      } ${isOpened ? styles.isOpened : ""} ${
                        isOpening ? styles.isOpening : ""
                      }`}
                      onClick={() => handleOpenDay(item)}
                      disabled={!isAvailable}
                    >
                      {!isOpened ? (
                        <div className={styles.calendarCardClosed}>
                          <span className={styles.calendarCardLabel}>
                            {!isAvailable ? "Bloqueado" : "Abrir"}
                          </span>

                          <span className={styles.calendarCardNumber}>
                            {item.day}
                          </span>

                          <div className={styles.calendarCardClosedFooter}>
                            <div className={styles.calendarCardGift}>🎁</div>

                            {!isAvailable && countdown ? (
                              <p className={styles.calendarCardCountdown}>
                                <span>Se abre en</span>
                                <strong>{countdown}</strong>
                              </p>
                            ) : (
                              <p>
                                {!isAvailable
                                  ? "Próximamente"
                                  : "Tocá para abrir"}
                              </p>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className={styles.calendarCardOpened}>
                          <span className={styles.calendarCardNumberMini}>
                            Día {item.day}
                          </span>

                          <span className={styles.calendarCardRevealed}>
                            ✨ Revelado
                          </span>

                          <div className={styles.calendarCardImage}>
                            {item.image ? (
                              <img
                                src={item.image}
                                alt={item.prize || `Premio día ${item.day}`}
                              />
                            ) : (
                              <span>🎁</span>
                            )}
                          </div>

                          <div className={styles.calendarCardInfo}>
                            <h3>{item.prize || "Premio pendiente"}</h3>

                            <span className={styles.calendarCardWinner}>
                              🏆 {item.winner || "Pendiente"}
                            </span>
                          </div>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </section>

          {selectedDay && (
            <div className={styles.modalOverlay} onClick={closeModal}>
              <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <button
                  type="button"
                  className={styles.modalClose}
                  onClick={closeModal}
                >
                  ×
                </button>

                <div className={styles.modalImage}>
                  {selectedDay.image ? (
                    <img
                      src={selectedDay.image}
                      alt={selectedDay.prize || `Premio día ${selectedDay.day}`}
                    />
                  ) : (
                    <span>🎁</span>
                  )}
                </div>

                <div className={styles.modalContent}>
                  <span>Día {selectedDay.day}</span>

                  <h2>{selectedDay.prize || "Premio pendiente"}</h2>

                  <p>
                    Este es el premio del sorteo diario del calendario navideño
                    de Kitos.
                  </p>

                  <div className={styles.winner}>
                    🏆 Ganador:{" "}
                    <strong>
                      {selectedDay.winner || "Pendiente de cargar"}
                    </strong>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </main>
  );
}

export default CalendarioAdviento;
