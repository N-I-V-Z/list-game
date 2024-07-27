import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import CaroGame from "./component/CaroGame3x3/CaroGame";
import ListGame from "./component/List/ListGame";
import SnakeGame from "./component/SnakeGame/SnakeGame";
import CaroGame5 from "./component/CaroGame5/CaroGame";
import ColorTest from "./component/ColorTest/ColorTest";

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<ListGame />} />
          <Route path="/caro-game-3x3" element={<CaroGame />} />
          <Route path="/snake-game" element={<SnakeGame />} />
          <Route path="/caro-game-5" element={<CaroGame5 />} />
          <Route path="/color-test" element={<ColorTest />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
