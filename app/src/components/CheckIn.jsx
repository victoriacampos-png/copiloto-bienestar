import { useState } from "react";
import { getRecommendation } from "../lib/recommendations";

const STATES = [
  { key: "agotado", emoji: "😴", label: "Agotado" },
  { key: "regular", emoji: "😐", label: "Regular" },
  { key: "bien", emoji: "⚡", label: "Bien" },
  { key: "energizado", emoji: "🔥", label: "Con energía" },
];

export default function CheckIn({ onSubmit }) {
  const [selectedState, setSelectedState] = useState(null);
  const [context, setContext] = useState("");

  function handleSubmit() {
    if (!selectedState) return;
    const rec = getRecommendation(selectedState.key, context);
    onSubmit({ state: selectedState, context }, rec);
  }

  return (
    <div className="screen">
      <div>
        <h1 className="heading-serif">Buenos días, Carlos</h1>
        <p className="subheading" style={{ marginTop: 8 }}>¿Cómo estás hoy?</p>
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
        disabled={!selectedState}
        onClick={handleSubmit}
      >
        Ver mi micro-acción
      </button>
    </div>
  );
}
