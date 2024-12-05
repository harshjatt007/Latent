// src/socketService.js
import { io } from 'socket.io-client';

// Connect to the Socket.IO server (replace with your server's URL if needed)
const socket = io('http://localhost:5000');

// Optionally, you can export specific events like sendNotification as well
export const sendNotification = () => {
  socket.emit('sendNotification');
};

export { socket }; // Export socket instance
