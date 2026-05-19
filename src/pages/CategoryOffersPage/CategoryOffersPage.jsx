import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FaArrowLeft, FaGamepad } from "react-icons/fa";

import { getOffers } from "../../services/googleSheetService";
import { filterOffersBySearch } from "../../utils/filterOffersBySearch";
import { getOfferCategory } from "../../utils/offerCategory";
import Loader from "../../components/Loader/Loader";
import OfferCard from "../../components/OfferCard/OfferCard";
import OffersSearch from "../../components/OffersSearch/OffersSearch";
import StatusMessage from "../../components/StatusMessage/StatusMessage";
import styles from "./CategoryOffersPage.module.scss";

export default function CategoryOffersPage() {
  const { category: categoryParam } = useParams();

  const decodedCategory = decodeURIComponent(categoryParam || "");

  const categoryName =
    decodedCategory.toLowerCase() === "home"
      ? "Ofertas destacadas"
      : decodedCategory;

  const [offers, setOffers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
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

    loadOffers();
  }, []);

  const categoryOffers = useMemo(
    () =>
      offers.filter((offer) => {
        let category = getOfferCategory(offer);

        if (category.toLowerCase() === "home") {
          category = "Ofertas destacadas";
        }

        return category === categoryName;
      }),
    [offers, categoryName]
  );

  const filteredOffers = useMemo(
    () => filterOffersBySearch(categoryOffers, searchQuery),
    [categoryOffers, searchQuery]
  );

  const hasSearchQuery = searchQuery.trim().length > 0;

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <Link to="/ofertas" className={styles.back}>
          <FaArrowLeft /> Volver a ofertas
        </Link>

        <header className={styles.header}>
          <span className={styles.icon}>
            <FaGamepad />
          </span>

          <h1>{categoryName || "Categoría"}</h1>
        </header>

        {!loading && !message && categoryOffers.length > 0 && (
          <div className={styles.searchBar}>
            <OffersSearch
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Buscar en esta categoría..."
            />
          </div>
        )}

        {loading && <Loader message="Cargando ofertas..." />}

        {!loading && message && (
          <StatusMessage variant="error">{message}</StatusMessage>
        )}

        {!loading && !message && categoryOffers.length === 0 && (
          <StatusMessage>
            No hay ofertas en esta categoría por el momento.
          </StatusMessage>
        )}

        {!loading &&
          !message &&
          hasSearchQuery &&
          categoryOffers.length > 0 &&
          filteredOffers.length === 0 && (
            <StatusMessage>
              No se encontraron ofertas con &quot;{searchQuery.trim()}&quot;.
            </StatusMessage>
          )}

        {!loading && !message && filteredOffers.length > 0 && (
          <div className={styles.grid}>
            {filteredOffers.map((offer) => (
              <OfferCard key={offer.id} offer={offer} variant="page" />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

