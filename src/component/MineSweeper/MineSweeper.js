import React, { useState, useEffect } from "react";
import { Button, message } from "antd";
import "./MineSweeper.css";

const MineSweeper = () => {
  const [board, setBoard] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [difficulty, setDifficulty] = useState("easy");

  useEffect(() => {
    startNewGame();
  }, [difficulty]);

  // hàm để bắt đầu 1 game
  const startNewGame = () => {
    let rows, cols, minesCount;
    // thay đổi dòng, cột và số lượng mìn theo độ khó đã chọn
    switch (difficulty) {
      case "easy":
        rows = 10;
        cols = 10;
        minesCount = 10;
        break;
      case "medium":
        rows = 20;
        cols = 20;
        minesCount = 40;
        break;
      case "hard":
        rows = 20;
        cols = 30;
        minesCount = 80;
        break;
      default:
        rows = 10;
        cols = 10;
        minesCount = 10;
    }
    setBoard(createBoard(rows, cols, minesCount));
    setGameOver(false);
  };

  // hàm tạo 1 bảng để chơi
  const createBoard = (rows, cols, minesCount) => {
    let board = Array(rows)
      .fill()
      .map(() =>
        // tạo mảng mới với rows phần tử, hàm fill dùng để chèn null hoặc undefine và tất cả phần tử vừa được tạo. Map thì giống với foreach
        Array(cols)
          .fill()
          .map(() => ({
            // thì mỗi phần tử trên sẽ chứa 1 phần tử khác cũng là dạng mảng, có thể hiểu mà mảng trong mảng. Ví dụ rows = 3, cols = 2 thì đầu tiên board sẽ có 3 phần tử, sau đó mỗi phần tử trong 3 phần tử đó sẽ chứa 1 mảng với 2 phần tử.
            hasMine: false,
            isOpen: false,
            isFlagged: false,
            neighboringMines: 0,
            // mảng vừa được tạo sẽ không chứa giá trị null hoặc undefine mà sẽ bao gồm các thuộc tính trên, đại diện cho: có mìn hay không, đã mở chưa, có cờ không và số lượng mìn ở gần đó
          }))
      );

    // khúc này là bắt đầu phát random số mìn
    let minesPlaced = 0;
    while (minesPlaced < minesCount) {
      // phát đủ số mìn mình muốn thì ngừng
      const row = Math.floor(Math.random() * rows); // hàm này bên trò ColorTest có giải thích
      const col = Math.floor(Math.random() * cols);
      if (!board[row][col].hasMine) {
        // nếu ô được chọn từ random mà chưa có mìn thì sẽ set lại thuộc tính là đã có mìn
        board[row][col].hasMine = true;
        minesPlaced++;
      }
    }

    // hàm này nhìn là biết khá phức tạp, nói đơn giản thì chỉ là tính số lượng mìn xung quanh 1 ô
    for (let r = 0; r < rows; r++) {
      // chạy từng hàng
      for (let c = 0; c < cols; c++) {
        // chạy từng cột
        if (!board[r][c].hasMine) {
          // nếu mà ô nào không phải là mìn thì mới tính số mìn xung quanh
          let neighboringMines = 0;
          for (let i = -1; i <= 1; i++) {
            // vì sao lại chỉ có -1 đến 1, vì việc kiểm tra số mìn xung quanh chỉ cần đếm số mìn quanh mình, có nghĩa là cách mình 1 ô, for này là xét theo chiều dọc
            for (let j = -1; j <= 1; j++) {
              // như trên nhưng là chiều ngang
              if (r + i >= 0 && r + i < rows && c + j >= 0 && c + j < cols) {
                // kiểm tra ô đang được kiểm tra có nằm trong bảng không
                if (board[r + i][c + j].hasMine) {
                  // if này sẽ đếm số mình xung quanh và cộng vào
                  neighboringMines++;
                }
              }
            }
          }
          board[r][c].neighboringMines = neighboringMines; // set số mìn đếm được vào ô đang đếm
        }
      }
    }
    // đếm xong hết sẽ trả ra bảng đã set đủ thuộc tính để chơi
    return board;
  };

  // hàm xử lí việc chọn 1 ô bất kì
  const handleClick = (row, col) => {
    if (gameOver || board[row][col].isOpen || board[row][col].isFlagged) return; // check các điều kiện trước khi chọn

    const newBoard = [...board]; // sao chép bảng hiện tại sang 1 bảng mới
    newBoard[row][col].isOpen = true; // set ô đã chọn mở lên
    setBoard(newBoard); // set bảng mới vừa cập nhật vào bảng đang chơi. Còn về lý do vì sao không thay đổi trực tiếp trên bảng cũ mà phải copy ra để thay đổi thì có vài lý do chính sau: React cần biết khi nào state thay đổi, nếu thay đổi trực tiếp trên board cũ thì có thể state không nhận biết được sự thay đổi và không cập nhật giao diện người dùng. Dễ quản lý và theo dỗi hơn, ... một số lý do nữa có thể lên mạng tìm hiểu

    if (board[row][col].hasMine) {
      // nếu ô được chọn có mìn thì game over
      setGameOver(true);
      message.error("Game Over!");
    } else if (board[row][col].neighboringMines === 0) {
      // nếu ô được chọn không có mìn thì mở các ô trống
      openEmptyCells(newBoard, row, col);
      setBoard(newBoard);
    }
  };

  // hàm xử lý khi nhấn chuột phải (đặt cờ)
  const handleRightClick = (row, col, event) => {
    event.preventDefault(); // chặn menu xuất hiện khi nhấp chuột phải, còn về làm sao để biết mình nhấp chuột phải thì trong thẻ div onClick là nhấp chuột trái thì onContextMenu là nhấp chuột phải
    if (gameOver || board[row][col].isOpen) return; // check một số thông tin trước khi thực hiện

    const newBoard = [...board]; // copy 1 bản mới của board hiện tại
    newBoard[row][col].isFlagged = !newBoard[row][col].isFlagged; // set flag cho ô vừa nhận
    setBoard(newBoard); // cập nhật lại bảng
  };

  // hàm xử lý khi chọn 1 ô trống
  const openEmptyCells = (board, row, col) => {
    const rows = board.length; // lấy số hàng của board
    const cols = board[0].length; // số cột của board

    const directions = [
      [-1, -1],
      [-1, 0],
      [-1, 1],
      [0, -1],
      [0, 1],
      [1, -1],
      [1, 0],
      [1, 1],
    ]; // đây là các vị trí xung quanh của 1 ô

    for (let i = 0; i < directions.length; i++) {
      // chạy từng vị trí xung quanh
      const [dx, dy] = directions[i]; // lấy giá trị của từng vị trí
      const newRow = row + dx; // lấy vị trí hàng của ô xung quanh
      const newCol = col + dy; // lấy vị trí cột

      if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols) {
        // đảm bảo ô đang xét không vượt qua phạm vi của bảng
        if (!board[newRow][newCol].isOpen && !board[newRow][newCol].hasMine) {
          // nếu ô đó chưa mở và không có mìn thì mở
          board[newRow][newCol].isOpen = true;
          if (board[newRow][newCol].neighboringMines === 0) {
            // nếu ô vừa mở vẫn là 1 ô trống thì gọi đệ qui lại hàm để tiếp tục mở các ô trống liên tiếp
            openEmptyCells(board, newRow, newCol);
          }
        }
      }
    }
  };

  return (
    <div className="container-minesweeper">
      <h2>MineSweeper Game</h2>
      <div>
        <label>Difficulty: </label>
        <select
          onChange={(e) => setDifficulty(e.target.value)}
          value={difficulty}
        >
          <option value="easy">Easy (10x10, 10 mines)</option>
          <option value="medium">Medium (20x20, 40 mines)</option>
          <option value="hard">Hard (20x30, 80 mines)</option>
        </select>
      </div>
      {gameOver && <Button onClick={startNewGame}>Try Again</Button>}
      {board.map((row, r) => (
        <div key={r} style={{ display: "flex" }}>
          {row.map((cell, c) => (
            <div
              key={c}
              onClick={() => handleClick(r, c)}
              onContextMenu={(e) => handleRightClick(r, c, e)}
              style={{
                width: 30,
                height: 30,
                border: "1px solid black",
                textAlign: "center",
                lineHeight: "30px",
                backgroundColor: cell.isOpen ? "#ddd" : "#aaa",
                cursor: "pointer",
              }}
            >
              {cell.isOpen
                ? cell.hasMine
                  ? "💣"
                  : cell.neighboringMines || ""
                : cell.isFlagged
                ? "🚩"
                : ""}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default MineSweeper;
