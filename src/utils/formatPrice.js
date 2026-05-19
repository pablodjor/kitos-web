export function formatPrice(value) {
  if (value == null) return "";

  const raw = String(value).trim();
  if (!raw) return "";

  const amount = raw
    .replace(/\s*€\s*/g, "")
    .replace(/\$/g, "")
    .trim();

  if (!amount) return raw;

  return `${amount} €`;
}
