import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import CaroGame from "./component/CaroGame";
import ChooseRoom from "./component/ChooseRoom";

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<ChooseRoom />} />
          <Route path="/caro-game/:room" element={<CaroGame />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
