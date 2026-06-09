import { useState } from "react";
import CheckIn from "./components/CheckIn";
import MicroAction from "./components/MicroAction";
import History from "./components/History";
import Welcome from "./components/Welcome";
import "./App.css";

function App() {
  const savedName = localStorage.getItem("copiloto_name");
  const [userName, setUserName] = useState(savedName || "");
  const [screen, setScreen] = useState(savedName ? "checkin" : "welcome");
  const [checkInData, setCheckInData] = useState(null);
  const [recommendation, setRecommendation] = useState(null);

  function handleCheckinSubmit(data, rec) {
    setCheckInData(data);
    setRecommendation(rec);
    setScreen("microaction");
  }

  function handleSave(historyEntry) {
    const existing = JSON.parse(localStorage.getItem("copiloto_history") || "[]");
    existing.unshift(historyEntry);
    localStorage.setItem("copiloto_history", JSON.stringify(existing));
    setScreen("history");
  }

  function handleNewCheckin() {
    setCheckInData(null);
    setRecommendation(null);
    setScreen("checkin");
  }

  function handleWelcomeDone(name) {
    setUserName(name);
    setScreen("checkin");
  }

  return (
    <div className="app-container">
      {screen === "welcome" && (
        <Welcome onDone={handleWelcomeDone} />
      )}
      {screen === "checkin" && (
        <CheckIn onSubmit={handleCheckinSubmit} userName={userName} />
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
        <History onNewCheckin={handleNewCheckin} />
      )}
    </div>
  );
}

export default App;
