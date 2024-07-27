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

  // Lấy danh sách phòng từ server
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await axios.get("http://localhost:5000/rooms");
        setRooms(response.data);
      } catch (error) {
        console.error("Error fetching rooms:", error);
      }
    };

    fetchRooms();
  }, []);

  // Kết nối và xử lý sự kiện từ server
  useEffect(() => {
    socket.on("playerRole", (role) => {
      setPlayer(role);
      setRoomFull(true);
    });

    socket.on("currentPlayer", (currentPlayer) => {
      setCurrentPlayer(currentPlayer);
    })

    socket.on("boardUpdate", (newBoard) => {
      setBoard(newBoard);
    });

    socket.on("roomFull", () => {
      message.error("Room full");
      setRoomFull(false);
    });

    return () => {
      socket.off("playerRole");
      socket.off("boardUpdate");
      socket.off("roomFull");
    };
  }, []);

  // Xử lý việc tham gia vào phòng
  const handleJoin = (roomName) => {
    if (room.length === 0 && roomName.length === 0) {
      message.error("Missing input");
      return;
    }
    socket.emit("joinRoom", roomName || room);
  };

  // Xử lý việc nhấp vào ô trên bảng
  const handleClick = (index) => {
    if (board[index] || calculateWinner(board)) return;
    if (player !== currentPlayer) return;

    socket.emit("makeMove", { index, player });
  };

  // Tính toán người chiến thắng
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
        return squares[a];
      }
    }
    return null;
  };

  const winner = calculateWinner(board);
  if (winner !== null) message.success(`${winner} Win`)

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
            {rooms.map((roomName, index) => (
              <li key={index}>
                <button onClick={() => handleJoin(roomName)}>{roomName}</button>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="game">
          <div className="game-board">
            <Board squares={board} onClick={(i) => handleClick(i)} />
          </div>
          <div className="game-info">
            <div>
              You: {player} Current Player: {currentPlayer}
            </div>
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
