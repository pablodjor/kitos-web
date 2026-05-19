import { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";

import { getOffers } from "../../services/googleSheetService";
import Loader from "../Loader/Loader";
import SectionHeader from "../SectionHeader/SectionHeader";
import StatusMessage from "../StatusMessage/StatusMessage";
import OfferCard from "../OfferCard/OfferCard";
import SwiperArrow from "../SwiperArrow/SwiperArrow";
import styles from "./LatestOffers.module.scss";

export default function LatestOffers() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  const swiperRef = useRef(null);

  useEffect(() => {
    async function loadOffers() {
      try {
        const data = await getOffers();
        const homeOffers = data.filter(
          (offer) => offer.category?.trim().toLowerCase() === "home"
        );
        setOffers(homeOffers);
      } catch {
        setOffers([]);
      } finally {
        setLoading(false);
      }
    }

    loadOffers();
  }, []);

  const showArrows = offers.length > 4;

  return (
    <section className={styles.section}>
      <div className="container">
        <SectionHeader title="🔥 Últimas ofertas" linkTo="/ofertas" />

        {loading && <Loader message="Cargando ofertas..." />}

        {!loading && offers.length === 0 && (
          <StatusMessage>No hay ofertas activas por el momento.</StatusMessage>
        )}

        {!loading && offers.length > 0 && (
          <div className={styles.swiperWrap}>
            {showArrows && !isBeginning && (
              <SwiperArrow
                direction="prev"
                onClick={() => swiperRef.current?.slidePrev()}
              />
            )}

            <Swiper
              onSwiper={(swiper) => {
                swiperRef.current = swiper;
                setIsBeginning(swiper.isBeginning);
                setIsEnd(swiper.isEnd);
              }}
              onSlideChange={(swiper) => {
                setIsBeginning(swiper.isBeginning);
                setIsEnd(swiper.isEnd);
              }}
              spaceBetween={18}
              slidesPerView={1.1}
              className={styles.swiper}
              breakpoints={{
                650: { slidesPerView: 2 },
                900: { slidesPerView: 3 },
                1200: { slidesPerView: 4 },
              }}
            >
              {offers.map((offer) => (
                <SwiperSlide key={offer.id}>
                  <OfferCard offer={offer} variant="home" />
                </SwiperSlide>
              ))}
            </Swiper>

            {showArrows && !isEnd && (
              <SwiperArrow
                direction="next"
                onClick={() => swiperRef.current?.slideNext()}
              />
            )}
          </div>
        )}
      </div>
    </section>
  );
}
