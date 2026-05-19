export function filterOffersBySearch(offers, query) {
  const normalized = query.trim().toLowerCase();

  if (!normalized) {
    return offers;
  }

  return offers.filter((offer) => {
    const searchable = [
      offer.title,
      offer.description,
      offer.store,
      offer.discount,
      offer.category,
      offer.price,
      offer.oldPrice,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return searchable.includes(normalized);
  });
}
