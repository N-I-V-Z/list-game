import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ChooseRoom.css';
import { message } from 'antd';

function ChooseRoom() {
  const [room, setRoom] = useState('');
  const [rooms, setRooms] = useState([]);
  const [player, setPlayer] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await axios.get('http://localhost:5000/rooms');
        setRooms(response.data);
      } catch (error) {
        console.error('Error fetching rooms:', error);
      }
    };

    fetchRooms();
  }, []);

  const handleJoin = (roomName) => {
    if (player.length === 0){
        message.error('Please enter your name');
        return;
    }
    navigate(`/caro-game/${roomName || room}`);
  };

  return (
    <div className="choose-room">
      <h2>Choose or Create a Room</h2>
      <input
        type="text"
        value={player}
        onChange={(e) => setPlayer(e.target.value)}
        placeholder="Enter your name"
      />
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
  );
}

export default ChooseRoom;
