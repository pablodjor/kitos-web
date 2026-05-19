import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { FaArrowRight, FaGamepad } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";

import { getOffers } from "../../services/googleSheetService";
import { getOfferCategory } from "../../utils/offerCategory";
import Loader from "../../components/Loader/Loader";
import OfferCard from "../../components/OfferCard/OfferCard";
import SwiperArrow from "../../components/SwiperArrow/SwiperArrow";
import StatusMessage from "../../components/StatusMessage/StatusMessage";
import styles from "./OffersPage.module.scss";

export default function OffersPage() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const loadOffers = async () => {
    setLoading(true);
    setMessage("");

    try {
      const data = await getOffers();
      setOffers(data);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOffers();
  }, []);

  const offersByCategory = useMemo(() => {
    const grouped = {};

    offers.forEach((offer) => {
      let category = getOfferCategory(offer);

      if (category.toLowerCase() === "home") {
        category = "Ofertas destacadas";
      }

      if (!grouped[category]) {
        grouped[category] = [];
      }

      grouped[category].push(offer);
    });

    return Object.entries(grouped)
      .map(([title, categoryOffers]) => ({
        title,
        offers: categoryOffers,
      }))
      .sort((a, b) => {
        if (a.title === "Otras ofertas") return 1;
        if (b.title === "Otras ofertas") return -1;
        return 0;
      });
  }, [offers]);

  return (
    <div className={styles.page}>
      {loading && <Loader message="Cargando ofertas..." />}

      {!loading && message && (
        <StatusMessage variant="error">{message}</StatusMessage>
      )}

      {!loading && !message && offers.length === 0 && (
        <StatusMessage>No hay ofertas activas por el momento.</StatusMessage>
      )}

      {!loading &&
        !message &&
        offersByCategory.map((category) => (
          <section className={styles.categoryBlock} key={category.title}>
            <div className={styles.categoryHeader}>
              <div className={styles.titleBox}>
                <span className={styles.icon}>
                  <FaGamepad />
                </span>
                <h3>{category.title}</h3>
              </div>

              <Link
                to={`/ofertas/${encodeURIComponent(category.title)}`}
                className={styles.viewAll}
              >
                Ver todas las ofertas <FaArrowRight />
              </Link>
            </div>

            <div className={styles.heroSwiper}>
              <Swiper
                modules={[Navigation]}
                navigation={{
                  nextEl: ".custom-next",
                  prevEl: ".custom-prev",
                }}
                spaceBetween={18}
                slidesPerView={1.1}
                breakpoints={{
                  650: { slidesPerView: 2 },
                  900: { slidesPerView: 3 },
                  1200: { slidesPerView: 4 },
                }}
              >
                {category.offers.map((offer) => (
                  <SwiperSlide key={`${category.title}-${offer.id}`}>
                    <OfferCard offer={offer} variant="page" />
                  </SwiperSlide>
                ))}
              </Swiper>

              <SwiperArrow direction="prev" as="div" className="custom-prev" />
              <SwiperArrow direction="next" as="div" className="custom-next" />
            </div>
          </section>
        ))}
    </div>
  );
}