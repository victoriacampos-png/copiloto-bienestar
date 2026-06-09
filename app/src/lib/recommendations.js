const actions = [
  // Agotado (low energy)
  { id: 1, level: "low", category: "mindfulness", text: "Pon el temporizador 20 minutos y cierra el correo. Solo una cosa a la vez.", time: "20 min" },
  { id: 2, level: "low", category: "food", text: "Bebe un vaso de agua antes de tu próxima reunión. Sin móvil mientras.", time: "2 min" },
  { id: 3, level: "low", category: "mindfulness", text: "Date permiso para hacer una pausa de 10 minutos sin culpa.", time: "10 min" },
  { id: 4, level: "low", category: "movement", text: "Estira los hombros y el cuello durante 5 minutos en tu silla.", time: "5 min" },
  { id: 5, level: "low", category: "mindfulness", text: "Cierra todas las pestañas innecesarias. Menos ruido visual, más calma.", time: "3 min" },
  // Regular (medium energy)
  { id: 6, level: "medium", category: "movement", text: "Antes de tu próxima reunión, sal a caminar 8 minutos. Sin móvil.", time: "8 min" },
  { id: 7, level: "medium", category: "mindfulness", text: "Escribe en papel las 3 cosas más importantes de hoy. Solo 3.", time: "5 min" },
  { id: 8, level: "medium", category: "food", text: "Come algo real al mediodía, lejos de la pantalla.", time: "20 min" },
  { id: 9, level: "medium", category: "mindfulness", text: "Tómate un café o té sin pantallas. Solo 5 minutos de pausa real.", time: "5 min" },
  { id: 10, level: "medium", category: "mindfulness", text: "Reorganiza un espacio pequeño de tu escritorio. El orden libera la mente.", time: "7 min" },
  // Bien (high energy)
  { id: 11, level: "high", category: "mindfulness", text: "Aprovecha este momento de energía: haz esa tarea que llevas posponiendo.", time: "25 min" },
  { id: 12, level: "high", category: "movement", text: "Da un paseo de 15 minutos después de comer. Tu cerebro lo agradecerá.", time: "15 min" },
  { id: 13, level: "high", category: "social", text: "Llama a alguien importante para ti, aunque sea 5 minutos.", time: "5 min" },
  { id: 14, level: "high", category: "mindfulness", text: "Planifica mañana en 10 minutos: una lista clara te dará tranquilidad.", time: "10 min" },
  // Con energía (very high energy)
  { id: 15, level: "very-high", category: "movement", text: "Haz 10 minutos de movimiento intenso ahora que tienes la energía.", time: "10 min" },
  { id: 16, level: "very-high", category: "social", text: "Propón esa idea que llevas tiempo guardando. Hoy es el día.", time: "15 min" },
  { id: 17, level: "very-high", category: "food", text: "Cocina algo saludable para mañana mientras tienes energía.", time: "30 min" },
  { id: 18, level: "very-high", category: "mindfulness", text: "Escribe durante 10 minutos sobre algo que te inspire o motive.", time: "10 min" },
  { id: 19, level: "very-high", category: "social", text: "Toma la iniciativa: envía ese mensaje que llevas días aplazando.", time: "5 min" },
];

const stateToLevel = {
  agotado: "low",
  regular: "medium",
  bien: "high",
  energizado: "very-high",
};

function getActivePrefs() {
  try {
    const saved = localStorage.getItem("copiloto_prefs");
    if (saved) return JSON.parse(saved);
  } catch {
    // ignore
  }
  return ["movement", "mindfulness", "food", "social"];
}

export function getRecommendation(state, context, exclude = []) {
  const level = stateToLevel[state] || "medium";
  const prefs = getActivePrefs();

  let pool = actions.filter(
    (a) => a.level === level && !exclude.includes(a.id) && prefs.includes(a.category)
  );

  // If no match with prefs, relax pref filter
  if (pool.length === 0) {
    pool = actions.filter((a) => a.level === level && !exclude.includes(a.id));
  }

  if (pool.length === 0) {
    const fallback = actions.filter((a) => !exclude.includes(a.id));
    if (fallback.length === 0) return actions[0];
    return fallback[Math.floor(Math.random() * fallback.length)];
  }
  return pool[Math.floor(Math.random() * pool.length)];
}
