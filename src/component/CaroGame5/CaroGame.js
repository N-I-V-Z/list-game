import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import { message } from "antd";
import "./CaroGame.css";
import config from "../../config/config";
import { useNavigate } from 'react-router-dom';
// Khởi tạo kết nối Socket.IO
const socket = io(`${config.API_ROOT}`);

function CaroGameBoard() {
  const [room, setRoom] = useState("");
  const [rooms, setRooms] = useState([]);
  const [player, setPlayer] = useState("");
  const [board, setBoard] = useState(Array(680).fill(null));
  const [roomFull, setRoomFull] = useState(false);
  const [currentPlayer, setCurrentPlayer] = useState("X");
  const [winner, setWinner] = useState("");
  const [showReplay, setShowReplay] = useState(false);
  const [replayRequest, setReplayRequest] = useState(false);

  // Lấy danh sách phòng game loại caro3x3 hợp lệ để vào
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await axios.get(`${config.API_ROOT}/roomsCaro5`);
        setRooms(response.data);
      } catch (error) {
        console.error("Error fetching rooms:", error);
      }
    };

    fetchRooms();
  }, []);

  // Lấy thông tin cần thiết trong phòng khi tham gia
  useEffect(() => {
    socket.on("playerRole", (role) => {
      setPlayer(role);
      setRoomFull(true);
    });

    socket.on("currentPlayer", (currentPlayer) => {
      setCurrentPlayer(currentPlayer);
    });

    socket.on("boardUpdate", (newBoard) => {
      setBoard(newBoard);
    });

    socket.on("roomFull", () => {
      message.error("Room full");
      setRoomFull(false);
    });

    socket.on("replayRequest", () => {
      setReplayRequest(true);
      message.info("The other player wants to replay. Accept?");
    });

    socket.on("replayAccepted", () => {
      setBoard(Array(680).fill(null));
      setWinner("");
      setCurrentPlayer("X");
      setShowReplay(false);
      setReplayRequest(false);
    });

    return () => {
      socket.off("playerRole");
      socket.off("boardUpdate");
      socket.off("roomFull");
      socket.off("replayRequest");
      socket.off("replayAccepted");
    };
  }, []);
  const navigate = useNavigate();
  // Tham gia vào phòng game
  const handleJoin = (roomName) => {
    if (!roomName && !room) {
      message.error("Missing input");
      return;
    }
    socket.emit("joinRoomCaro5", roomName || room);
  };

  // Xử lý việc nhấp vào ô trên bảng
  const handleClick = (index) => {
    if (board[index] || calculateWinner(board)) return;
    if (player !== currentPlayer) return;

    socket.emit("makeMove", { index, player });
  };

  // Tính người chiến thắng hoặc xác nhận đấu hòa
  const calculateWinner = (squares) => {
    const rows = 20; // Số hàng của bàn cờ
    const cols = 34; // Số cột của bàn cờ
    const WIN_LENGTH = 5; // Số quân cần thiết để thắng

    // Kiểm tra hàng ngang
    for (let r = 0; r < rows; r++) {
      // for từng hàng
      for (let c = 0; c <= cols - WIN_LENGTH; c++) {
        // for từng cột trong hàng (không chạy 4 ô cuối trong hàng vì không cần thiết)
        const line = squares.slice(r * cols + c, r * cols + c + WIN_LENGTH); // vì bàn cờ là dạng mảng nên đoạn này sẽ lấy 1 đoạn ngang trong mảng (check từng vị trí)
        if (line.every((cell) => cell !== null && cell === line[0])) {
          // kiểm tra đoạn đã lấy
          return line[0];
        }
      }
    }

    // Kiểm tra cột dọc
    for (let c = 0; c < cols; c++) {
      // for từng cột
      for (let r = 0; r <= rows - WIN_LENGTH; r++) {
        // for từng hàng trong cột
        let line = [];
        for (let i = 0; i < WIN_LENGTH; i++) {
          line.push(squares[(r + i) * cols + c]); // lấy 5 ô liên tiếp theo cột
        }
        if (line.every((cell) => cell !== null && cell === line[0])) {
          // kiểm tra 5 ô đó có trùng hay không
          return line[0];
        }
      }
    }

    // Kiểm tra đường chéo từ trên trái xuống dưới phải
    for (let r = 0; r <= rows - WIN_LENGTH; r++) {
      // for mỗi hàng không lấy 4 hàng cuối vì đang check đường chéo trên trái xuống dưới phải
      for (let c = 0; c <= cols - WIN_LENGTH; c++) {
        // for mỗi cột không lấy 4 cột cuối vì đang check đường chéo trên trái xuống dưới phải
        let line = [];
        for (let i = 0; i < WIN_LENGTH; i++) {
          line.push(squares[(r + i) * cols + (c + i)]); // lấy 5 ô theo đường chéo
        }
        if (line.every((cell) => cell !== null && cell === line[0])) {
          // kiểm tra 5 ô vừa lấy
          return line[0];
        }
      }
    }

    // Kiểm tra đường chéo từ dưới trái lên trên phải
    for (let r = WIN_LENGTH - 1; r < rows; r++) {
      for (let c = 0; c <= cols - WIN_LENGTH; c++) {
        let line = [];
        for (let i = 0; i < WIN_LENGTH; i++) {
          line.push(squares[(r - i) * cols + (c + i)]);
        }
        if (line.every((cell) => cell !== null && cell === line[0])) {
          return line[0];
        }
      }
    }

    // Nếu không có ai thắng và bàn cờ chưa đầy, trả về null
    return squares.every((cell) => cell !== null) ? "Draw" : null;
  };

  // hiện thông báo khi có người chiến thắng hoặc hòa
  useEffect(() => {
    const winner = calculateWinner(board);
    if (winner) {
      if (winner === "Draw") {
        setWinner("Draw");
        setShowReplay(true);
        message.success(`Draw`);
      } else {
        setWinner(winner);
        setShowReplay(true);
        message.success(`${winner} Wins`);
      }
    }
  }, [board]);

  const handleReplay = () => {
    socket.emit("replay");
    setShowReplay(false);
  };
  // khi chấp nhận đâus lại thì sẽ gửi yêu cầu xử lý sang server
  const handleAcceptReplay = () => {
    socket.emit("acceptReplay");
    setReplayRequest(false);
  };
  
  const handleClickk = () => {
    navigate('/');
  };

  return (
    <div className="game-container">
      {!roomFull ? (
        <div className="choose-room">
          <button onClick={handleClickk} className="navigate-button">Home</button>
          <h2>Choose or Create a Room</h2>
          <input
            type="text"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
            placeholder="Enter room name"
          />
          <button onClick={() => handleJoin()}>Join or Create Room</button>

          <h3>Available Rooms:</h3>
          <ul>
            {rooms.length > 0 ? (
              rooms.map((roomName, index) => (
                <li key={index}>
                  <button onClick={() => handleJoin(roomName)}>
                    {roomName}
                  </button>
                </li>
              ))
            ) : (
              <li>No rooms available</li>
            )}
          </ul>
        </div>
      ) : (
        <div className="game-board">
          <div className="game-info">
            <div>
              You: {player} Current Player: {currentPlayer}{" "}
              {winner &&
                (winner === "Draw" ? <>Draw</> : <>Winner: {winner}</>)}
            </div>
            {showReplay && !replayRequest && (
              <div>
                <button onClick={handleReplay}>Replay</button>
              </div>
            )}
            {replayRequest && (
              <div>
                <button onClick={handleAcceptReplay}>Accept Replay</button>
                <button onClick={() => setReplayRequest(false)}>Decline</button>
              </div>
            )}
          </div>
          <Board squares={board} onClick={(i) => handleClick(i)} />
        </div>
      )}
    </div>
  );
}

function Board({ squares, onClick }) {
  return (
    <div className="caro-board">
      {squares.map((square, index) => (
        <button
          key={index}
          className="caro-square"
          onClick={() => onClick(index)}
        >
          {square}
        </button>
      ))}
    </div>
  );
}

export default CaroGameBoard;
