import { useState } from "react";

export default function Welcome({ onDone }) {
  const [name, setName] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    localStorage.setItem("copiloto_name", trimmed);
    onDone(trimmed);
  }

  return (
    <div className="screen" style={{ justifyContent: "center", gap: 32 }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: "3rem", marginBottom: 16 }}>🌿</div>
        <h1 className="heading-serif">Bienvenida a<br />Copiloto Bienestar</h1>
        <p className="subheading" style={{ marginTop: 12 }}>
          Antes de empezar, ¿cómo te llamas?
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ width: "100%", display: "flex", flexDirection: "column", gap: 16 }}>
        <input
          className="text-input"
          type="text"
          placeholder="Tu nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoFocus
          style={{ fontSize: "1.1rem", padding: "14px 18px" }}
        />
        <button className="btn-primary" type="submit" disabled={!name.trim()}>
          Empezar →
        </button>
      </form>
    </div>
  );
}
