export async function getCountries() {
  const response = await fetch(
    "https://countriesnow.space/api/v0.1/countries/positions"
  );

  if (!response.ok) {
    throw new Error("No se pudieron cargar los países");
  }

  const result = await response.json();

  return result.data
    .map((country) => ({
      name: country.name,
      code: country.iso2,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}