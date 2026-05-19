import styles from "./SwiperArrow.module.scss";

export default function SwiperArrow({
  direction = "next",
  onClick,
  className = "",
  as = "button",
}) {
  const isPrev = direction === "prev";
  const classes = `${styles.arrow} ${isPrev ? styles.prev : styles.next} ${className}`.trim();

  const icon = (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d={isPrev ? "M15 6L9 12L15 18" : "M9 6L15 12L9 18"}
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  if (as === "div") {
    return (
      <div className={classes} onClick={onClick} role="button" tabIndex={0}>
        {icon}
      </div>
    );
  }

  return (
    <button
      type="button"
      className={classes}
      onClick={onClick}
      aria-label={isPrev ? "Anterior" : "Siguiente"}
    >
      {icon}
    </button>
  );
}
