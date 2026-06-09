import { useState } from "react";
import { getRecommendation } from "../lib/recommendations";

export default function MicroAction({ checkInData, recommendation, onSave, onNewRecommendation }) {
  const [excluded, setExcluded] = useState([recommendation.id]);

  const { state } = checkInData;

  function handleAnother() {
    const newRec = getRecommendation(state.key, checkInData.context, excluded);
    setExcluded((prev) => [...prev, newRec.id]);
    onNewRecommendation(newRec);
  }

  function handleSave() {
    const entry = {
      id: Date.now(),
      date: new Date().toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long" }),
      emoji: state.emoji,
      stateLabel: state.label,
      actionText: recommendation.text,
    };
    onSave(entry);
  }

  return (
    <div className="screen">
      <div className="state-header">
        <span className="state-emoji-large">{state.emoji}</span>
        <div>
          <p style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--sage-dark)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 2 }}>
            Tu estado
          </p>
          <p style={{ fontSize: "1.1rem", fontWeight: 600, color: "var(--charcoal)" }}>{state.label}</p>
        </div>
      </div>

      <div>
        <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--mid)", marginBottom: 14, textTransform: "uppercase", letterSpacing: "0.06em" }}>
          Tu micro-acción de hoy
        </p>
        <div className="action-card">
          <p className="action-text">{recommendation.text}</p>
          <span className="time-badge">
            <span>⏱</span>
            <span>{recommendation.time}</span>
          </span>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <button className="btn-primary" onClick={handleSave}>
          Guardar y volver mañana
        </button>
        <button className="btn-secondary" onClick={handleAnother}>
          Necesito otra opción
        </button>
      </div>
    </div>
  );
}
