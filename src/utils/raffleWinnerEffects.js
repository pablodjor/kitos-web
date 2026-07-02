import confetti from "canvas-confetti";

const RAFFLE_CONFETTI_COLORS = [
  "#fa6e59",
  "#ff9d4d",
  "#FFD700",
  "#FFC107",
  "#FFE066",
  "#4897d8",
  "#FFFFFF",
];

const RAFFLE_CONFETTI_BASE = {
  colors: RAFFLE_CONFETTI_COLORS,
  shapes: ["square", "circle"],
  scalar: 1.1,
  ticks: 240,
  gravity: 0.85,
  decay: 0.91,
  zIndex: 9999,
};

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function schedule(fn, delay) {
  return setTimeout(fn, delay);
}

function burst(origin, particleCount = 100) {
  confetti({
    ...RAFFLE_CONFETTI_BASE,
    particleCount,
    spread: 90,
    startVelocity: 48,
    origin,
  });
}

export function launchWinnerCelebration() {
  if (prefersReducedMotion()) return;

  burst({ x: 0.5, y: 0.55 }, 130);

  schedule(() => {
    burst({ x: 0.15, y: 0.6 }, 80);
    burst({ x: 0.85, y: 0.6 }, 80);
  }, 300);

  schedule(() => {
    confetti({
      ...RAFFLE_CONFETTI_BASE,
      particleCount: 60,
      spread: 140,
      startVelocity: 35,
      origin: { x: 0.5, y: 0.35 },
    });
  }, 600);

  schedule(() => {
    burst({ x: 0.3, y: 0.7 }, 50);
    burst({ x: 0.7, y: 0.7 }, 50);
  }, 900);
}
