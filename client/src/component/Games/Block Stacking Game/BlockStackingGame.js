import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./BlockStackingGame.css";

const rows = 20; // Số hàng của lưới
const cols = 10; // Số cột của lưới
const initialGrid = Array.from({ length: rows }, () => Array(cols).fill(null));

// Các hình dạng khối khác nhau
const shapes = [
  {
    shape: [[1, 1, 1, 1]],
    color: "red",
  },
  {
    shape: [
      [1, 1],
      [1, 1],
    ],
    color: "blue",
  },
  {
    shape: [
      [1, 1, 0],
      [0, 1, 1],
    ],
    color: "green",
  },
  {
    shape: [
      [0, 1, 1],
      [1, 1, 0],
    ],
    color: "yellow",
  },
  {
    shape: [
      [1, 0, 0],
      [1, 1, 1],
    ],
    color: "purple",
  },
  {
    shape: [
      [0, 0, 1],
      [1, 1, 1],
    ],
    color: "orange",
  },
];

// Hàm tạo khối ngẫu nhiên
const generateRandomBlock = () => {
  const randomShape = shapes[Math.floor(Math.random() * shapes.length)];
  return {
    shape: randomShape.shape,
    color: randomShape.color,
    row: 0,
    col: Math.floor(cols / 2) - Math.floor(randomShape.shape[0].length / 2),
  };
};

const BlockStackingGame = () => {
  const [grid, setGrid] = useState(initialGrid);
  const [currentBlock, setCurrentBlock] = useState(generateRandomBlock());
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false); // Trạng thái trò chơi
  const [paused, setPaused] = useState(false); // Trạng thái tạm dừng
  const navigate = useNavigate();

  // Sử dụng useEffect để tự động di chuyển khối xuống
  useEffect(() => {
    if (!gameStarted || gameOver || paused) return;

    const interval = setInterval(() => {
      moveBlockDown();
    }, 500);
    return () => clearInterval(interval);
  }, [currentBlock, gameStarted, gameOver, paused]);

  // Xử lý sự kiện bàn phím
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (!gameOver && !paused) {
        if (event.key === "ArrowLeft") {
          moveBlockLeft();
        } else if (event.key === "ArrowRight") {
          moveBlockRight();
        } else if (event.key === "ArrowUp") {
          rotateBlock();
        } else if (event.key === "ArrowDown") {
          moveBlockDown();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentBlock, gameOver, paused]);

  // Hàm di chuyển khối xuống
  const moveBlockDown = () => {
    setGrid((prevGrid) => {
      const { shape, row, col } = currentBlock;
      if (canMove(shape, row + 1, col)) {
        setCurrentBlock({ ...currentBlock, row: row + 1 });
      } else {
        const newGrid = placeBlock(
          shape,
          row,
          col,
          prevGrid,
          currentBlock.color
        );
        setScore((prevScore) => prevScore + 10);
        const clearedGrid = clearLines(newGrid);
        if (row === 0) {
          setGameOver(true);
        } else {
          setCurrentBlock(generateRandomBlock());
        }
        return clearedGrid;
      }
      return prevGrid;
    });
  };

  // Kiểm tra khối có thể di chuyển không
  const canMove = (shape, row, col) => {
    for (let r = 0; r < shape.length; r++) {
      for (let c = 0; c < shape[r].length; c++) {
        if (shape[r][c]) {
          const newRow = row + r;
          const newCol = col + c;
          if (
            newRow >= rows ||
            newCol < 0 ||
            newCol >= cols ||
            grid[newRow][newCol]
          ) {
            return false;
          }
        }
      }
    }
    return true;
  };

  // Đặt khối vào lưới
  const placeBlock = (shape, row, col, grid, color) => {
    const newGrid = grid.map((row) => row.slice());
    shape.forEach((shapeRow, r) => {
      shapeRow.forEach((cell, c) => {
        if (cell) {
          newGrid[row + r][col + c] = color;
        }
      });
    });
    return newGrid;
  };

  // Xóa hàng đã đầy
  const clearLines = (grid) => {
    const newGrid = grid.filter((row) => row.some((cell) => cell === null));
    const clearedLines = rows - newGrid.length;
    for (let i = 0; i < clearedLines; i++) {
      newGrid.unshift(Array(cols).fill(null));
    }
    setScore((prevScore) => prevScore + clearedLines * 100);
    return newGrid;
  };

  // Di chuyển khối sang trái
  const moveBlockLeft = () => {
    const { shape, row, col } = currentBlock;
    if (canMove(shape, row, col - 1)) {
      setCurrentBlock({ ...currentBlock, col: col - 1 });
    }
  };

  // Di chuyển khối sang phải
  const moveBlockRight = () => {
    const { shape, row, col } = currentBlock;
    if (canMove(shape, row, col + 1)) {
      setCurrentBlock({ ...currentBlock, col: col + 1 });
    }
  };

  // Xoay khối
  const rotateBlock = () => {
    const { shape, row, col } = currentBlock;
    const newShape = shape[0]
      .map((_, i) => shape.map((row) => row[i]))
      .reverse();
    if (canMove(newShape, row, col)) {
      setCurrentBlock({ ...currentBlock, shape: newShape });
    }
  };

  // Hiển thị lưới
  const renderGrid = () => {
    const tempGrid = grid.map((row) => row.slice());
    currentBlock.shape.forEach((shapeRow, r) => {
      shapeRow.forEach((cell, c) => {
        if (cell) {
          tempGrid[currentBlock.row + r][currentBlock.col + c] =
            currentBlock.color;
        }
      });
    });
    return tempGrid.map((rowArray, rowIndex) => (
      <div key={rowIndex} className="block-stacking-row">
        {rowArray.map((cell, colIndex) => (
          <div
            key={colIndex}
            className={`block-stacking-cell ${cell ? cell : ""}`}></div>
        ))}
      </div>
    ));
  };

  const startGame = () => {
    setGameStarted(true);
    setGameOver(false);
    setPaused(false);
    setGrid(initialGrid);
    setCurrentBlock(generateRandomBlock());
  };

  const pauseGame = () => {
    setPaused((prevPaused) => !prevPaused);
  };

  const restartGame = () => {
    setGameStarted(false);
    setGameOver(false);
    setPaused(false);
    setGrid(initialGrid);
    setCurrentBlock(generateRandomBlock());
    setScore(0);
  };

  useEffect(() => {
    if (gameOver) {
      const timer = setTimeout(() => {
        restartGame();
      }, 5000); // Delay of 5 seconds before restarting the game

      return () => clearTimeout(timer);
    }
  }, [gameOver]);

  const goBackToMenu = () => {
    navigate("/");
  };

 return (
    <div className="block-stacking-game-container">
      <h1>Block Stacking Game</h1>
      <div className="block-stacking-controls">
        {!gameStarted && !gameOver && (
          <>
           
            <button onClick={startGame} className="block-start-button">
              Start Game
            </button>
            <button onClick={goBackToMenu} className="block-back-button">
              Home
            </button>
          </>
        )}
        {gameStarted && !gameOver && (
          <>
            <button onClick={pauseGame} className="block-pause-button">
              {paused ? "Resume" : "Pause"}
            </button>
            <button onClick={restartGame} className="block-restart-button">
              Restart Game
            </button>
            <button onClick={goBackToMenu} className="block-back-button">
              Back to Menu
            </button>
          </>
        )}
        {gameOver && (
          <button onClick={restartGame} className="block-restart-button">
            Restart Game
          </button>
        )}
      </div>
      <div className="block-stacking-grid">{renderGrid()}</div>
      <div className="block-stacking-score">Score: {score}</div>
      {gameOver && <div className="block-stacking-game-over">Game Over</div>}
    </div>
  );
};

export default BlockStackingGame;
