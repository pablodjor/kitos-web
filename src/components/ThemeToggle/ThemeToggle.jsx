import { FaMoon, FaSun } from "react-icons/fa";

import { useTheme } from "../../context/ThemeContext";
import {
  getNextPreferenceLabel,
  getPreferenceLabel,
} from "../../utils/theme";
import styles from "./ThemeToggle.module.scss";

export default function ThemeToggle() {
  const { preference, resolved, cycleTheme } = useTheme();
  const label = getPreferenceLabel(preference);
  const nextLabel = getNextPreferenceLabel(preference);

  return (
    <button
      type="button"
      className={styles.toggle}
      onClick={cycleTheme}
      aria-label={`${label}. Activar ${nextLabel.toLowerCase()}.`}
      title={`${label} — clic para ${nextLabel.toLowerCase()}`}
    >
      {resolved === "dark" ? <FaSun aria-hidden /> : <FaMoon aria-hidden />}
    </button>
  );
}
