import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./SnakeGame.css";

// Kích thước ô mặc định
const SCALE = 20;

// Các tốc độ của trò chơi (ms)
const SPEED_OPTIONS = {
  slow: 200,
  medium: 130,
  fast: 70,
};

// Hàm tạo vị trí thực phẩm ngẫu nhiên không trùng với con rắn
const getRandomPosition = (snake) => {
  let position;
  let validPosition = false;

  while (!validPosition) {
    const x = Math.floor(Math.random() * (400 / SCALE)) * SCALE;
    const y = Math.floor(Math.random() * (400 / SCALE)) * SCALE;
    position = [x, y];

    validPosition = !snake.some(
      (segment) => segment[0] === position[0] && segment[1] === position[1]
    );
  }

  return position;
};

const SnakeGame = () => {
  // Trạng thái của con rắn, thực phẩm, hướng di chuyển, trạng thái trò chơi
  const [snake, setSnake] = useState([[0, 0]]);
  const [food, setFood] = useState(getRandomPosition([[0, 0]]));
  const [direction, setDirection] = useState([SCALE, 0]); // Hướng di chuyển mặc định (sang phải)
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [paused, setPaused] = useState(false); // Trạng thái tạm dừng trò chơi
  const [speed, setSpeed] = useState(SPEED_OPTIONS.medium); // Tốc độ di chuyển mặc định
  const [showGameOver, setShowGameOver] = useState(false); // Hiển thị thông báo game over

  const navigate = useNavigate();

  useEffect(() => {
    if (!gameStarted || gameOver || paused) return;

    const moveSnake = () => {
      setSnake((prevSnake) => {
        const newSnake = [...prevSnake];
        const head = [...newSnake[0]];
        head[0] += direction[0];
        head[1] += direction[1];

        if (head[0] < 0) head[0] = 400 - SCALE; // Vượt trái
        if (head[1] < 0) head[1] = 400 - SCALE; // Vượt trên
        if (head[0] >= 400) head[0] = 0; // Vượt phải
        if (head[1] >= 400) head[1] = 0; // Vượt dưới

        if (
          newSnake
            .slice(1)
            .some((segment) => segment[0] === head[0] && segment[1] === head[1])
        ) {
          setGameOver(true); // Kết thúc trò chơi
          setShowGameOver(true); // Hiển thị thông báo game over
          return prevSnake;
        }

        newSnake.unshift(head); // Thêm phần mới vào đầu con rắn

        if (head[0] === food[0] && head[1] === food[1]) {
          setFood(getRandomPosition(newSnake)); // Tạo thực phẩm mới
        } else {
          newSnake.pop(); // Xóa phần cuối cùng nếu không ăn thực phẩm
        }

        return newSnake;
      });
    };

    const interval = setInterval(moveSnake, speed);
    return () => clearInterval(interval);
  }, [direction, gameStarted, gameOver, paused, speed, food]);

  useEffect(() => {
    if (gameOver) {
      const timer = setTimeout(() => {
        setShowGameOver(false); // Ẩn thông báo sau 5 giây
        restartGame(); // Khởi động lại trò chơi sau khi ẩn thông báo game over
      }, 5000);
  
      return () => clearTimeout(timer);
    }
  }, [gameOver]);
  

  const handleKeyPress = (event) => {
    switch (event.key) {
      case "ArrowUp":
        if (direction[1] === 0) setDirection([0, -SCALE]);
        break;
      case "ArrowDown":
        if (direction[1] === 0) setDirection([0, SCALE]);
        break;
      case "ArrowLeft":
        if (direction[0] === 0) setDirection([-SCALE, 0]);
        break;
      case "ArrowRight":
        if (direction[0] === 0) setDirection([SCALE, 0]);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyPress);
    return () => document.removeEventListener("keydown", handleKeyPress);
  }, [direction]);

  const startGame = () => {
    setGameStarted(true);
    setGameOver(false);
    setShowGameOver(false); // Đảm bảo thông báo game over không hiển thị khi bắt đầu trò chơi mới
    setSnake([[0, 0]]);
    setDirection([SCALE, 0]);
    setFood(getRandomPosition([[0, 0]]));
  };

  const restartGame = () => {
    setGameStarted(false);
    setGameOver(false);
    setShowGameOver(false); // Đảm bảo thông báo game over không hiển thị khi khởi động lại trò chơi
    setSnake([[0, 0]]);
    setDirection([SCALE, 0]);
    setFood(getRandomPosition([[0, 0]]));
    // Reset speed if needed
    setSpeed(SPEED_OPTIONS.medium); // Hoặc tốc độ mặc định khác nếu cần
  };

  const goBackToMenu = () => {
    navigate("/");
  };

  const handleSpeedChange = (event) => {
    setSpeed(SPEED_OPTIONS[event.target.value]);
  };

  return (
    <div className="snake-game-container">
      {showGameOver && <div className="snake-game-over">Game Over</div>}
      {!gameStarted && !gameOver && (
        <div className="snake-start-container">
          <img
            src="https://play-lh.googleusercontent.com/S9ZmNx5LYCj7h2IJZb0QqkXAGki6JRaMQ25ycKfrngDkNBA6jk7rM87YcAH1prV_OA"
            alt="Snake Game"
            className="snake-start-image"
          />
          <button className="snake-start-button" onClick={startGame}>
            Start Game
          </button>
        </div>
      )}
      {gameStarted && !gameOver && (
        <>
          <div className="snake-controls-container">
            <button className="snake-restart-button" onClick={restartGame}>
              Restart Game
            </button>
            <button className="snake-back-button" onClick={goBackToMenu}>
              Back to menu
            </button>
            <button
              className="snake-pause-button"
              onClick={() => setPaused((prevPaused) => !prevPaused)}>
              {paused ? "Resume" : "Pause"}
            </button>
            <div className="snake-speed-container">
              <label htmlFor="speed-select">Speed</label>
              <select
                id="speed-select"
                value={Object.keys(SPEED_OPTIONS).find(
                  (key) => SPEED_OPTIONS[key] === speed
                )}
                onChange={handleSpeedChange}
                className="snake-speed-select">
                <option value="slow">Slow</option>
                <option value="medium">Medium</option>
                <option value="fast">Fast</option>
              </select>
            </div>
          </div>
          <div className="snake-board">
            {snake.map((segment, index) => (
              <div
                key={index}
                className="snake-segment"
                style={{ left: segment[0], top: segment[1] }}
              />
            ))}
            <div
              className="snake-food"
              style={{ left: food[0], top: food[1] }}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default SnakeGame;
