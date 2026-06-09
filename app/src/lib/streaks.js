/**
 * Returns the number of consecutive days (from today backwards)
 * that have at least one history entry.
 */
export function getStreak(history) {
  if (!history || history.length === 0) return 0;

  // Build a Set of date strings (YYYY-MM-DD) from history
  // History items store a human-readable date string, so we rely on item.isoDate
  // (added when saving) falling back to parsing item.date.
  const dateset = new Set();
  history.forEach((item) => {
    if (item.isoDate) {
      dateset.add(item.isoDate);
    }
  });

  if (dateset.size === 0) return 0;

  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    if (dateset.has(key)) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

const ACHIEVEMENT_DEFS = [
  {
    id: "first",
    emoji: "🌱",
    label: "Primer paso",
    desc: "Hiciste tu primer check-in",
    check: (history, streak) => history.length >= 1,
  },
  {
    id: "3days",
    emoji: "🔥",
    label: "3 días seguidos",
    desc: "Racha de 3 días",
    check: (history, streak) => streak >= 3,
  },
  {
    id: "7days",
    emoji: "⭐",
    label: "Semana completa",
    desc: "Racha de 7 días",
    check: (history, streak) => streak >= 7,
  },
  {
    id: "10checkins",
    emoji: "💪",
    label: "10 check-ins",
    desc: "Has hecho 10 check-ins en total",
    check: (history, streak) => history.length >= 10,
  },
  {
    id: "30checkins",
    emoji: "🏆",
    label: "Un mes de constancia",
    desc: "30 check-ins en total",
    check: (history, streak) => history.length >= 30,
  },
];

/**
 * Returns an array of achievement objects, each with an `earned` boolean added.
 */
export function getAchievements(history) {
  const streak = getStreak(history);
  return ACHIEVEMENT_DEFS.map((def) => ({
    id: def.id,
    emoji: def.emoji,
    label: def.label,
    desc: def.desc,
    earned: def.check(history, streak),
  }));
}
