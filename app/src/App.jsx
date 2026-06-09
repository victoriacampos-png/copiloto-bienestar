import { useState, useEffect } from "react";
import CheckIn from "./components/CheckIn";
import MicroAction from "./components/MicroAction";
import History from "./components/History";
import Welcome from "./components/Welcome";
import Settings from "./components/Settings";
import "./App.css";

function checkAndFireNotification() {
  if (!("Notification" in window)) return;
  if (Notification.permission !== "granted") return;
  if (localStorage.getItem("copiloto_notif_enabled") !== "true") return;

  const savedTime = localStorage.getItem("copiloto_notif_time") || "09:00";
  const lastFired = localStorage.getItem("copiloto_notif_last_fired") || "";
  const todayStr = new Date().toISOString().slice(0, 10);

  if (lastFired === todayStr) return; // already fired today

  const [hh, mm] = savedTime.split(":").map(Number);
  const now = new Date();
  const targetMs = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hh, mm, 0).getTime();
  const diffMs = now.getTime() - targetMs;

  // Fire if within 1 minute past the scheduled time
  if (diffMs >= 0 && diffMs <= 60000) {
    new Notification("Copiloto Bienestar 🌿", {
      body: "Es hora de tu check-in de hoy. ¿Cómo estás?",
    });
    localStorage.setItem("copiloto_notif_last_fired", todayStr);
  }
}

function App() {
  const savedName = localStorage.getItem("copiloto_name");
  const [userName, setUserName] = useState(savedName || "");
  const [screen, setScreen] = useState(savedName ? "checkin" : "welcome");
  const [previousScreen, setPreviousScreen] = useState("checkin");
  const [checkInData, setCheckInData] = useState(null);
  const [recommendation, setRecommendation] = useState(null);

  useEffect(() => {
    // Check notification on mount and every 30s
    checkAndFireNotification();
    const interval = setInterval(checkAndFireNotification, 30000);
    return () => clearInterval(interval);
  }, []);

  function navigate(to) {
    setPreviousScreen(screen);
    setScreen(to);
  }

  function handleCheckinSubmit(data, rec) {
    setCheckInData(data);
    setRecommendation(rec);
    navigate("microaction");
  }

  function handleSave(historyEntry) {
    const existing = JSON.parse(localStorage.getItem("copiloto_history") || "[]");
    // Add isoDate for streak calculation
    const entry = { ...historyEntry, isoDate: new Date().toISOString().slice(0, 10) };
    existing.unshift(entry);
    localStorage.setItem("copiloto_history", JSON.stringify(existing));
    navigate("history");
  }

  function handleNewCheckin() {
    setCheckInData(null);
    setRecommendation(null);
    navigate("checkin");
  }

  function handleWelcomeDone(name) {
    setUserName(name);
    navigate("checkin");
  }

  function handleGoSettings() {
    navigate("settings");
  }

  function handleSettingsBack() {
    setScreen(previousScreen || "checkin");
  }

  function handleNameChange(newName) {
    setUserName(newName);
  }

  return (
    <div className="app-container">
      {screen === "welcome" && (
        <Welcome onDone={handleWelcomeDone} />
      )}
      {screen === "checkin" && (
        <CheckIn onSubmit={handleCheckinSubmit} userName={userName} onSettings={handleGoSettings} />
      )}
      {screen === "microaction" && (
        <MicroAction
          checkInData={checkInData}
          recommendation={recommendation}
          onSave={handleSave}
          onNewRecommendation={(rec) => setRecommendation(rec)}
        />
      )}
      {screen === "history" && (
        <History onNewCheckin={handleNewCheckin} onSettings={handleGoSettings} />
      )}
      {screen === "settings" && (
        <Settings onBack={handleSettingsBack} onNameChange={handleNameChange} />
      )}
    </div>
  );
}

export default App;
