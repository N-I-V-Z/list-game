const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

let rooms = {};

app.get('/roomsCaro3x3', (req, res) => {
  const caro3x3Rooms = Object.keys(rooms).filter(roomName => 
    rooms[roomName].type === 'caro3x3' && rooms[roomName].players.length < 2
  );
  res.json(caro3x3Rooms);
});

io.on('connection', (socket) => {

  socket.on('joinRoomCaro3x3', (room) => {
    socket.join(room);
    // tạo room nếu phòng chưa có
    if (!rooms[room]) {
      rooms[room] = {
        board: Array(9).fill(null),
        players: [],
        currentPlayer: null,
        type: 'caro3x3'
      };
    }
    // tạo player và role của họ
    let player;
    if (rooms[room].players.length === 0) {
      player = 'X';
      rooms[room].currentPlayer = 'X';
    } else if (rooms[room].players.length === 1) {
      player = 'O';
    } else {
      socket.emit('roomFull', room);
      return;
    }

    // gửi về người dùng role của họ và update lượt đánh nếu có
    rooms[room].players.push(socket.id);
    socket.emit('playerRole', player);
    socket.emit('boardUpdate', rooms[room].board);
    // thay đổi ô trên board và chuyển người chơi khi có người đánh
    socket.on('makeMove', ({ index, player }) => {
      if (rooms[room] && rooms[room].board[index] === null && player === rooms[room].currentPlayer) {
        rooms[room].board[index] = player;
        rooms[room].currentPlayer = player === 'X' ? 'O' : 'X'; // Toggle player
        io.to(room).emit('currentPlayer', rooms[room].currentPlayer);
        io.to(room).emit('boardUpdate', rooms[room].board);
      }
    });

    socket.on('disconnect', () => {
      if (rooms[room]) {
        rooms[room].players = rooms[room].players.filter((id) => id !== socket.id);
        if (rooms[room].players.length === 0) {
          delete rooms[room];
        }
        console.log('user disconnected:', socket.id);
      }
    });
  });
});

server.listen(5000, () => {
  console.log("listening on http://localhost:5000");
});