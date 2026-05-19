import {
  FaYoutube,
  FaInstagram,
  FaTwitch,
  FaTelegramPlane,
  FaDiscord,
} from "react-icons/fa";
import { SiTiktok, SiThreads } from "react-icons/si";
import { SOCIAL_URLS } from "../../constants/socialLinks";
import BrandAvatar from "../BrandAvatar/BrandAvatar";
import styles from "./Footer.module.scss";

const socialLinks = [
  { label: "Youtube", icon: <FaYoutube />, href: SOCIAL_URLS.youtube },
  { label: "TikTok", icon: <SiTiktok />, href: SOCIAL_URLS.tiktok },
  { label: "Instagram", icon: <FaInstagram />, href: SOCIAL_URLS.instagram },
  { label: "Threads", icon: <SiThreads />, href: SOCIAL_URLS.threads },
  { label: "Twitch", icon: <FaTwitch />, href: SOCIAL_URLS.twitch },
  { label: "Telegram", icon: <FaTelegramPlane />, href: SOCIAL_URLS.telegram },
  { label: "Discord", icon: <FaDiscord />, href: SOCIAL_URLS.discord },
];

export default function Footer() {
  return (
    <footer className={styles.section}>
      <div className="container">
        <div className={styles.footer}>
          <div className="row g-4 align-items-start">
            <div className="col-12 col-lg-7">
              <BrandAvatar name="Kitos" size="large" className={styles.brand} />

              <p className={styles.description}>
                ¡Gracias por ser parte de la comunidad!
              </p>
            </div>

            <div className="col-12 col-lg-5">
              <div className={styles.links}>
                <h3>Comunidad</h3>

                <div className={styles.linkGrid}>
                  {socialLinks.map((link) => (
                    <a
                      key={link.label}
                      className="d-flex align-items-center"
                      href={link.href}
                      aria-label={link.label}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <span className="me-1">{link.icon}</span>
                      {link.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            <div className="col-12">
              <div className={styles.copy}>
                © 2026 Kitos. Todos los derechos reservados.
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
