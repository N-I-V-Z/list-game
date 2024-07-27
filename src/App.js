import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import CaroGame from "./component/CaroGame";

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<CaroGame />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
