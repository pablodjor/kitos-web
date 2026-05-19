const REST_COUNTRIES_URL =
  "https://restcountries.com/v3.1/all?fields=name,translations,cca2";

let countriesCache = null;

export async function getCountries() {
  if (countriesCache) {
    return countriesCache;
  }

  const response = await fetch(REST_COUNTRIES_URL);

  if (!response.ok) {
    throw new Error("No se pudieron cargar los países");
  }

  const data = await response.json();

  countriesCache = data
    .map((country) => ({
      code: country.cca2,
      name:
        country.translations?.spa?.common ||
        country.name?.common ||
        country.cca2,
    }))
    .sort((a, b) => a.name.localeCompare(b.name, "es"));

  return countriesCache;
}
