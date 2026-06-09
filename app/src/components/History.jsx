import { useState } from "react";

export default function History({ onNewCheckin }) {
  const [history] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("copiloto_history") || "[]");
    } catch {
      return [];
    }
  });

  return (
    <div className="screen">
      <div>
        <span className="week-label">Esta semana</span>
        <h2 className="heading-serif" style={{ marginTop: 6 }}>Tu semana</h2>
      </div>

      {history.length === 0 ? (
        <div className="empty-state">
          <span className="empty-emoji">🌱</span>
          <p style={{ fontWeight: 600, marginBottom: 8, color: "var(--charcoal)" }}>Aún no hay registros</p>
          <p style={{ fontSize: "0.9rem" }}>Completa tu primer check-in para empezar a construir tu historial.</p>
        </div>
      ) : (
        <div className="history-list">
          {history.map((item) => (
            <div key={item.id} className="history-item">
              <span className="history-emoji">{item.emoji}</span>
              <div className="history-content">
                <p className="history-date">{item.date} · {item.stateLabel}</p>
                <p className="history-action-text">{item.actionText}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <button className="btn-primary" onClick={onNewCheckin}>
        Nuevo check-in
      </button>
    </div>
  );
}
