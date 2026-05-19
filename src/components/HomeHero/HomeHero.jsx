import { FaYoutube, FaInstagram, FaFacebook } from "react-icons/fa";
import { SiTiktok } from "react-icons/si";
import { SOCIAL_URLS } from "../../constants/socialLinks";
import imageBanner from "./image/imageBanner2.png";
import styles from "./HomeHero.module.scss";

const externalLinkProps = {
  target: "_blank",
  rel: "noreferrer",
};

export default function HomeHero() {
  return (
    <section className={styles.hero}>
      <div className="container">
        <div className={`row ${styles.heroRow}`}>
          <div className={`col-12 col-lg-5 p-0 ${styles.heroImageCol}`}>
            <div className={styles.heroPerson}>
              <img
                src={imageBanner}
                alt="Banner Kitos"
                className={styles.heroImage}
              />
            </div>
          </div>

          <div className={`col-12 col-lg-7 ${styles.heroContentCol}`}>
            <div className={styles.content}>
              <h1>
                Ofertas en <span>videojuegos</span>
              </h1>

              <p>
                Las mejores ofertas en gaming.
              </p>

              <div className={styles.socials}>
                <a
                  href={SOCIAL_URLS.youtube}
                  aria-label="YouTube"
                  {...externalLinkProps}
                >
                  <FaYoutube />
                </a>
                <a
                  href={SOCIAL_URLS.tiktok}
                  aria-label="TikTok"
                  {...externalLinkProps}
                >
                  <SiTiktok />
                </a>
                <a
                  href={SOCIAL_URLS.instagram}
                  aria-label="Instagram"
                  {...externalLinkProps}
                >
                  <FaInstagram />
                </a>
                <a
                  href={SOCIAL_URLS.facebook}
                  aria-label="Facebook"
                  {...externalLinkProps}
                >
                  <FaFacebook />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
