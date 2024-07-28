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

app.get('/roomsCaro5', (req, res) => {
  const caro5Rooms = Object.keys(rooms).filter(roomName => 
    rooms[roomName].type === 'caro5' && rooms[roomName].players.length < 2
  );
  res.json(caro5Rooms);
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
    if (rooms[room].players.length === 0) { // phòng trống thì người chơi sẽ là X
      player = 'X';
      rooms[room].currentPlayer = 'X';
    } else if (rooms[room].players.length === 1) { // phòng đã có người thì người chơi sẽ là O
      player = 'O';
    } else { // đủ 2 người thì gửi thông tin phòng full về
      socket.emit('roomFull', room);
      return;
    }

    // gửi về người dùng role của họ và update lượt đánh nếu có
    // socket.emit là gửi lên phía client giá trị nào đó
    rooms[room].players.push(socket.id);
    socket.emit('playerRole', player);
    socket.emit('boardUpdate', rooms[room].board);

    // thay đổi ô trên board và chuyển người chơi khi có người đánh
    // socket.on là xử lý khi server nhận được 1 yêu cầu với key là "makeMove" sau đó sẽ xử lý
    socket.on('makeMove', ({ index, player }) => {
      if (rooms[room] && rooms[room].board[index] === null && player === rooms[room].currentPlayer) {
        // thay đổi thông tin trên bàn cờ và đặt lại người chơi hiện tại
        rooms[room].board[index] = player;
        rooms[room].currentPlayer = player === 'X' ? 'O' : 'X';
        // gửi về thông tin người chơi hiện tại và bàn cờ sau khi update
        io.to(room).emit('currentPlayer', rooms[room].currentPlayer);
        io.to(room).emit('boardUpdate', rooms[room].board);
      }
    });

    // gửi thông báo khi có yêu cầu đấu lại
    socket.on('replay', () => {
      // xác định người chơi nhận được thông báo replay
      const otherPlayer = rooms[room].players.find(id => id !== socket.id);
      if (otherPlayer) {
        // gửi thông tin yêu cầu đấu lại cho người chơi vừa tìm được
        io.to(otherPlayer).emit('replayRequest');
      }
    });
    // xử lý nếu chấp nhận đấu lại
    socket.on('acceptReplay', () => {
      if (rooms[room]) {
        // yêu cầu đc chấp nhận thì set lại bàn cờ và người chơi hiện tại
        rooms[room].board = Array(9).fill(null);
        rooms[room].currentPlayer = 'X';
        // gửi lên thông báo yêu cầu đấu lại đã được chấp nhận, bàn cờ đã được set lại và người chơi hiện tại
        io.to(room).emit('replayAccepted');
        io.to(room).emit('boardUpdate', rooms[room].board);
        io.to(room).emit('currentPlayer', rooms[room].currentPlayer);
      }
    });

    // phòng không còn người thì xóa phòng
    socket.on('disconnect', () => {
      if (rooms[room]) {
        rooms[room].players = rooms[room].players.filter((id) => id !== socket.id);
        if (rooms[room].players.length === 0) {
          delete rooms[room];
        }
      }
    });
  });

  socket.on('joinRoomCaro5', (room) => {
    socket.join(room);
    // tạo room nếu phòng chưa có
    if (!rooms[room]) {
      rooms[room] = {
        board: Array(680).fill(null),
        players: [],
        currentPlayer: null,
        type: 'caro5'
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

    // gửi thông báo khi có yêu cầu đấu lại
    socket.on('replay', () => {
      const otherPlayer = rooms[room].players.find(id => id !== socket.id);
      if (otherPlayer) {
        io.to(otherPlayer).emit('replayRequest');
      }
    });
    // xử lý nếu chấp nhận đấu lại
    socket.on('acceptReplay', () => {
      if (rooms[room]) {
        rooms[room].board = Array(680).fill(null);
        rooms[room].currentPlayer = 'X';
        io.to(room).emit('replayAccepted');
        io.to(room).emit('boardUpdate', rooms[room].board);
        io.to(room).emit('currentPlayer', rooms[room].currentPlayer);
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
