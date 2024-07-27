import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import { message } from "antd";
import "./CaroGame.css";

// Khởi tạo kết nối Socket.IO
const socket = io("http://localhost:5000");

function CaroGame() {
  const [room, setRoom] = useState("");
  const [rooms, setRooms] = useState([]);
  const [player, setPlayer] = useState("");
  const [board, setBoard] = useState(Array(9).fill(null));
  const [roomFull, setRoomFull] = useState(false);
  const [currentPlayer, setCurrentPlayer] = useState("X");
  const [winner, setWinner] = useState("");
  const [showReplay, setShowReplay] = useState(false);
  const [replayRequest, setReplayRequest] = useState(false);

  // Lấy danh sách phòng game loại caro3x3 hợp lệ để vào
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await axios.get("http://localhost:5000/roomsCaro3x3");
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
      setBoard(Array(9).fill(null));
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

  // Tham gia vào phòng game
  const handleJoin = (roomName) => {
    if (!roomName && !room) {
      message.error("Missing input");
      return;
    }
    socket.emit("joinRoomCaro3x3", roomName || room);
  };

  // Xử lý việc nhấp vào ô trên bảng
  const handleClick = (index) => {
    if (board[index] || calculateWinner(board)) return;
    if (player !== currentPlayer) return;

    socket.emit("makeMove", { index, player });
  };

  // Tính người chiến thắng hoặc xác nhận đấu hòa
  const calculateWinner = (squares) => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (
        squares[a] &&
        squares[a] === squares[b] &&
        squares[a] === squares[c]
      ) {
        return squares[a]; // Trả về người chiến thắng ('X' hoặc 'O')
      }
    }
    return squares.every((square) => square !== null) ? "Draw" : null; // Trả về 'Draw' nếu hòa
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

  return (
    <div className="game-page">
      {!roomFull ? (
        <div className="choose-room">
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
        <div className="game">
          <div className="game-board">
            <Board squares={board} onClick={(i) => handleClick(i)} />
          </div>
          <div className="game-info">
            <div>
              You: {player} Current Player: {currentPlayer}{" "}
              {winner && winner === "Draw" ? <>Draw</> : <>Winner: {winner}</>}
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
        </div>
      )}
    </div>
  );
}

function Board({ squares, onClick }) {
  return (
    <div className="board">
      {squares.map((square, index) => (
        <button key={index} className="square" onClick={() => onClick(index)}>
          {square}
        </button>
      ))}
    </div>
  );
}

export default CaroGame;
