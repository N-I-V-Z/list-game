import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import { store } from "./index";
import CaroGame from "./component/Games/CaroGame3x3/CaroGame";
import ListGame from "./component/List/ListGame";
import SnakeGame from "./component/Games/SnakeGame/SnakeGame";
import CaroGame5 from "./component/Games/CaroGame5/CaroGame";
import ColorTest from "./component/Games/ColorTest/ColorTest";
import BlockStackingGame from "./component/Games/Block Stacking Game/BlockStackingGame";
import MineSweeper from "./component/Games/MineSweeper/MineSweeper";
import Game2048 from "./component/Games/2048/Game2048";
import Register from "./component/Auth/Register";
import Login from "./component/Auth/Login";
import CaroTrack from "./component/Games/CaroTrack/CaroTrack";
import DoodleJump from "./component/Games/DoodleJump/DoodleJump";

function App() {

  const [flagReRender, setFlagReRender] = useState(false);

  // flagReRender là 1 useState, nên khi nó thay đổi thì Component App sẽ thay đổi kéo theo tất cả các trang thay đổi theo (thay đổi ở đây là cập nhập lại view)
  store.subcribe(function () {
    setFlagReRender(!flagReRender);
  });

  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<ListGame />} />
          <Route path="/caro-game-3x3" element={<CaroGame />} />
          <Route path="/snake-game" element={<SnakeGame />} />
          <Route path="/caro-game-5" element={<CaroGame5 />} />
          <Route path="/color-test" element={<ColorTest />} />
          <Route path="/block-stacking" element={<BlockStackingGame />} />
          <Route path="/minesweeper" element={<MineSweeper />} />
          <Route path="/2048" element={<Game2048 />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/caro-track" element={<CaroTrack />} />
          <Route path="/DoodleJump" element={<DoodleJump />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
