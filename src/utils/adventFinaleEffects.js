import confetti from "canvas-confetti";

const GOLD_CONFETTI_COLORS = [
  "#FFD700",
  "#FFC107",
  "#FDB931",
  "#FFE066",
  "#D4AF37",
  "#FFEC8B",
];

const FINALE_COLORS = [
  ...GOLD_CONFETTI_COLORS,
  "#FFFFFF",
  "#FF4D6D",
  "#C41E3A",
  "#1A6B3C",
  "#2D8A50",
  "#FCC800",
  "#FF6B6B",
  "#C0C0C0",
];

const GOLD_CONFETTI_BASE = {
  colors: GOLD_CONFETTI_COLORS,
  shapes: ["square"],
  scalar: 1.05,
  ticks: 220,
  gravity: 0.9,
  decay: 0.92,
};

const FINALE_CONFETTI_BASE = {
  colors: FINALE_COLORS,
  shapes: ["square", "circle"],
  scalar: 1.15,
  ticks: 280,
  gravity: 0.85,
  decay: 0.9,
  zIndex: 9999,
};

let audioContext = null;

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function schedule(fn, delay) {
  return setTimeout(fn, delay);
}

function getAudioContext() {
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) return null;

  if (!audioContext) {
    audioContext = new AudioCtx();
  }

  if (audioContext.state === "suspended") {
    audioContext.resume();
  }

  return audioContext;
}

function playFireworkPop(intensity = 1) {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const duration = 0.22;
  const sampleCount = Math.floor(ctx.sampleRate * duration);
  const buffer = ctx.createBuffer(1, sampleCount, ctx.sampleRate);
  const data = buffer.getChannelData(0);

  for (let i = 0; i < sampleCount; i += 1) {
    const fade = 1 - i / sampleCount;
    data[i] = (Math.random() * 2 - 1) * fade * fade;
  }

  const source = ctx.createBufferSource();
  source.buffer = buffer;

  const filter = ctx.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.value = 900 + intensity * 700;
  filter.Q.value = 0.6;

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.28 * intensity, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

  source.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);
  source.start(now);
  source.stop(now + duration + 0.05);
}

function playBellTone(frequency, startTime, duration = 0.55, volume = 0.09) {
  const ctx = getAudioContext();
  if (!ctx) return;

  const partials = [
    { ratio: 1, gain: 1 },
    { ratio: 2.4, gain: 0.35 },
    { ratio: 3.8, gain: 0.15 },
  ];

  partials.forEach(({ ratio, gain: partialGain }) => {
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.type = "sine";
    oscillator.frequency.value = frequency * ratio;

    gainNode.gain.setValueAtTime(0, startTime);
    gainNode.gain.linearRampToValueAtTime(volume * partialGain, startTime + 0.015);
    gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    oscillator.start(startTime);
    oscillator.stop(startTime + duration + 0.05);
  });
}

function playJingleMelody() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const melody = [
    { freq: 659.25, at: 0 },
    { freq: 659.25, at: 0.22 },
    { freq: 659.25, at: 0.44 },
    { freq: 659.25, at: 0.66 },
    { freq: 659.25, at: 0.88 },
    { freq: 659.25, at: 1.1 },
    { freq: 659.25, at: 1.32 },
    { freq: 783.99, at: 1.54 },
    { freq: 523.25, at: 1.76 },
    { freq: 587.33, at: 1.98 },
    { freq: 659.25, at: 2.2 },
    { freq: 698.46, at: 2.62 },
    { freq: 698.46, at: 2.84 },
    { freq: 698.46, at: 3.06 },
    { freq: 698.46, at: 3.28 },
    { freq: 659.25, at: 3.5 },
    { freq: 659.25, at: 3.72 },
    { freq: 659.25, at: 3.94 },
    { freq: 659.25, at: 4.16 },
    { freq: 587.33, at: 4.38 },
    { freq: 523.25, at: 4.6 },
    { freq: 659.25, at: 4.82 },
  ];

  const start = ctx.currentTime + 0.05;

  melody.forEach(({ freq, at }) => {
    playBellTone(freq, start + at, 0.45, 0.1);
  });
}

function playRocketWhoosh() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const duration = 0.45;
  const sampleCount = Math.floor(ctx.sampleRate * duration);
  const buffer = ctx.createBuffer(1, sampleCount, ctx.sampleRate);
  const data = buffer.getChannelData(0);

  for (let i = 0; i < sampleCount; i += 1) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / sampleCount);
  }

  const source = ctx.createBufferSource();
  source.buffer = buffer;

  const filter = ctx.createBiquadFilter();
  filter.type = "highpass";
  filter.frequency.setValueAtTime(180, now);
  filter.frequency.exponentialRampToValueAtTime(1800, now + duration);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.001, now);
  gain.gain.linearRampToValueAtTime(0.08, now + 0.05);
  gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

  source.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);
  source.start(now);
  source.stop(now + duration + 0.05);
}

function multiLayerFireworkBurst(origin, colors = FINALE_COLORS) {
  const base = {
    ...FINALE_CONFETTI_BASE,
    origin,
    colors,
  };

  confetti({ ...base, particleCount: 90, spread: 26, startVelocity: 55, ticks: 130 });
  confetti({ ...base, particleCount: 70, spread: 70, ticks: 150, scalar: 0.95 });
  confetti({
    ...base,
    particleCount: 110,
    spread: 100,
    decay: 0.91,
    scalar: 0.85,
    ticks: 170,
  });
  confetti({
    ...base,
    particleCount: 55,
    spread: 120,
    startVelocity: 25,
    ticks: 190,
    scalar: 1.25,
  });
  confetti({
    ...base,
    particleCount: 45,
    spread: 120,
    startVelocity: 48,
    ticks: 210,
  });
}

function shootRocketFirework(x, onBurst) {
  const startY = 1.08;
  const endY = 0.12 + Math.random() * 0.28;
  const duration = 520 + Math.random() * 380;
  const start = performance.now();

  playRocketWhoosh();

  const tick = (now) => {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - (1 - progress) ** 2;
    const y = startY - (startY - endY) * eased;

    confetti({
      particleCount: 2,
      startVelocity: 0,
      ticks: 18,
      origin: { x, y },
      colors: ["#FFF8E7", "#FFD700", "#FFFFFF"],
      shapes: ["circle"],
      gravity: 0,
      scalar: 0.35,
      zIndex: 9999,
    });

    if (progress < 1) {
      requestAnimationFrame(tick);
      return;
    }

    multiLayerFireworkBurst({ x, y: endY });
    onBurst?.();
  };

  requestAnimationFrame(tick);
}

function cannonBurst(origin, particleCount = 180) {
  confetti({
    ...FINALE_CONFETTI_BASE,
    particleCount,
    spread: 100,
    startVelocity: 55,
    origin,
  });
}

export function launchConfetti() {
  confetti({
    ...GOLD_CONFETTI_BASE,
    particleCount: 120,
    spread: 80,
    origin: { y: 0.65 },
  });

  schedule(() => {
    confetti({
      ...GOLD_CONFETTI_BASE,
      particleCount: 80,
      spread: 120,
      origin: { x: 0.2, y: 0.55 },
    });
  }, 250);

  schedule(() => {
    confetti({
      ...GOLD_CONFETTI_BASE,
      particleCount: 80,
      spread: 120,
      origin: { x: 0.8, y: 0.55 },
    });
  }, 450);
}

export function launchGrandFinale() {
  launchConfetti();
  playJingleMelody();

  if (prefersReducedMotion()) {
    playFireworkPop(1.2);
    return;
  }

  const rocketPositions = [
    0.12, 0.28, 0.42, 0.58, 0.72, 0.88, 0.2, 0.5, 0.8, 0.35, 0.65,
  ];

  rocketPositions.forEach((x, index) => {
    schedule(() => {
      shootRocketFirework(x + (Math.random() - 0.5) * 0.06, () => {
        playFireworkPop(0.75 + Math.random() * 0.45);
      });
    }, index * 380 + Math.random() * 180);
  });

  const burstSchedule = [
    { delay: 600, fn: () => cannonBurst({ x: 0.5, y: 0.96 }, 220) },
    { delay: 1100, fn: () => cannonBurst({ x: 0.18, y: 0.94 }, 180) },
    { delay: 1400, fn: () => cannonBurst({ x: 0.82, y: 0.94 }, 180) },
    { delay: 2100, fn: () => cannonBurst({ x: 0.5, y: 0.98 }, 260) },
    { delay: 3200, fn: () => cannonBurst({ x: 0.35, y: 0.95 }, 200) },
    { delay: 3500, fn: () => cannonBurst({ x: 0.65, y: 0.95 }, 200) },
    { delay: 4300, fn: () => multiLayerFireworkBurst({ x: 0.5, y: 0.22 }) },
  ];

  burstSchedule.forEach(({ delay, fn }) => {
    schedule(() => {
      fn();
      playFireworkPop(0.9 + Math.random() * 0.3);
    }, delay);
  });

  const duration = 5200;
  const animationEnd = Date.now() + duration;

  const randomFireworksInterval = setInterval(() => {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      clearInterval(randomFireworksInterval);
      playFireworkPop(1.4);
      multiLayerFireworkBurst(
        { x: 0.5, y: 0.18 },
        ["#FFD700", "#FFFFFF", "#FCC800", "#FF4D6D"]
      );
      return;
    }

    shootRocketFirework(0.1 + Math.random() * 0.8, () => {
      playFireworkPop(0.5 + (timeLeft / duration) * 0.5);
    });
  }, 520);
}
