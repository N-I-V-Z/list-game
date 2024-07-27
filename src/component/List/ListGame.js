import React from 'react';
import { Link } from 'react-router-dom';
import './ListGame.css';

function ListGame() {
  return (
    <div>
      <div className="welcome-message">
        Chào mừng bạn đến thế giới game của chúng tôi
      </div>
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
            alt="Care Game 5"
            className="game-image"
          />
          <div className="game-link-text">Caro Game 5</div>
        </Link>

        <Link to="/color-test" className="game-link">
        <img
            src="https://play-lh.googleusercontent.com/AcHFAoNerGDOI8DuIxbBFc1qXAVjE2q1_RYMZVhO5jQ1rgtKk7h2lQQFJe2Cje4NF3WC"
            alt="TestColor Game"
            className="game-image"
          />
          <div className="game-link-text">Test Color Game</div>
        </Link>
        
      </div>
    </div>
  );
}

export default ListGame;
