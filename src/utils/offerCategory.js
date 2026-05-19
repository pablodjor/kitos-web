export function getOfferCategory(offer) {
  return offer.category?.trim() || "Otras ofertas";
}
