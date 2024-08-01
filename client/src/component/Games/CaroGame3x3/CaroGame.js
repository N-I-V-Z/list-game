import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import { message } from "antd";
import "./CaroGame.css";
import config from "../../../config/config";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../utils/axiosConfig";
import { store } from "../../..";
import Rank from "../../Top10/Rank";

// Khởi tạo kết nối Socket.IO
const socket = io(`${config.API_ROOT}`);

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

  const user = store?.getState()?.username;

  // Lấy danh sách phòng game loại caro3x3 hợp lệ để vào
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await axios.get(`${config.API_ROOT}/roomsCaro3x3`);
        setRooms(response.data);
      } catch (error) {
        console.error("Error fetching rooms:", error);
      }
    };

    fetchRooms();
  }, []);

  // useEffect này dùng để lấy thông tin từ server ngay khi nhận được
  useEffect(() => {
    // về real time (socket.io) thì ở đây sẽ giải thích một lần:
    // socket.on("1 key nào đó", (giá trị nhận được) => { (phần xử lý giá trị đó) })
    // dòng này là sẽ nhận giá trị có key là "playerRole", có thể qua file server/server.js dòng 59 để xem
    // những dòng dưới tương tự, socket.on là xử lý khi server truyền lên 1 dữ liệu nào đó
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
    const addPoint = async () => {
      try {
        await axiosInstance.post("/api/scores/add-score", {
          game: "Caro 3x3",
          username: user,
          score: 1,
        });
      } catch (error) {
        console.log("Fail to add point");
      }
    };
    const winner = calculateWinner(board);
    if (winner) {
      if (winner === "Draw") {
        setWinner("Draw");
        setShowReplay(true);
        message.success(`Draw`);
      } else {
        setWinner(winner);
        if (player === winner && user) addPoint();
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
    <div className="game-page-caro3x3">
      {!roomFull ? (
        <div className="choose-room-caro3x3">
          <Rank game={"Caro 3x3"} />

          <button onClick={handleClickk} className="navigate-button-caro3x3">
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
        <div className="game-caro3x3">
          <div className="game-info-caro3x3">
            <div>
              You: {player} ,Current Player: {currentPlayer} <br />
              <p>
                {winner &&
                  (winner === "Draw" ? <>Draw</> : <>Winner: {winner}</>)}
              </p>
            </div>
            {showReplay && !replayRequest && (
              <div>
                <button
                  className="button-replay-caro-caro3x3"
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
          <div className="game-board-caro3x3">
            <Board squares={board} onClick={(i) => handleClick(i)} />
          </div>
          <button onClick={handleClickk} className="navigate-button-caro3x3">
            Home
          </button>
        </div>
      )}
    </div>
  );
}

function Board({ squares, onClick }) {
  return (
    <div className="board-caro3x3">
      {squares.map((square, index) => (
        <button
          key={index}
          className="square-caro3x3"
          onClick={() => onClick(index)}
        >
          <span className="XO-caro3x3">{square}</span>
        </button>
      ))}
    </div>
  );
}

export default CaroGame;
