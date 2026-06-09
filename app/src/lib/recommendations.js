const actions = [
  // Agotado (low energy)
  { id: 1, level: "low", text: "Pon el temporizador 20 minutos y cierra el correo. Solo una cosa a la vez.", time: "20 min" },
  { id: 2, level: "low", text: "Bebe un vaso de agua antes de tu próxima reunión. Sin móvil mientras.", time: "2 min" },
  { id: 3, level: "low", text: "Date permiso para hacer una pausa de 10 minutos sin culpa.", time: "10 min" },
  { id: 4, level: "low", text: "Estira los hombros y el cuello durante 5 minutos en tu silla.", time: "5 min" },
  { id: 5, level: "low", text: "Cierra todas las pestañas innecesarias. Menos ruido visual, más calma.", time: "3 min" },
  // Regular (medium energy)
  { id: 6, level: "medium", text: "Antes de tu próxima reunión, sal a caminar 8 minutos. Sin móvil.", time: "8 min" },
  { id: 7, level: "medium", text: "Escribe en papel las 3 cosas más importantes de hoy. Solo 3.", time: "5 min" },
  { id: 8, level: "medium", text: "Come algo real al mediodía, lejos de la pantalla.", time: "20 min" },
  { id: 9, level: "medium", text: "Tómate un café o té sin pantallas. Solo 5 minutos de pausa real.", time: "5 min" },
  { id: 10, level: "medium", text: "Reorganiza un espacio pequeño de tu escritorio. El orden libera la mente.", time: "7 min" },
  // Bien (high energy)
  { id: 11, level: "high", text: "Aprovecha este momento de energía: haz esa tarea que llevas posponiendo.", time: "25 min" },
  { id: 12, level: "high", text: "Da un paseo de 15 minutos después de comer. Tu cerebro lo agradecerá.", time: "15 min" },
  { id: 13, level: "high", text: "Llama a alguien importante para ti, aunque sea 5 minutos.", time: "5 min" },
  { id: 14, level: "high", text: "Planifica mañana en 10 minutos: una lista clara te dará tranquilidad.", time: "10 min" },
  // Con energía (very high energy)
  { id: 15, level: "very-high", text: "Haz 10 minutos de movimiento intenso ahora que tienes la energía.", time: "10 min" },
  { id: 16, level: "very-high", text: "Propón esa idea que llevas tiempo guardando. Hoy es el día.", time: "15 min" },
  { id: 17, level: "very-high", text: "Cocina algo saludable para mañana mientras tienes energía.", time: "30 min" },
  { id: 18, level: "very-high", text: "Escribe durante 10 minutos sobre algo que te inspire o motive.", time: "10 min" },
  { id: 19, level: "very-high", text: "Toma la iniciativa: envía ese mensaje que llevas días aplazando.", time: "5 min" },
];

const stateToLevel = {
  agotado: "low",
  regular: "medium",
  bien: "high",
  energizado: "very-high",
};

export function getRecommendation(state, context, exclude = []) {
  const level = stateToLevel[state] || "medium";
  const pool = actions.filter(
    (a) => a.level === level && !exclude.includes(a.id)
  );
  if (pool.length === 0) {
    // Fallback: any action not excluded
    const fallback = actions.filter((a) => !exclude.includes(a.id));
    if (fallback.length === 0) return actions[0];
    return fallback[Math.floor(Math.random() * fallback.length)];
  }
  return pool[Math.floor(Math.random() * pool.length)];
}
