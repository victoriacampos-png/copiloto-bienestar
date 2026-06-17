import { useState } from "react";
import { getClaudeRecommendation } from "../lib/claude";

const STATES = [
  { key: "agotado", emoji: "😴", label: "Agotado" },
  { key: "regular", emoji: "😐", label: "Regular" },
  { key: "bien", emoji: "⚡", label: "Bien" },
  { key: "energizado", emoji: "🔥", label: "Con energía" },
];

export default function CheckIn({ onSubmit, userName, onSettings }) {
  const [selectedState, setSelectedState] = useState(null);
  const [context, setContext] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (!selectedState || loading) return;
    setLoading(true);
    try {
      const { rec, source } = await getClaudeRecommendation(selectedState.key, context);
      onSubmit({ state: selectedState, context }, { ...rec, source });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="screen">
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div>
          <h1 className="heading-serif">Buenos días, {userName}</h1>
          <p className="subheading" style={{ marginTop: 8 }}>¿Cómo estás hoy?</p>
        </div>
        <button className="icon-btn" onClick={onSettings} title="Ajustes">⚙️</button>
      </div>

      <div className="emoji-grid">
        {STATES.map((s) => (
          <button
            key={s.key}
            className={`emoji-btn${selectedState?.key === s.key ? " selected" : ""}`}
            onClick={() => setSelectedState(s)}
          >
            <span className="emoji">{s.emoji}</span>
            <span>{s.label}</span>
          </button>
        ))}
      </div>

      <div className="card" style={{ padding: "20px 24px" }}>
        <label style={{ display: "block", fontSize: "0.9rem", fontWeight: 600, color: "var(--mid)", marginBottom: 10 }}>
          ¿Qué tienes por delante hoy?
        </label>
        <textarea
          className="text-input"
          rows={3}
          placeholder="Ej: 3 reuniones, presentación importante..."
          value={context}
          onChange={(e) => setContext(e.target.value)}
        />
      </div>

      <button
        className="btn-primary"
        disabled={!selectedState || loading}
        onClick={handleSubmit}
      >
        {loading ? "Generando tu acción..." : "Ver mi micro-acción"}
      </button>

      {loading && (
        <p style={{ textAlign: "center", fontSize: "0.8rem", color: "var(--mid)" }}>
          Consultando tu copiloto ✨
        </p>
      )}
    </div>
  );
}
