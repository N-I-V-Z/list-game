import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import { message } from "antd";
import "./CaroTrack.css";
import config from "../../../config/config";
import { useNavigate } from "react-router-dom";

const socket = io(`${config.API_ROOT}`);

function CaroTrack() {
  const [room, setRoom] = useState("");
  const [rooms, setRooms] = useState([]);
  const [player, setPlayer] = useState("");
  const [board, setBoard] = useState(Array(16).fill(null));
  const [roomFull, setRoomFull] = useState(false);
  const [currentPlayer, setCurrentPlayer] = useState("X");
  const [winner, setWinner] = useState("");
  const [showReplay, setShowReplay] = useState(false);
  const [replayRequest, setReplayRequest] = useState(false);

  // Lấy danh sách phòng game loại caro-track hợp lệ để vào
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await axios.get(`${config.API_ROOT}/roomsCaroTrack`);
        setRooms(response.data);
      } catch (error) {
        console.error("Error fetching rooms:", error);
      }
    };

    fetchRooms();
  }, []);

  // useEffect này dùng để lấy thông tin từ server ngay khi nhận được
  useEffect(() => {
    // phần này bên caro-track giải thích rồi
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
      setBoard(Array(16).fill(null));
      setWinner("0");
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
    socket.emit("joinRoomCaroTrack", roomName || room);
  };

  // Xử lý việc nhấp vào ô trên bảng
  const handleClick = (index) => {
    if (board[index] || calculateWinner(board)) return;
    if (player !== currentPlayer) return;

    socket.emit("makeMove", { index, player });
  };

  // Tính người chiến thắng hoặc xác nhận đấu hòa
  const calculateWinner = (squares) => {
    // 0  1  2  3
    // 4  5  6  7
    // 8  9 10 11
    //12 13 14 15
    let winner = [];
    // tính hàng dọc
    for (let i = 0; i < 4; i++) {
      if (
        squares[i] &&
        squares[i] === squares[i + 4] &&
        squares[i] === squares[i + 8] &&
        squares[i] === squares[i + 12]
      ) {
        winner.push(squares[i]);
      }
    }
    // tính hàng ngang
    for (let i = 0; i < 16; i += 4) {
      if (
        squares[i] &&
        squares[i] === squares[i + 1] &&
        squares[i] === squares[i + 2] &&
        squares[i] === squares[i + 3]
      ) {
        winner.push(squares[i]);
      }
    }
    // tính đường chéo, vì chỉ có 2 đường chéo nên if luôn
    if (
      squares[0] &&
      squares[0] === squares[5] &&
      squares[0] === squares[10] &&
      squares[0] === squares[15]
    ) {
      winner.push(squares[0]);
    }
    if (
      squares[3] &&
      squares[3] === squares[6] &&
      squares[3] === squares[9] &&
      squares[0] === squares[12]
    ) {
      winner.push(squares[3]);
    }
    let fnWinner;
    if (winner.length === 1) {
      fnWinner = winner[0];
    } else if (winner.length >= 2) {
      fnWinner = currentPlayer === "X" ? "O" : "X";
    }
    winner.fill(null);
    if (fnWinner) return fnWinner;

    // const lines = [
    //   [0, 1, 2, 3],
    //   [4, 5, 6, 7],
    //   [8, 9, 10, 11],
    //   [12, 13, 14, 15],
    //   [0, 4, 8, 12],
    //   [1, 5, 9, 13],
    //   [2, 6, 10, 14],
    //   [3, 7, 11, 15],
    //   [0, 5, 10, 15],
    //   [3, 6, 9, 12]
    // ];
    // for (let i = 0; i < lines.length; i++) {
    //   const [a, b, c] = lines[i];
    //   if (
    //     squares[a] &&
    //     squares[a] === squares[b] &&
    //     squares[a] === squares[c]
    //   ) {
    //     return squares[a]; // Trả về người chiến thắng ('X' hoặc 'O')
    //   }
    // }
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
  const navigate = useNavigate();
  const handleClickk = () => {
    navigate("/");
  };
  return (
    <div className="game-page-caro-track">
      {!roomFull ? (
        <div className="choose-room-caro-track">
          <button onClick={handleClickk} className="navigate-button-caro-track">
            Home
          </button>
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
        <div className="game-caro-track">
          <div className="game-info-caro-track">
            <div>
              You: {player} ,Current Player: {currentPlayer} <br />
            </div>
            {showReplay && !replayRequest && (
              <div>
                <button
                  className="button-replay-caro-caro-track"
                  onClick={handleReplay}
                >
                  Replay
                </button>
              </div>
            )}
            {replayRequest && (
              <div>
                <button onClick={handleAcceptReplay}>Accept Replay</button>
                <button onClick={() => setReplayRequest(false)}>Decline</button>
              </div>
            )}
          </div>
          <div className="game-board-caro-track">
            <Board squares={board} onClick={(i) => handleClick(i)} />
          </div>
          <button onClick={handleClickk} className="navigate-button-caro-track">
            Home
          </button>
        </div>
      )}
    </div>
  );
}

function Board({ squares, onClick }) {
  return (
    <div className="board-caro-track">
      {squares.map((square, index) => (
        <button
          key={index}
          className="square-caro-track"
          onClick={() => onClick(index)}
        >
          <span className="XO-caro-track">{square}</span>
        </button>
      ))}
    </div>
  );
}

export default CaroTrack;
