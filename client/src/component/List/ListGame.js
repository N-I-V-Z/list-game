import React from "react";
import { Link } from "react-router-dom";
import "./ListGame.css";
import Header from "../Layout/Header";

function ListGame() {


  return (
    <div>
      <Header />
      <div className="list-game-container">
        <Link to="/caro-game-3x3" className="game-link">
          <img
            src="https://m.game24h.vn/upload/3-2019/images/2019-07-02/1562042045-game-tic-tac-toe.png"
            alt="Caro Game 3x3"
            className="game-image"
          />
          <div className="game-link-text">Caro Game 3x3</div>
        </Link>

        <Link to="/snake-game" className="game-link">
          <img
            src="https://play-lh.googleusercontent.com/S9ZmNx5LYCj7h2IJZb0QqkXAGki6JRaMQ25ycKfrngDkNBA6jk7rM87YcAH1prV_OA"
            alt="Snake Game"
            className="game-image"
          />
          <div className="game-link-text">Snake Game</div>
        </Link>

        <Link to="/caro-game-5" className="game-link">
          <img
            src="https://play-lh.googleusercontent.com/DBUWup7Cl26mbtN81yz0pw9Wge5aNll4T3su6pOpoSYnFVx8TLMv9-P5S7QAKPuV6BA"
            alt="Caro Game 5"
            className="game-image"
          />
          <div className="game-link-text">Caro Game 5</div>
        </Link>

        <Link to="/color-test" className="game-link">
          <img
            src="https://play-lh.googleusercontent.com/AcHFAoNerGDOI8DuIxbBFc1qXAVjE2q1_RYMZVhO5jQ1rgtKk7h2lQQFJe2Cje4NF3WC"
            alt="Test Color Game"
            className="game-image"
          />
          <div className="game-link-text">Test Color Game</div>
        </Link>
        <Link to="/minesweeper" className="game-link">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRvqMBWUiLKSnwHym-6JeSXYuGJGaRwtt6UrQ&s"
            alt="Mine Sweeper"
            className="game-image"
          />
          <div className="game-link-text">Mine Sweeper</div>
        </Link>

        <Link to="/block-stacking" className="game-link">
          <img
            src="https://st.gamevui.com/images/image/2019/12/28/xep-gach-200.jpg"
            alt="Block Stacking Game"
            className="game-image"
          />
          <div className="game-link-text">Block Stacking Game</div>
        </Link>
        <Link to="/2048" className="game-link">
          <img
            src="https://s.cafebazaar.ir/1/icons/com.irapps.game2048_512x512.png"
            alt="2048"
            className="game-image"
          />
          <div className="game-link-text">2048</div>
        </Link>
        <Link to="/caro-track" className="game-link">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRpFqea-csU1y1tqzpSP9_AvqahPnno-ZZ-ZA&s"
            alt="Caro Track"
            className="game-image"
          />
          <div className="game-link-text">Caro Track</div>
        </Link>
        <Link to="/DoodleJump" className="game-link">
          <img
            src="https://firebasestorage.googleapis.com/v0/b/hellomilkyshop-4cf00.appspot.com/o/image_games%2Fdoodler-right.png?alt=media&token=fa02e1bc-c46b-43e8-b2a6-8d0fcbc6162e"
            alt="Doodle Jump"
            className="game-image"
          />
          <div className="game-link-text">Doodle Jump</div>
        </Link>
      </div>
    </div>
  );
}

export default ListGame;
