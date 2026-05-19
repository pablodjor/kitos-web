export const THEME_STORAGE_KEY = "kitos-theme";

export function getStoredPreference() {
  const stored = localStorage.getItem(THEME_STORAGE_KEY);
  if (stored === "light" || stored === "dark" || stored === "system") {
    return stored;
  }
  return "light";
}

export function setStoredPreference(preference) {
  localStorage.setItem(THEME_STORAGE_KEY, preference);
}

export function getSystemTheme() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function resolveTheme(preference) {
  if (preference === "light" || preference === "dark") {
    return preference;
  }
  return getSystemTheme();
}

export function applyTheme(preference) {
  const resolved = resolveTheme(preference);
  const root = document.documentElement;

  root.setAttribute("data-theme", resolved);
  root.setAttribute("data-bs-theme", resolved);

  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) {
    meta.setAttribute("content", resolved === "dark" ? "#0f172a" : "#4897d8");
  }

  return resolved;
}

export function cyclePreference(current) {
  if (current === "system") return "light";
  if (current === "light") return "dark";
  return "system";
}

export function getPreferenceLabel(preference) {
  if (preference === "light") return "Modo claro";
  if (preference === "dark") return "Modo oscuro";
  return "Tema del sistema";
}

export function getNextPreferenceLabel(preference) {
  return getPreferenceLabel(cyclePreference(preference));
}
