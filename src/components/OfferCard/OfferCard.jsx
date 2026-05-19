import { LuBadgePercent } from "react-icons/lu";

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
          <h2>{offer.title}</h2>

          {offer.description && (
            <p className={styles.description}>{offer.description}</p>
          )}

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

      <h3>{offer.title}</h3>

      {offer.description && <p>{offer.description}</p>}

      {(formattedPrice || formattedOldPrice) && (
        <div className={styles.priceRow}>
          {formattedPrice && (
            <strong className={styles.price}>{formattedPrice}</strong>
          )}
          {formattedOldPrice && (
            <span className={styles.oldPrice}>{formattedOldPrice}</span>
          )}
        </div>
      )}

      <a href={offer.link} target="_blank" rel="noreferrer">
        Ver oferta
      </a>
    </article>
  );
}


