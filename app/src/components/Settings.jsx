import { useState, useEffect } from "react";

const AVATAR_OPTIONS = ["🧑", "👩", "🧔", "👩‍💼", "👨‍💼", "🧘"];

const PREF_OPTIONS = [
  { key: "movement", label: "Movimiento", emoji: "🏃" },
  { key: "mindfulness", label: "Mindfulness", emoji: "🧘" },
  { key: "food", label: "Alimentación", emoji: "🥗" },
  { key: "social", label: "Social", emoji: "🤝" },
];

function loadNotifEnabled() {
  return localStorage.getItem("copiloto_notif_enabled") === "true";
}
function loadNotifTime() {
  return localStorage.getItem("copiloto_notif_time") || "09:00";
}
function loadPrefs() {
  try {
    const s = localStorage.getItem("copiloto_prefs");
    if (s) return JSON.parse(s);
  } catch { /* ignore */ }
  return ["movement", "mindfulness", "food", "social"];
}

export default function Settings({ onBack, onNameChange }) {
  const [name, setName] = useState(localStorage.getItem("copiloto_name") || "");
  const [avatar, setAvatar] = useState(localStorage.getItem("copiloto_avatar") || "🧑");
  const [prefs, setPrefs] = useState(loadPrefs);
  const [notifEnabled, setNotifEnabled] = useState(loadNotifEnabled);
  const [notifTime, setNotifTime] = useState(loadNotifTime);
  const [notifStatus, setNotifStatus] = useState("");
  const [savedMsg, setSavedMsg] = useState(false);

  useEffect(() => {
    if (!("Notification" in window)) {
      setNotifStatus("Tu navegador no soporta notificaciones.");
    } else if (Notification.permission === "denied") {
      setNotifStatus("Los permisos de notificación están bloqueados en el navegador.");
    }
  }, []);

  function handleSaveProfile() {
    const trimmed = name.trim();
    if (!trimmed) return;
    localStorage.setItem("copiloto_name", trimmed);
    localStorage.setItem("copiloto_avatar", avatar);
    onNameChange(trimmed);
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 2000);
  }

  function togglePref(key) {
    setPrefs((prev) => {
      const next = prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key];
      // Always keep at least one
      if (next.length === 0) return prev;
      localStorage.setItem("copiloto_prefs", JSON.stringify(next));
      return next;
    });
  }

  async function handleToggleNotif() {
    if (!("Notification" in window)) {
      setNotifStatus("Tu navegador no soporta notificaciones.");
      return;
    }
    if (!notifEnabled) {
      // Enabling — request permission
      const perm = await Notification.requestPermission();
      if (perm === "granted") {
        setNotifEnabled(true);
        localStorage.setItem("copiloto_notif_enabled", "true");
        setNotifStatus("¡Notificaciones activadas!");
      } else {
        setNotifStatus("Permiso denegado. Habilítalo en los ajustes del navegador.");
      }
    } else {
      setNotifEnabled(false);
      localStorage.setItem("copiloto_notif_enabled", "false");
      setNotifStatus("");
    }
  }

  function handleTimeChange(e) {
    setNotifTime(e.target.value);
    localStorage.setItem("copiloto_notif_time", e.target.value);
  }

  function handleClearHistory() {
    const confirmed = window.confirm("¿Seguro que quieres borrar todo tu historial? Esta acción no se puede deshacer.");
    if (confirmed) {
      localStorage.removeItem("copiloto_history");
      localStorage.removeItem("copiloto_notif_last_fired");
      alert("Historial borrado.");
    }
  }

  return (
    <div className="screen">
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <button className="settings-back-btn" onClick={onBack}>← Volver</button>
      </div>

      <h2 className="heading-serif" style={{ fontSize: "1.6rem" }}>Ajustes</h2>

      {/* ── Perfil ── */}
      <div className="settings-section">
        <p className="settings-section-title">Perfil</p>

        <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "var(--mid)", marginBottom: 8 }}>
          Tu nombre
        </label>
        <input
          className="text-input"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Tu nombre"
          style={{ marginBottom: 16 }}
        />

        <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "var(--mid)", marginBottom: 10 }}>
          Avatar
        </label>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 20 }}>
          {AVATAR_OPTIONS.map((av) => (
            <button
              key={av}
              onClick={() => setAvatar(av)}
              style={{
                fontSize: "1.8rem",
                background: avatar === av ? "var(--sage-light)" : "var(--warm-white)",
                border: `2px solid ${avatar === av ? "var(--sage)" : "#E8E4DC"}`,
                borderRadius: 12,
                padding: "8px 10px",
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
            >
              {av}
            </button>
          ))}
        </div>

        <button className="btn-primary" onClick={handleSaveProfile} disabled={!name.trim()}>
          {savedMsg ? "¡Guardado!" : "Guardar perfil"}
        </button>
      </div>

      {/* ── Preferencias ── */}
      <div className="settings-section">
        <p className="settings-section-title">Preferencias de micro-acciones</p>
        <p style={{ fontSize: "0.85rem", color: "var(--mid)", marginBottom: 14 }}>
          Selecciona las categorías que quieres en tus recomendaciones.
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          {PREF_OPTIONS.map((opt) => (
            <button
              key={opt.key}
              className={`toggle-chip${prefs.includes(opt.key) ? " active" : ""}`}
              onClick={() => togglePref(opt.key)}
            >
              {opt.emoji} {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Notificaciones ── */}
      <div className="settings-section">
        <p className="settings-section-title">Recordatorio diario</p>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <span style={{ fontSize: "0.95rem", color: "var(--charcoal)" }}>Activar recordatorio</span>
          <button
            onClick={handleToggleNotif}
            style={{
              width: 48,
              height: 28,
              borderRadius: 50,
              border: "none",
              background: notifEnabled ? "var(--sage)" : "#D0CFC8",
              cursor: "pointer",
              position: "relative",
              transition: "background 0.2s ease",
              flexShrink: 0,
            }}
          >
            <span style={{
              position: "absolute",
              top: 4,
              left: notifEnabled ? 22 : 4,
              width: 20,
              height: 20,
              borderRadius: "50%",
              background: "white",
              transition: "left 0.2s ease",
              boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
            }} />
          </button>
        </div>

        {notifEnabled && (
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "var(--mid)", marginBottom: 8 }}>
              Hora del recordatorio
            </label>
            <input
              type="time"
              className="text-input"
              value={notifTime}
              onChange={handleTimeChange}
              style={{ width: "auto", padding: "10px 16px" }}
            />
          </div>
        )}

        {notifStatus && (
          <p style={{ fontSize: "0.85rem", color: "var(--mid)", marginTop: 8 }}>
            {notifStatus}
          </p>
        )}
      </div>

      {/* ── Datos ── */}
      <div className="settings-section">
        <p className="settings-section-title">Datos</p>
        <button
          className="btn-secondary"
          onClick={handleClearHistory}
          style={{ color: "#C0392B", borderColor: "#E8C4C0" }}
        >
          Borrar historial
        </button>
      </div>
    </div>
  );
}
