import React from "react";
import "./App.css";
import AudioStatus from "./AudioStatus";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>dj microbeat</h1>
        <AudioStatus />
      </header>
    </div>
  );
}

export default App;
