import { useState } from "react";
import { getStreak, getAchievements } from "../lib/streaks";

export default function History({ onNewCheckin, onSettings }) {
  const [history] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("copiloto_history") || "[]");
    } catch {
      return [];
    }
  });

  const streak = getStreak(history);
  const achievements = getAchievements(history);

  return (
    <div className="screen">
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div>
          <span className="week-label">Esta semana</span>
          <h2 className="heading-serif" style={{ marginTop: 6 }}>Tu semana</h2>
        </div>
        <button className="icon-btn" onClick={onSettings} title="Ajustes">⚙️</button>
      </div>

      {/* Streak counter */}
      <div className="card" style={{ textAlign: "center", padding: "24px 28px" }}>
        <div className="streak-counter">{streak}</div>
        <p style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--mid)", margin: "4px 0 0" }}>
          días seguidos
        </p>
      </div>

      {/* Achievements */}
      <div>
        <p style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--mid)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>
          Logros
        </p>
        <div className="achievement-grid">
          {achievements.map((a) => (
            <div key={a.id} className={`achievement-badge${a.earned ? "" : " unearned"}`} title={a.desc}>
              <span>{a.emoji}</span>
              <span>{a.label}</span>
            </div>
          ))}
        </div>
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
