export function parseSheetBoolean(value, defaultValue = false) {
  if (value === null || value === undefined || value === "") {
    return defaultValue;
  }

  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value !== 0;

  const normalized = String(value).trim().toLowerCase();
  return ["true", "1", "si", "sí", "yes", "activo"].includes(normalized);
}

export function parseRevealFrom(value) {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  if (value instanceof Date) {
    return value.getTime();
  }

  if (typeof value === "number") {
    if (value > 1_000_000_000_000) {
      return value;
    }

    if (value > 1000) {
      const parsed = new Date(value);
      if (!Number.isNaN(parsed.getTime())) {
        return parsed.getTime();
      }
    }

    const sheetMs = (value - 25569) * 86400000;
    if (sheetMs > 0) {
      return sheetMs;
    }
  }

  const text = String(value).trim();
  const arMatch = text.match(
    /^(\d{1,2})\/(\d{1,2})\/(\d{4})(?:[ T](\d{1,2}):(\d{2})(?::(\d{2}))?)?$/
  );

  if (arMatch) {
    const [, day, month, year, hours = "0", minutes = "0", seconds = "0"] =
      arMatch;
    const parsed = new Date(
      Number(year),
      Number(month) - 1,
      Number(day),
      Number(hours),
      Number(minutes),
      Number(seconds)
    );

    if (!Number.isNaN(parsed.getTime())) {
      return parsed.getTime();
    }
  }

  const parsed = new Date(text);
  return Number.isNaN(parsed.getTime()) ? null : parsed.getTime();
}

export function normalizeSheetRow(item = {}) {
  const day = Number(item.dia ?? item.day);

  return {
    day,
    prize: String(item.premio ?? item.prize ?? "").trim(),
    winner: String(item.ganador ?? item.winner ?? "").trim(),
    image: String(item.imagen ?? item.image ?? "").trim(),
    revealFrom: item.revelar_desde ?? item.revealAt ?? item.reveal_at ?? "",
    active: parseSheetBoolean(item.activo ?? item.active, true),
  };
}

export function applyRevealState(item, now = Date.now()) {
  if (!item.active) {
    return {
      ...item,
      locked: true,
      canReveal: false,
    };
  }

  const revealTime = parseRevealFrom(item.revealFrom);

  if (revealTime === null) {
    return {
      ...item,
      locked: true,
      canReveal: false,
    };
  }

  const canReveal = now >= revealTime;

  return {
    ...item,
    locked: !canReveal,
    canReveal,
  };
}

export function normalizeAdventCalendarDays(rawDays = [], now = Date.now()) {
  return rawDays
    .map(normalizeSheetRow)
    .filter((item) => Number.isFinite(item.day) && item.day > 0)
    .filter((item) => item.active)
    .sort((a, b) => a.day - b.day)
    .map((item) => applyRevealState(item, now));
}

export function getRemainingMs(revealFrom, now = Date.now()) {
  const revealTime = parseRevealFrom(revealFrom);
  if (revealTime === null) return null;
  return revealTime - now;
}

export function getLastCalendarDayNumber(days = []) {
  if (!days.length) return null;

  return Math.max(...days.map((item) => item.day));
}

export function formatCountdown(remainingMs) {
  if (remainingMs === null || remainingMs <= 0) return null;

  const totalSeconds = Math.floor(remainingMs / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (days > 0) {
    return `${days}d ${String(hours).padStart(2, "0")}h`;
  }

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}
