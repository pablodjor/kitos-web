import { createContext, useContext, useEffect, useMemo, useState } from "react";

import {
  applyTheme,
  cyclePreference,
  getStoredPreference,
  resolveTheme,
  setStoredPreference,
} from "../utils/theme";

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [preference, setPreference] = useState(() => getStoredPreference());
  const resolved = useMemo(() => resolveTheme(preference), [preference]);

  useEffect(() => {
    applyTheme(preference);
  }, [preference]);

  useEffect(() => {
    if (preference !== "system") return undefined;

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => applyTheme("system");

    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, [preference]);

  const cycleTheme = () => {
    const next = cyclePreference(preference);
    setStoredPreference(next);
    setPreference(next);
  };

  return (
    <ThemeContext.Provider value={{ preference, resolved, cycleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme debe usarse dentro de ThemeProvider");
  }
  return context;
}
