import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { FaArrowRight, FaClipboardList, FaGift } from "react-icons/fa";
import { LuTicket } from "react-icons/lu";

import Loader from "../../components/Loader/Loader";
import { getRaffleConfig } from "../../services/googleSheetService";
import { launchWinnerCelebration } from "../../utils/raffleWinnerEffects";

import styles from "./SorteosPage.module.scss";

export default function SorteosPage() {
    const [raffleConfig, setRaffleConfig] = useState(null);
    const [loading, setLoading] = useState(true);
    const [now, setNow] = useState(new Date());

    useEffect(() => {
        async function loadConfig() {
            setLoading(true);

            try {
                const data = await getRaffleConfig();
                setRaffleConfig(data);
            } catch (error) {
                console.error(error.message);
            } finally {
                setLoading(false);
            }
        }

        loadConfig();
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

    useEffect(() => {
        if (!hasWinner || loading) return undefined;

        launchWinnerCelebration();
    }, [hasWinner, loading]);

    useEffect(() => {
        if (hasWinner) return undefined;

        const interval = setInterval(() => {
            setNow(new Date());
        }, 1000);

        return () => clearInterval(interval);
    }, [hasWinner]);

    const endDate = useMemo(() => {
        if (!raffleConfig?.endDate) return null;

        return new Date(raffleConfig.endDate);
    }, [raffleConfig]);

    const countdown = useMemo(() => {
        if (!endDate) {
            return {
                expired: true,
                days: "00",
                hours: "00",
                minutes: "00",
                seconds: "00",
            };
        }

        const diff = endDate.getTime() - now.getTime();

        if (diff <= 0) {
            return {
                expired: true,
                days: "00",
                hours: "00",
                minutes: "00",
                seconds: "00",
            };
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));

        const hours = Math.floor(
            (diff / (1000 * 60 * 60)) % 24
        );

        const minutes = Math.floor(
            (diff / (1000 * 60)) % 60
        );

        const seconds = Math.floor(
            (diff / 1000) % 60
        );

        return {
            expired: false,
            days: String(days).padStart(2, "0"),
            hours: String(hours).padStart(2, "0"),
            minutes: String(minutes).padStart(2, "0"),
            seconds: String(seconds).padStart(2, "0"),
        };
    }, [endDate, now]);

    if (loading) {
        return (
            <div className={styles.page}>
                <Loader message="Cargando sorteo..." />
            </div>
        );
    }

    return (
        <div className={styles.page}>
            <section className={styles.categoryBlock}>
                <div className={styles.categoryHeader}>
                    <div className={styles.titleBox}>
                        <span className={styles.icon}>
                            <FaGift />
                        </span>

                        <div>
                            <span className={styles.eyebrow}>
                                Sorteo activo
                            </span>

                            <h3>
                                {raffleConfig?.title}
                            </h3>
                        </div>
                    </div>
                </div>

                {raffleConfig?.description && (
                    <p className={styles.description}>
                        {raffleConfig.description}
                    </p>
                )}

                <div className={styles.raffleBody}>
                    {raffleConfig?.image && (
                        <div className={styles.imageContainer}>
                            <img
                                src={raffleConfig.image}
                                alt={raffleConfig.title}
                            />
                        </div>
                    )}

                    <div className={styles.actions}>
                        {hasWinner ? (
                            <div className={styles.winnerMessage}>
                                <span className={styles.winnerEmoji} aria-hidden="true">
                                    🎉
                                </span>
                                <p className={styles.winnerTitle}>
                                    ¡Felicidades{" "}
                                    <strong>{winnerName}</strong>!
                                </p>
                                <p className={styles.winnerSubtitle}>
                                    Ganaste el sorteo
                                </p>
                            </div>
                        ) : (
                            <>
                                <span className={styles.label}>
                                    Finaliza en
                                </span>

                                <div className={styles.timer}>
                            <div className={styles.timerItem}>
                                <strong>{countdown.days}</strong>
                                <span>Días</span>
                            </div>

                            <div className={styles.timerItem}>
                                <strong>{countdown.hours}</strong>
                                <span>Horas</span>
                            </div>

                            <div className={styles.timerItem}>
                                <strong>{countdown.minutes}</strong>
                                <span>Minutos</span>
                            </div>

                            <div className={styles.timerItem}>
                                <strong>{countdown.seconds}</strong>
                                <span>Segundos</span>
                            </div>
                                </div>
                            </>
                        )}

                        {!hasWinner && !countdown.expired ? (
                            <Link
                                to="/registro"
                                className={styles.primaryBtn}
                            >
                                <FaGift />
                                Participar ahora
                            </Link>
                        ) : (
                            <button
                                className={styles.primaryBtn}
                                disabled
                            >
                                Sorteo finalizado
                            </button>
                        )}
                    </div>
                </div>
            </section>

            <div className={styles.actionGrid}>
                <article
                    className={`${styles.actionCard} ${styles.actionCardPrimary}`}
                >
                    <span className={styles.actionIcon}>
                        <LuTicket />
                    </span>

                    <div className={styles.actionBody}>
                        <h4>Canjear código</h4>
                        <p>
                            Introduce códigos secretos y suma más
                            participaciones al sorteo.
                        </p>
                    </div>

                    <Link to="/codigo" className={styles.actionBtn}>
                        <LuTicket />
                        Código secreto
                        <FaArrowRight />
                    </Link>
                </article>

                <article
                    className={`${styles.actionCard} ${styles.actionCardAccent}`}
                >
                    <span className={styles.actionIcon}>
                        <FaClipboardList />
                    </span>

                    <div className={styles.actionBody}>
                        <h4>Mis participaciones</h4>
                        <p>
                            Consulta cuántas participaciones tienes
                            acumuladas con tu correo.
                        </p>
                    </div>

                    <Link
                        to="/mis-participaciones"
                        className={styles.actionBtn}
                    >
                        <FaClipboardList />
                        Ver participaciones
                        <FaArrowRight />
                    </Link>
                </article>
            </div>
        </div>
    );
}