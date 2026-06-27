import { LuBadgePercent, LuTicket } from "react-icons/lu";

import { formatPrice } from "../../utils/formatPrice";
import styles from "./OfferCard.module.scss";

export default function OfferCard({ offer, variant = "home" }) {
  const discountLabel = offer.discount || (variant === "home" ? "Oferta" : null);
  const formattedPrice = formatPrice(offer.price);
  const formattedOldPrice = formatPrice(offer.oldPrice);

  if (variant === "page") {
    return (
      <article className={styles.page}>
        {discountLabel && <span className={styles.discount}>{discountLabel}</span>}

        <div className={styles.imageBox}>
          {offer.image ? (
            <img src={offer.image} alt={offer.title} />
          ) : (
            <div className={styles.noImage}>Sin imagen</div>
          )}
        </div>

        <div className={styles.content}>
          <div className={styles.meta}>
            <h2>{offer.title}</h2>
            {offer.description ? (
              <p className={styles.code}>
                <LuTicket aria-hidden="true" />
                <span>{offer.description}</span>
              </p>
            ) : (
              <p className={styles.codePlaceholder} aria-hidden="true">
                {"\u00A0"}
              </p>
            )}
          </div>

          {offer.store && (
            <span className={styles.store}>
              <LuBadgePercent />
              {offer.store}
            </span>
          )}

          <div className={styles.priceRow}>
            {formattedPrice && (
              <strong className={styles.price}>{formattedPrice}</strong>
            )}
            {formattedOldPrice && (
              <span className={styles.oldPrice}>{formattedOldPrice}</span>
            )}
          </div>

          <a
            href={offer.link}
            target="_blank"
            rel="noreferrer"
            className={styles.button}
          >
            Ver oferta
          </a>
        </div>
      </article>
    );
  }

  return (
    <article className={styles.home}>
      {discountLabel && <span className={styles.discount}>{discountLabel}</span>}

      <div className={styles.imageBox}>
        {offer.image ? (
          <img src={offer.image} alt={offer.title} />
        ) : (
          <span>Sin imagen</span>
        )}
      </div>

      <div className={styles.content}>
        <div className={styles.meta}>
          <h3>{offer.title}</h3>
          {offer.description ? (
            <p className={styles.code}>
              <LuTicket aria-hidden="true" />
              <span>{offer.description}</span>
            </p>
          ) : (
            <p className={styles.codePlaceholder} aria-hidden="true">
              {"\u00A0"}
            </p>
          )}
        </div>

        <div className={styles.priceRow}>
          {formattedPrice && (
            <strong className={styles.price}>{formattedPrice}</strong>
          )}
          {formattedOldPrice && (
            <span className={styles.oldPrice}>{formattedOldPrice}</span>
          )}
        </div>
      </div>

      <a href={offer.link} target="_blank" rel="noreferrer">
        Ver oferta
      </a>
    </article>
  );
}


