const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = new Server(server);

let rooms = {};

app.get('/rooms', (req, res) => {
  res.json(Object.keys(rooms));
});

io.on('connection', (socket) => {
  console.log('a user connected:', socket.id);

  socket.on('joinRoom', (room) => {
    socket.join(room);
    if (!rooms[room]) {
      rooms[room] = Array(9).fill(null);
    }
    socket.emit('boardUpdate', rooms[room]);
  });

  socket.on('makeMove', ({ room, index, player }) => {
    if (rooms[room] && rooms[room][index] === null) {
      rooms[room][index] = player;
      io.to(room).emit('boardUpdate', rooms[room]);
    }
  });

  socket.on('disconnect', () => {
    console.log('user disconnected:', socket.id);
  });
});

server.listen(5000, () => {
  console.log('listening on http://localhost:5000');
});
