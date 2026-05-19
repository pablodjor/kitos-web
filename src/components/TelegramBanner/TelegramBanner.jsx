import { FaTelegramPlane } from "react-icons/fa";
import { SOCIAL_URLS } from "../../constants/socialLinks";
import styles from "./TelegramBanner.module.scss";

export default function TelegramBanner() {
    return (
        <section className={styles.section}>
            <div className="container">
                <div className={styles.banner}>
                    <div className="row align-items-center g-4">
                        <div className="col-12 col-md-auto text-center">
                            <div className={styles.icon}>
                                <FaTelegramPlane />
                            </div>
                        </div>

                        <div className="col-12 col-md">
                            <div className={styles.text}>
                                <h2>Ofertas en tiempo real</h2>
                                <p>
                                    En nuestro canal de Telegram tienes las mejores ofertas de
                                    videojuegos en tiempo real.
                                </p>
                            </div>
                        </div>

                        <div className="col-12 col-md-auto text-center">
                            <a
                                href={SOCIAL_URLS.telegram}
                                className={styles.button}
                                target="_blank"
                                rel="noreferrer"
                            >
                                Unite a Telegram
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}