import { getRecommendation } from "./recommendations";

const STATE_LABELS = {
  agotado: "agotado/sin energía",
  regular: "regular, ni bien ni mal",
  bien: "bien, con energía moderada",
  energizado: "con mucha energía y motivación",
};

const PREF_LABELS = {
  movement: "movimiento físico",
  mindfulness: "mindfulness y foco mental",
  food: "alimentación",
  social: "conexión social",
};

function getActivePrefs() {
  try {
    const saved = localStorage.getItem("copiloto_prefs");
    if (saved) return JSON.parse(saved);
  } catch { /* ignore */ }
  return ["movement", "mindfulness", "food", "social"];
}

export async function getClaudeRecommendation(state, context) {
  const apiKey = localStorage.getItem("copiloto_api_key");

  if (!apiKey) {
    return { rec: getRecommendation(state, context), source: "mock" };
  }

  const prefs = getActivePrefs();
  const prefLabels = prefs.map((p) => PREF_LABELS[p] || p).join(", ");
  const stateLabel = STATE_LABELS[state] || state;

  const prompt = `Eres un copiloto de bienestar personal. Tu tarea es dar UNA sola micro-acción concreta, realista y compasiva para alguien que hoy se siente ${stateLabel}.

Contexto del día: ${context || "No especificado"}
Categorías preferidas: ${prefLabels}

Reglas:
- La acción debe ser MUY concreta y pequeña (máximo 20-30 minutos)
- Debe encajar en el contexto del día descrito
- Nada de listas, nada de introducciones. Solo la acción directa.
- Termina con el tiempo estimado entre paréntesis, ej: (8 min)
- Tono: cercano, sin juicio, sin presión
- Máximo 2 frases

Responde SOLO con la micro-acción, sin saludos ni explicaciones.`;

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "anthropic-dangerous-direct-browser-access": "true",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 150,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err?.error?.message || `HTTP ${response.status}`);
    }

    const data = await response.json();
    const text = data.content?.[0]?.text?.trim();

    if (!text) throw new Error("Respuesta vacía de la API");

    return {
      rec: { id: "claude", text, time: null, category: "ai", level: state },
      source: "claude",
    };
  } catch (err) {
    console.error("Claude API error:", err);
    return {
      rec: getRecommendation(state, context),
      source: "mock",
      error: err.message,
    };
  }
}
