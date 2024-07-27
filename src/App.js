import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import CaroGame from "./component/CaroGame3x3/CaroGame";
import ListGame from "./component/List/ListGame";
import CaroGame5 from "./component/CaroGame5/CaroGame";

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<ListGame />} />
          <Route path="/caro-game-3x3" element={<CaroGame />} />
          <Route path="/caro-game-5" element={<CaroGame5 />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
